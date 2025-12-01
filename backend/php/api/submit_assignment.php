<?php
session_start();
header('Content-Type: application/json');
require_once '../config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$student_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $database = new Database();
        $conn = $database->getConnection();

        // Get student database ID
        $student_query = "SELECT id FROM students WHERE user_id = :user_id";
        $student_stmt = $conn->prepare($student_query);
        $student_stmt->bindParam(':user_id', $student_id);
        $student_stmt->execute();
        $student = $student_stmt->fetch(PDO::FETCH_ASSOC);

        if (!$student) {
            echo json_encode(['error' => 'Student not found']);
            exit;
        }

        $student_db_id = $student['id'];
        $assignment_id = validateInput($_POST['assignment_id']);
        $submission_text = validateInput($_POST['submission_text']);

        // Validate required fields
        if (empty($assignment_id) || empty($submission_text)) {
            echo json_encode(['error' => 'Submission text is required']);
            exit;
        }

        // Check if assignment exists and is still open
        $assignment_query = "SELECT * FROM assignments WHERE id = :assignment_id AND status = 'published'";
        $assignment_stmt = $conn->prepare($assignment_query);
        $assignment_stmt->bindParam(':assignment_id', $assignment_id);
        $assignment_stmt->execute();
        $assignment = $assignment_stmt->fetch(PDO::FETCH_ASSOC);

        if (!$assignment) {
            echo json_encode(['error' => 'Assignment not found or closed']);
            exit;
        }

        // Check if student is in the correct class
        $student_class_query = "SELECT class_id FROM students WHERE id = :student_id";
        $student_class_stmt = $conn->prepare($student_class_query);
        $student_class_stmt->bindParam(':student_id', $student_db_id);
        $student_class_stmt->execute();
        $student_class = $student_class_stmt->fetch(PDO::FETCH_ASSOC);

        if ($student_class['class_id'] != $assignment['class_id']) {
            echo json_encode(['error' => 'You are not assigned to this class']);
            exit;
        }

        // Determine submission status (on-time or late)
        $submission_status = 'submitted';
        $current_time = date('Y-m-d H:i:s');
        if (strtotime($current_time) > strtotime($assignment['due_date'])) {
            $submission_status = 'late';
        }

        // Handle file upload
        $attachment_path = null;
        if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = '../uploads/submissions/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            $file_extension = pathinfo($_FILES['attachment']['name'], PATHINFO_EXTENSION);
            $file_name = 'submission_' . $assignment_id . '_' . $student_db_id . '_' . time() . '.' . $file_extension;
            $file_path = $upload_dir . $file_name;

            // Validate file type and size
            $allowed_types = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'txt'];
            $max_size = 10 * 1024 * 1024; // 10MB

            if (!in_array(strtolower($file_extension), $allowed_types)) {
                echo json_encode(['error' => 'Invalid file type. Allowed: PDF, Word, Images, Text']);
                exit;
            }

            if ($_FILES['attachment']['size'] > $max_size) {
                echo json_encode(['error' => 'File size too large. Maximum 10MB allowed']);
                exit;
            }

            if (move_uploaded_file($_FILES['attachment']['tmp_name'], $file_path)) {
                $attachment_path = $file_path;
            }
        }

        // Insert or update submission
        $submission_query = "INSERT INTO assignment_submissions 
                            (assignment_id, student_id, submission_text, attachment_path, submitted_at, status) 
                            VALUES 
                            (:assignment_id, :student_id, :submission_text, :attachment_path, NOW(), :status)
                            ON DUPLICATE KEY UPDATE 
                            submission_text = VALUES(submission_text),
                            attachment_path = VALUES(attachment_path),
                            submitted_at = NOW(),
                            status = VALUES(status)";

        $stmt = $conn->prepare($submission_query);
        $stmt->execute([
            ':assignment_id' => $assignment_id,
            ':student_id' => $student_db_id,
            ':submission_text' => $submission_text,
            ':attachment_path' => $attachment_path,
            ':status' => $submission_status
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Assignment submitted successfully',
            'submission_status' => $submission_status
        ]);

    } catch(PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>