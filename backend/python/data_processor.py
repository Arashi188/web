import mysql.connector
import pandas as pd
from datetime import datetime
import json


class SchoolDataProcessor:
    def __init__(self):
        self.db_config = {
            'host': 'localhost',
            'user': 'root',
            'password': '',
            'database': 'school_management'
        }

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    def generate_grade_report(self, class_id=None, academic_year=None):
        """Generate comprehensive grade reports"""
        conn = self.get_connection()
        query = """
            SELECT 
                s.first_name, s.last_name, st.roll_number,
                c.class_name, sub.subject_name,
                g.grade, g.marks, g.term, g.academic_year
            FROM grades g
            JOIN students st ON g.student_id = st.id
            JOIN users s ON st.user_id = s.id
            JOIN classes c ON g.class_id = c.id
            JOIN subjects sub ON g.subject_id = sub.id
        """

        conditions = []
        params = []

        if class_id:
            conditions.append("g.class_id = %s")
            params.append(class_id)

        if academic_year:
            conditions.append("g.academic_year = %s")
            params.append(academic_year)

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        df = pd.read_sql(query, conn, params=params)
        conn.close()

        # Generate summary statistics
        summary = {
            'total_students': df['roll_number'].nunique(),
            'average_marks': df['marks'].mean(),
            'subject_performance': df.groupby('subject_name')['marks'].mean().to_dict(),
            'generated_at': datetime.now().isoformat()
        }

        return {
            'raw_data': df.to_dict('records'),
            'summary': summary
        }

    def calculate_class_averages(self):
        """Calculate class-wise average performance"""
        conn = self.get_connection()
        query = """
            SELECT 
                c.class_name,
                AVG(g.marks) as average_marks,
                COUNT(DISTINCT g.student_id) as student_count
            FROM grades g
            JOIN classes c ON g.class_id = c.id
            GROUP BY c.class_name
            ORDER BY average_marks DESC
        """

        df = pd.read_sql(query, conn)
        conn.close()

        return df.to_dict('records')


# Example usage
if __name__ == "__main__":
    processor = SchoolDataProcessor()

    # Generate sample report
    report = processor.generate_grade_report()
    print("Grade Report Summary:", json.dumps(report['summary'], indent=2))

    # Calculate class averages
    class_avgs = processor.calculate_class_averages()
    print("\nClass Averages:", class_avgs)