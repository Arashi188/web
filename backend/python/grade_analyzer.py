import mysql.connector
import pandas as pd
import json
from datetime import datetime, timedelta

class GradeAnalyzer:
    def __init__(self):
        self.db_config = {
            'host': 'localhost',
            'user': 'root',
            'password': '',
            'database': 'school_management'
        }
    
    def get_student_performance(self, student_id):
        """Get comprehensive performance data for a student"""
        conn = self.get_connection()
        
        query = """
            SELECT 
                s.subject_name,
                g.grade,
                g.marks,
                g.term,
                g.academic_year,
                g.created_at
            FROM grades g
            JOIN subjects s ON g.subject_id = s.id
            WHERE g.student_id = %s
            ORDER BY g.created_at DESC
        """
        
        df = pd.read_sql(query, conn, params=[student_id])
        conn.close()
        
        if df.empty:
            return {"error": "No grades found for this student"}
        
        # Calculate statistics
        summary = {
            'average_marks': round(df['marks'].mean(), 2),
            'total_subjects': df['subject_name'].nunique(),
            'latest_term': df.iloc[0]['term'],
            'performance_trend': self.calculate_trend(df),
            'strong_subjects': self.get_strong_subjects(df),
            'weak_subjects': self.get_weak_subjects(df)
        }
        
        return {
            'grades': df.to_dict('records'),
            'summary': summary
        }
    
    def calculate_trend(self, df):
        """Calculate performance trend over time"""
        try:
            df['created_at'] = pd.to_datetime(df['created_at'])
            df = df.sort_values('created_at')
            
            # Simple trend: compare first and last average
            early_avg = df.head(3)['marks'].mean()
            recent_avg = df.tail(3)['marks'].mean()
            
            if recent_avg > early_avg:
                return "improving"
            elif recent_avg < early_avg:
                return "declining"
            else:
                return "stable"
        except:
            return "unknown"
    
    def get_strong_subjects(self, df):
        """Identify subjects with highest marks"""
        subject_avg = df.groupby('subject_name')['marks'].mean()
        return subject_avg.nlargest(3).to_dict()
    
    def get_weak_subjects(self, df):
        """Identify subjects needing improvement"""
        subject_avg = df.groupby('subject_name')['marks'].mean()
        return subject_avg.nsmallest(3).to_dict()
    
    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

# Example usage
if __name__ == "__main__":
    analyzer = GradeAnalyzer()
    
    # Test with a sample student ID
    result = analyzer.get_student_performance(1)
    print("Student Performance Analysis:")
    print(json.dumps(result['summary'], indent=2))