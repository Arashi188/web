<?php
session_start();
header('Content-Type: application/json');
require_once '../config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$student_id = $_SESSION['user_id'];
$type = $_GET['type'] ?? 'upcoming';

try {
    $database = new Database();
    $conn = $database->getConnection();

    // Get student's class
    $student_query = "SELECT s.id as student_id, s.class_id FROM students s WHERE s.user_id = :user_id";
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

    $data = [];

    switch ($type) {
        case 'upcoming':
            $query = "SELECT 
                        e.*,
                        s.subject_name,
                        c.class_name
                      FROM exams e
                      JOIN subjects s ON e.subject_id = s.id
                      JOIN classes c ON e.class_id = c.id
                      WHERE e.class_id = :class_id 
                      AND e.is_published = 1
                      AND e.exam_type != 'practice'
                      AND (e.start_date IS NULL OR e.start_date > NOW())
                      AND NOT EXISTS (
                          SELECT 1 FROM exam_attempts ea 
                          WHERE ea.exam_id = e.id 
                          AND ea.student_id = :student_id
                          AND ea.status = 'submitted'
                      )
                      ORDER BY e.start_date ASC";
            
            $stmt = $conn->prepare($query);
            $stmt->execute([
                ':class_id' => $class_id,
                ':student_id' => $student_db_id
            ]);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            break;

        case 'active':
            $query = "SELECT 
                        e.*,
                        s.subject_name,
                        c.class_name,
                        ea.start_time,
                        TIMESTAMPDIFF(SECOND, NOW(), DATE_ADD(ea.start_time, INTERVAL e.duration_minutes MINUTE)) as time_left
                      FROM exam_attempts ea
                      JOIN exams e ON ea.exam_id = e.id
                      JOIN subjects s ON e.subject_id = s.id
                      JOIN classes c ON e.class_id = c.id
                      WHERE ea.student_id = :student_id
                      AND ea.status = 'in_progress'
                      ORDER BY ea.start_time DESC";
            
            $stmt = $conn->prepare($query);
            $stmt->execute([':student_id' => $student_db_id]);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            break;

        case 'history':
            $query = "SELECT 
                        ea.*,
                        e.title as exam_title,
                        e.duration_minutes,
                        s.subject_name,
                        c.class_name
                      FROM exam_attempts ea
                      JOIN exams e ON ea.exam_id = e.id
                      JOIN subjects s ON e.subject_id = s.id
                      JOIN classes c ON e.class_id = c.id
                      WHERE ea.student_id = :student_id
                      AND ea.status = 'submitted'
                      ORDER BY ea.submitted_at DESC
                      LIMIT 10";
            
            $stmt = $conn->prepare($query);
            $stmt->execute([':student_id' => $student_db_id]);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            break;
    }

    echo json_encode($data);

} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>