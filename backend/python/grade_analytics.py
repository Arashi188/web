import mysql.connector
import pandas as pd
import json
from datetime import datetime

class GradeAnalytics:
    def __init__(self):
        self.db_config = {
            'host': 'localhost',
            'user': 'root',
            'password': '',
            'database': 'school_management'
        }
    
    def get_grade_distribution(self, teacher_id, class_id=None, subject_id=None):
        """Get grade distribution for teacher's classes"""
        conn = self.get_connection()
        
        query = """
            SELECT 
                g.grade,
                COUNT(*) as count,
                ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as percentage
            FROM grades g
            JOIN class_subjects cs ON g.class_id = cs.class_id AND g.subject_id = cs.subject_id
            WHERE cs.teacher_id = %s
        """
        
        params = [teacher_id]
        
        if class_id:
            query += " AND g.class_id = %s"
            params.append(class_id)
        
        if subject_id:
            query += " AND g.subject_id = %s"
            params.append(subject_id)
        
        query += " GROUP BY g.grade ORDER BY g.grade"
        
        df = pd.read_sql(query, conn, params=params)
        conn.close()
        
        return df.to_dict('records')
    
    def get_class_performance_comparison(self, teacher_id):
        """Compare performance across different classes"""
        conn = self.get_connection()
        
        query = """
            SELECT 
                c.class_name,
                c.section,
                COUNT(g.id) as total_grades,
                ROUND(AVG(g.marks), 2) as average_marks,
                MIN(g.marks) as min_marks,
                MAX(g.marks) as max_marks,
                ROUND(STD(g.marks), 2) as std_deviation
            FROM grades g
            JOIN classes c ON g.class_id = c.id
            JOIN class_subjects cs ON g.class_id = cs.class_id AND g.subject_id = cs.subject_id
            WHERE cs.teacher_id = %s
            GROUP BY c.class_name, c.section
            ORDER BY average_marks DESC
        """
        
        df = pd.read_sql(query, conn, params=[teacher_id])
        conn.close()
        
        return df.to_dict('records')
    
    def get_subject_performance_trend(self, teacher_id, subject_id):
        """Get performance trend for a subject over time"""
        conn = self.get_connection()
        
        query = """
            SELECT 
                g.term,
                g.academic_year,
                COUNT(g.id) as total_students,
                ROUND(AVG(g.marks), 2) as average_marks,
                ROUND(MIN(g.marks), 2) as min_marks,
                ROUND(MAX(g.marks), 2) as max_marks
            FROM grades g
            JOIN class_subjects cs ON g.class_id = cs.class_id AND g.subject_id = cs.subject_id
            WHERE cs.teacher_id = %s AND g.subject_id = %s
            GROUP BY g.term, g.academic_year
            ORDER BY g.academic_year, 
                     CASE g.term 
                         WHEN 'Term 1' THEN 1 
                         WHEN 'Term 2' THEN 2 
                         WHEN 'Term 3' THEN 3 
                         WHEN 'Final' THEN 4 
                     END
        """
        
        df = pd.read_sql(query, conn, params=[teacher_id, subject_id])
        conn.close()
        
        return df.to_dict('records')
    
    def generate_teacher_report(self, teacher_id):
        """Generate comprehensive report for teacher"""
        conn = self.get_connection()
        
        # Get basic teacher info
        teacher_query = "SELECT first_name, last_name FROM users WHERE id = %s"
        teacher_info = pd.read_sql(teacher_query, conn, params=[teacher_id]).iloc[0]
        
        # Get grade distribution
        grade_dist = self.get_grade_distribution(teacher_id)
        
        # Get class comparison
        class_comp = self.get_class_performance_comparison(teacher_id)
        
        # Get overall statistics
        stats_query = """
            SELECT 
                COUNT(DISTINCT g.student_id) as total_students,
                COUNT(DISTINCT g.class_id) as total_classes,
                COUNT(DISTINCT g.subject_id) as total_subjects,
                COUNT(g.id) as total_grades,
                ROUND(AVG(g.marks), 2) as overall_average
            FROM grades g
            JOIN class_subjects cs ON g.class_id = cs.class_id AND g.subject_id = cs.subject_id
            WHERE cs.teacher_id = %s
        """
        
        stats = pd.read_sql(stats_query, conn, params=[teacher_id]).iloc[0]
        conn.close()
        
        report = {
            'teacher_name': f"{teacher_info['first_name']} {teacher_info['last_name']}",
            'generated_at': datetime.now().isoformat(),
            'statistics': stats.to_dict(),
            'grade_distribution': grade_dist,
            'class_comparison': class_comp,
            'summary': self.generate_summary(stats, grade_dist, class_comp)
        }
        
        return report
    
    def generate_summary(self, stats, grade_dist, class_comp):
        """Generate human-readable summary"""
        total_a_grades = next((item['count'] for item in grade_dist if item['grade'] == 'A'), 0)
        a_percentage = next((item['percentage'] for item in grade_dist if item['grade'] == 'A'), 0)
        
        best_class = max(class_comp, key=lambda x: x['average_marks']) if class_comp else None
        
        summary = f"""
        Teaching Performance Summary:
        - Total Students: {stats['total_students']}
        - Classes Teaching: {stats['total_classes']}
        - Subjects Teaching: {stats['total_subjects']}
        - Overall Average: {stats['overall_average']}%
        - A Grades: {total_a_grades} ({a_percentage}%)
        {f"- Best Performing Class: {best_class['class_name']} ({best_class['average_marks']}%)" if best_class else ""}
        """
        
        return summary.strip()
    
    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

# Example usage
if __name__ == "__main__":
    analytics = GradeAnalytics()
    
    # Generate teacher report
    report = analytics.generate_teacher_report(1)
    print("Teacher Grade Analytics Report:")
    print(json.dumps(report['statistics'], indent=2))
    print("\nGrade Distribution:")
    for dist in report['grade_distribution']:
        print(f"Grade {dist['grade']}: {dist['count']} ({dist['percentage']}%)")
    print(f"\n{report['summary']}")