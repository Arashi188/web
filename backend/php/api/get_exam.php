<?php
session_start();
header('Content-Type: application/json');
require_once '../config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$student_id = $_SESSION['user_id'];
$exam_id = $_GET['id'] ?? '';

if (empty($exam_id)) {
    echo json_encode(['error' => 'Exam ID is required']);
    exit;
}

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

    // Get exam details
    $exam_query = "SELECT 
                    e.*,
                    s.subject_name,
                    c.class_name,
                    u.first_name as teacher_first_name,
                    u.last_name as teacher_last_name
                  FROM exams e
                  JOIN subjects s ON e.subject_id = s.id
                  JOIN classes c ON e.class_id = c.id
                  JOIN users u ON e.teacher_id = u.id
                  WHERE e.id = :exam_id 
                  AND e.class_id = :class_id
                  AND e.is_published = 1
                  AND (e.start_date IS NULL OR e.start_date <= NOW())
                  AND (e.end_date IS NULL OR e.end_date >= NOW())";

    $exam_stmt = $conn->prepare($exam_query);
    $exam_stmt->execute([
        ':exam_id' => $exam_id,
        ':class_id' => $student['class_id']
    ]);
    
    $exam = $exam_stmt->fetch(PDO::FETCH_ASSOC);

    if (!$exam) {
        echo json_encode(['error' => 'Exam not found or not available']);
        exit;
    }

    // Check if student has already attempted this exam
    $attempt_query = "SELECT id FROM exam_attempts 
                      WHERE exam_id = :exam_id 
                      AND student_id = (SELECT id FROM students WHERE user_id = :user_id)
                      AND status = 'submitted'";
    
    $attempt_stmt = $conn->prepare($attempt_query);
    $attempt_stmt->execute([
        ':exam_id' => $exam_id,
        ':user_id' => $student_id
    ]);

    if ($attempt_stmt->fetch()) {
        echo json_encode(['error' => 'You have already attempted this exam']);
        exit;
    }

    // Get exam questions
    $questions_query = "SELECT * FROM exam_questions 
                        WHERE exam_id = :exam_id 
                        ORDER BY question_order ASC";
    
    $questions_stmt = $conn->prepare($questions_query);
    $questions_stmt->bindParam(':exam_id', $exam_id);
    $questions_stmt->execute();
    
    $questions = $questions_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Create exam attempt
    $attempt_insert = "INSERT INTO exam_attempts 
                      (exam_id, student_id, start_time, status) 
                      SELECT 
                          :exam_id,
                          s.id,
                          NOW(),
                          'in_progress'
                      FROM students s 
                      WHERE s.user_id = :user_id
                      ON DUPLICATE KEY UPDATE start_time = NOW()";
    
    $attempt_insert_stmt = $conn->prepare($attempt_insert);
    $attempt_insert_stmt->execute([
        ':exam_id' => $exam_id,
        ':user_id' => $student_id
    ]);

    echo json_encode([
        'exam' => $exam,
        'questions' => $questions
    ]);

} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>