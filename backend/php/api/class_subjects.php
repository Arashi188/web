<?php
session_start();
header('Content-Type: application/json');
require_once '../config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$teacher_id = $_SESSION['user_id'];
$class_id = $_GET['class_id'] ?? '';

if (empty($class_id)) {
    echo json_encode(['error' => 'Class ID is required']);
    exit;
}

try {
    $database = new Database();
    $conn = $database->getConnection();

    $query = "SELECT s.id, s.subject_name 
              FROM class_subjects cs 
              JOIN subjects s ON cs.subject_id = s.id 
              WHERE cs.class_id = :class_id 
              AND cs.teacher_id = :teacher_id 
              ORDER BY s.subject_name";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':class_id', $class_id);
    $stmt->bindParam(':teacher_id', $teacher_id);
    $stmt->execute();
    
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['subjects' => $subjects]);

} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>