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
    $student_query = "SELECT s.class_id FROM students s WHERE s.user_id = :user_id";
    $student_stmt = $conn->prepare($student_query);
    $student_stmt->bindParam(':user_id', $student_id);
    $student_stmt->execute();
    $student = $student_stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        echo json_encode(['error' => 'Student not found']);
        exit;
    }

    $class_id = $student['class_id'];

    $stats = [
        'upcoming' => 0,
        'completed' => 0,
        'average_score' => 0,
        'pending' => 0
    ];

    // Count upcoming exams
    $upcoming_query = "SELECT COUNT(*) as count FROM exams 
                       WHERE class_id = :class_id 
                       AND is_published = 1
                       AND (start_date IS NULL OR start_date > NOW())";
    
    $upcoming_stmt = $conn->prepare($upcoming_query);
    $upcoming_stmt->bindParam(':class_id', $class_id);
    $upcoming_stmt->execute();
    $stats['upcoming'] = $upcoming_stmt->fetchColumn();

    // Count completed exams and calculate average
    $completed_query = "SELECT COUNT(*) as count, AVG(percentage) as average 
                        FROM exam_attempts ea
                        JOIN exams e ON ea.exam_id = e.id
                        WHERE ea.student_id = (SELECT id FROM students WHERE user_id = :user_id)
                        AND ea.status = 'submitted'";
    
    $completed_stmt = $conn->prepare($completed_query);
    $completed_stmt->bindParam(':user_id', $student_id);
    $completed_stmt->execute();
    $completed = $completed_stmt->fetch(PDO::FETCH_ASSOC);
    
    $stats['completed'] = $completed['count'];
    $stats['average_score'] = round($completed['average'], 1);

    // Count pending exams (active but not completed)
    $pending_query = "SELECT COUNT(*) as count FROM exam_attempts 
                      WHERE student_id = (SELECT id FROM students WHERE user_id = :user_id)
                      AND status = 'in_progress'";
    
    $pending_stmt = $conn->prepare($pending_query);
    $pending_stmt->bindParam(':user_id', $student_id);
    $pending_stmt->execute();
    $stats['pending'] = $pending_stmt->fetchColumn();

    echo json_encode($stats);

} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>