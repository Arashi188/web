<?php
header('Content-Type: application/json');
require_once '../config.php';

try {
    $database = new Database();
    $conn = $database->getConnection();

    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
    
    $query = "SELECT * FROM news_events WHERE status = 'published' ORDER BY publish_date DESC LIMIT :limit";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();

    $news = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($news);
    
} catch(PDOException $e) {
    echo json_encode(array('error' => $e->getMessage()));
}
?>