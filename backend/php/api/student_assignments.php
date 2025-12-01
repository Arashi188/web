<?php
session_start();
header('Content-Type: application/json');
require_once '../config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$student_id = $_SESSION['user_id'];

try {
    $database = new Database();
    $conn = $database->getConnection();

    // Get student's class
    $student_query = "SELECT s.id as student_id, s.class_id, c.class_name 
                      FROM students s 
                      JOIN classes c ON s.class_id = c.id 
                      WHERE s.user_id = :user_id";
    $student_stmt = $conn->prepare($student_query);
    $student_stmt->bindParam(':user_id', $student_id);
    $student_stmt->execute();
    $student = $student_stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        echo json_encode(['error' => 'Student not found']);
        exit;
    }

    $class_id = $student['class_id'];
    $student_db_id = $student['student_id'];

    // Get assignments for student's class with submission status
    $query = "SELECT 
                a.*,
                s.subject_name,
                c.class_name,
                sub.id as submission_id,
                sub.submission_text,
                sub.attachment_path as submission_attachment,
                sub.marks_obtained,
                sub.feedback,
                sub.status as submission_status,
                sub.submitted_at,
                u.first_name as teacher_first_name,
                u.last_name as teacher_last_name,
                CASE 
                    WHEN sub.id IS NULL THEN 'not_submitted'
                    WHEN sub.marks_obtained IS NOT NULL THEN 'graded'
                    ELSE 'submitted'
                END as display_status
              FROM assignments a
              JOIN subjects s ON a.subject_id = s.id
              JOIN classes c ON a.class_id = c.id
              JOIN users u ON a.teacher_id = u.id
              LEFT JOIN assignment_submissions sub ON a.id = sub.assignment_id AND sub.student_id = :student_id
              WHERE a.class_id = :class_id 
              AND a.status = 'published'
              ORDER BY a.due_date ASC";

    $stmt = $conn->prepare($query);
    $stmt->execute([
        ':class_id' => $class_id,
        ':student_id' => $student_db_id
    ]);
    
    $assignments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calculate statistics
    $stats = [
        'total_assigned' => 0,
        'submitted_count' => 0,
        'pending_count' => 0,
        'average_score' => 0
    ];

    $total_score = 0;
    $graded_count = 0;

    foreach ($assignments as $assignment) {
        $stats['total_assigned']++;
        
        if ($assignment['submission_status'] === 'submitted' || $assignment['submission_status'] === 'graded') {
            $stats['submitted_count']++;
        } else {
            $stats['pending_count']++;
        }

        if ($assignment['marks_obtained'] !== null) {
            $total_score += $assignment['marks_obtained'];
            $graded_count++;
        }
    }

    $stats['average_score'] = $graded_count > 0 ? round($total_score / $graded_count, 1) : 0;

    echo json_encode([
        'assignments' => $assignments,
        'stats' => $stats,
        'student' => $student
    ]);

} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>