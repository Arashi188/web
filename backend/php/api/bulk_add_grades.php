<?php
session_start();
header('Content-Type: application/json');
require_once '../config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$teacher_id = $_SESSION['user_id'];

try {
    $database = new Database();
    $conn = $database->getConnection();

    $class_id = $_POST['class_id'];
    $subject_id = $_POST['subject_id'];
    $term = $_POST['term'];
    $student_ids = $_POST['student_ids'];
    $marks = $_POST['marks'];

    // Verify teacher has access to this class and subject
    $verify_query = "SELECT 1 FROM class_subjects 
                     WHERE class_id = :class_id 
                     AND subject_id = :subject_id 
                     AND teacher_id = :teacher_id";
    $verify_stmt = $conn->prepare($verify_query);
    $verify_stmt->execute([
        ':class_id' => $class_id,
        ':subject_id' => $subject_id,
        ':teacher_id' => $teacher_id
    ]);

    if (!$verify_stmt->fetch()) {
        echo json_encode(['error' => 'Unauthorized access to this class/subject']);
        exit;
    }

    $added = 0;
    $errors = [];

    // Calculate grade function
    function calculateGrade($marks) {
        if ($marks >= 90) return 'A';
        if ($marks >= 80) return 'B';
        if ($marks >= 70) return 'C';
        if ($marks >= 60) return 'D';
        return 'F';
    }

    // Insert grades
    $insert_query = "INSERT INTO grades (student_id, subject_id, class_id, marks, grade, term, created_by) 
                     VALUES (:student_id, :subject_id, :class_id, :marks, :grade, :term, :teacher_id)
                     ON DUPLICATE KEY UPDATE 
                     marks = VALUES(marks), 
                     grade = VALUES(grade),
                     term = VALUES(term),
                     created_by = VALUES(created_by)";

    $insert_stmt = $conn->prepare($insert_query);

    for ($i = 0; $i < count($student_ids); $i++) {
        $student_marks = floatval($marks[$i]);
        
        // Skip if marks are not provided or invalid
        if (empty($student_marks) || $student_marks < 0 || $student_marks > 100) {
            continue;
        }

        $grade = calculateGrade($student_marks);

        try {
            $insert_stmt->execute([
                ':student_id' => $student_ids[$i],
                ':subject_id' => $subject_id,
                ':class_id' => $class_id,
                ':marks' => $student_marks,
                ':grade' => $grade,
                ':term' => $term,
                ':teacher_id' => $teacher_id
            ]);

            if ($insert_stmt->rowCount() > 0) {
                $added++;
            }
        } catch (PDOException $e) {
            $errors[] = "Failed to add grade for student ID {$student_ids[$i]}: " . $e->getMessage();
        }
    }

    echo json_encode([
        'success' => true,
        'added' => $added,
        'total' => count($student_ids),
        'errors' => $errors
    ]);

} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>