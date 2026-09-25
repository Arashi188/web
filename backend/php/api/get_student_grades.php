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

    // Get student details
    $query = "SELECT s.*, c.class_name FROM students s 
              JOIN classes c ON s.class_id = c.id 
              WHERE s.user_id = :user_id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':user_id', $student_id);
    $stmt->execute();
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get grades
    $query = "SELECT g.*, s.subject_name, s.subject_code 
              FROM grades g 
              JOIN subjects s ON g.subject_id = s.id 
              WHERE g.student_id = :student_id 
              ORDER BY g.created_at DESC 
              LIMIT 5";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':student_id', $student['id']);
    $stmt->execute();
    $grades = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'student' => $student,
        'grades' => $grades
    ]);

} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>