<?php
session_start();
header('Content-Type: application/json');
require_once '../config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$teacher_id = $_SESSION['user_id'];
$assignment_id = $_GET['assignment_id'] ?? '';

if (empty($assignment_id)) {
    echo json_encode(['error' => 'Assignment ID is required']);
    exit;
}

try {
    $database = new Database();
    $conn = $database->getConnection();

    // Verify teacher has access to this assignment
    $verify_query = "SELECT 1 FROM assignments 
                     WHERE id = :assignment_id 
                     AND teacher_id = :teacher_id";
    $verify_stmt = $conn->prepare($verify_query);
    $verify_stmt->execute([
        ':assignment_id' => $assignment_id,
        ':teacher_id' => $teacher_id
    ]);

    if (!$verify_stmt->fetch()) {
        echo json_encode(['error' => 'Unauthorized access to this assignment']);
        exit;
    }

    // Get all submissions for this assignment
    $query = "SELECT 
                sub.id as submission_id,
                sub.submission_text,
                sub.attachment_path as submission_attachment,
                sub.marks_obtained,
                sub.teacher_feedback,
                sub.status as submission_status,
                sub.submitted_at,
                s.id as student_id,
                s.roll_number,
                u.first_name,
                u.last_name,
                CONCAT(u.first_name, ' ', u.last_name) as student_name,
                a.title as assignment_title,
                a.description as assignment_description,
                a.attachment_path as assignment_attachment,
                a.total_marks
              FROM assignment_submissions sub
              JOIN students s ON sub.student_id = s.id
              JOIN users u ON s.user_id = u.id
              JOIN assignments a ON sub.assignment_id = a.id
              WHERE sub.assignment_id = :assignment_id
              ORDER BY sub.submitted_at DESC";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':assignment_id', $assignment_id);
    $stmt->execute();
    
    $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['submissions' => $submissions]);

} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>