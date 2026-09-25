import mysql.connector
import pandas as pd
from datetime import datetime

class TeacherAnalytics:
    def __init__(self):
        self.db_config = {
            'host': 'localhost',
            'user': 'root',
            'password': '',
            'database': 'school_management'
        }
    
    def get_teacher_performance(self, teacher_id):
        """Analyze teacher performance across classes"""
        conn = self.get_connection()
        
        query = """
            SELECT 
                c.class_name,
                s.subject_name,
                COUNT(DISTINCT g.student_id) as graded_students,
                AVG(g.marks) as average_marks,
                MIN(g.marks) as min_marks,
                MAX(g.marks) as max_marks
            FROM grades g
            JOIN class_subjects cs ON g.subject_id = cs.subject_id AND g.class_id = cs.class_id
            JOIN classes c ON g.class_id = c.id
            JOIN subjects s ON g.subject_id = s.id
            WHERE cs.teacher_id = %s
            GROUP BY c.class_name, s.subject_name
            ORDER BY average_marks DESC
        """
        
        df = pd.read_sql(query, conn, params=[teacher_id])
        conn.close()
        
        if df.empty:
            return {"message": "No grade data found for this teacher"}
        
        summary = {
            'total_classes': df['class_name'].nunique(),
            'total_subjects': df['subject_name'].nunique(),
            'overall_average': round(df['average_marks'].mean(), 2),
            'best_performing_class': self.get_best_class(df),
            'subject_analysis': self.get_subject_analysis(df)
        }
        
        return {
            'detailed_data': df.to_dict('records'),
            'summary': summary
        }
    
    def get_best_class(self, df):
        """Identify the class with highest average marks"""
        class_avg = df.groupby('class_name')['average_marks'].mean()
        best_class = class_avg.idxmax()
        return {
            'class_name': best_class,
            'average_marks': round(class_avg.max(), 2)
        }
    
    def get_subject_analysis(self, df):
        """Analyze performance by subject"""
        subject_stats = df.groupby('subject_name').agg({
            'average_marks': 'mean',
            'graded_students': 'sum'
        }).round(2)
        
        return subject_stats.to_dict('index')
    
    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

# Example usage
if __name__ == "__main__":
    analytics = TeacherAnalytics()
    
    # Analyze teacher with ID 1
    result = analytics.get_teacher_performance(1)
    print("Teacher Performance Analysis:")
    print("Summary:", result['summary'])
    print("\nDetailed Data Sample:")
    for item in result['detailed_data'][:3]:
        print(f"- {item['class_name']} - {item['subject_name']}: {item['average_marks']} avg")