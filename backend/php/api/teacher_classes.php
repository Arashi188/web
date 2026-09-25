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

    $query = "SELECT DISTINCT c.id, c.class_name, c.section 
              FROM class_subjects cs 
              JOIN classes c ON cs.class_id = c.id 
              WHERE cs.teacher_id = :teacher_id 
              ORDER BY c.class_name";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':teacher_id', $teacher_id);
    $stmt->execute();
    
    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['classes' => $classes]);

} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>