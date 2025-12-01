<?php
session_start();
header('Content-Type: application/json');
require_once '../config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'teacher') {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$teacher_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $database = new Database();
        $conn = $database->getConnection();

        // Get form data
        $title = validateInput($_POST['title']);
        $description = validateInput($_POST['description']);
        $class_id = validateInput($_POST['class_id']);
        $subject_id = validateInput($_POST['subject_id']);
        $total_marks = floatval($_POST['total_marks']);
        $due_date = validateInput($_POST['due_date']);
        $instructions = validateInput($_POST['instructions'] ?? '');
        $status = validateInput($_POST['status']);

        // Validate required fields
        if (empty($title) || empty($class_id) || empty($subject_id) || empty($due_date)) {
            echo json_encode(['error' => 'All required fields must be filled']);
            exit;
        }

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
            echo json_encode(['error' => 'You are not assigned to teach this subject for the selected class']);
            exit;
        }

        // Handle file upload
        $attachment_path = null;
        if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = '../uploads/assignments/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            $file_extension = pathinfo($_FILES['attachment']['name'], PATHINFO_EXTENSION);
            $file_name = 'assignment_' . time() . '_' . uniqid() . '.' . $file_extension;
            $file_path = $upload_dir . $file_name;

            // Validate file type and size
            $allowed_types = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
            $max_size = 10 * 1024 * 1024; // 10MB

            if (!in_array(strtolower($file_extension), $allowed_types)) {
                echo json_encode(['error' => 'Invalid file type. Allowed: PDF, Word, JPG, PNG']);
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

        // Insert assignment
        $insert_query = "INSERT INTO assignments 
                        (title, description, subject_id, class_id, teacher_id, total_marks, due_date, instructions, attachment_path, status) 
                        VALUES 
                        (:title, :description, :subject_id, :class_id, :teacher_id, :total_marks, :due_date, :instructions, :attachment_path, :status)";

        $stmt = $conn->prepare($insert_query);
        $stmt->execute([
            ':title' => $title,
            ':description' => $description,
            ':subject_id' => $subject_id,
            ':class_id' => $class_id,
            ':teacher_id' => $teacher_id,
            ':total_marks' => $total_marks,
            ':due_date' => $due_date,
            ':instructions' => $instructions,
            ':attachment_path' => $attachment_path,
            ':status' => $status
        ]);

        $assignment_id = $conn->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Assignment created successfully',
            'assignment_id' => $assignment_id
        ]);

    } catch(PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>