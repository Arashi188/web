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

        $submission_id = validateInput($_POST['submission_id']);
        $marks_obtained = floatval($_POST['marks_obtained']);
        $teacher_feedback = validateInput($_POST['teacher_feedback'] ?? '');

        // Validate required fields
        if (empty($submission_id) || empty($marks_obtained)) {
            echo json_encode(['error' => 'Marks are required']);
            exit;
        }

        // Get submission details to verify access
        $verify_query = "SELECT sub.*, a.teacher_id, a.total_marks 
                         FROM assignment_submissions sub
                         JOIN assignments a ON sub.assignment_id = a.id
                         WHERE sub.id = :submission_id";
        $verify_stmt = $conn->prepare($verify_query);
        $verify_stmt->bindParam(':submission_id', $submission_id);
        $verify_stmt->execute();
        $submission = $verify_stmt->fetch(PDO::FETCH_ASSOC);

        if (!$submission) {
            echo json_encode(['error' => 'Submission not found']);
            exit;
        }

        // Verify teacher owns this assignment
        if ($submission['teacher_id'] != $teacher_id) {
            echo json_encode(['error' => 'Unauthorized to grade this submission']);
            exit;
        }

        // Validate marks
        if ($marks_obtained < 0 || $marks_obtained > $submission['total_marks']) {
            echo json_encode(['error' => 'Marks must be between 0 and ' . $submission['total_marks']]);
            exit;
        }

        // Update submission with grade
        $update_query = "UPDATE assignment_submissions 
                         SET marks_obtained = :marks_obtained,
                             teacher_feedback = :teacher_feedback,
                             status = 'graded',
                             updated_at = NOW()
                         WHERE id = :submission_id";

        $stmt = $conn->prepare($update_query);
        $stmt->execute([
            ':marks_obtained' => $marks_obtained,
            ':teacher_feedback' => $teacher_feedback,
            ':submission_id' => $submission_id
        ]);

        // Calculate percentage for gradebook
        $percentage = ($marks_obtained / $submission['total_marks']) * 100;
        $grade = calculateGrade($percentage);

        // Insert into grades table if not exists
        $grade_query = "INSERT INTO grades 
                       (student_id, subject_id, class_id, marks, grade, term, created_by) 
                       SELECT 
                           s.id as student_id,
                           a.subject_id,
                           a.class_id,
                           :marks_obtained,
                           :grade,
                           'Assignment',
                           :teacher_id
                       FROM assignment_submissions sub
                       JOIN students s ON sub.student_id = s.id
                       JOIN assignments a ON sub.assignment_id = a.id
                       WHERE sub.id = :submission_id
                       ON DUPLICATE KEY UPDATE 
                       marks = VALUES(marks),
                       grade = VALUES(grade)";

        $grade_stmt = $conn->prepare($grade_query);
        $grade_stmt->execute([
            ':marks_obtained' => $marks_obtained,
            ':grade' => $grade,
            ':teacher_id' => $teacher_id,
            ':submission_id' => $submission_id
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Grade submitted successfully',
            'percentage' => $percentage,
            'grade' => $grade
        ]);

    } catch(PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}

function calculateGrade($percentage) {
    if ($percentage >= 90) return 'A';
    if ($percentage >= 80) return 'B';
    if ($percentage >= 70) return 'C';
    if ($percentage >= 60) return 'D';
    return 'F';
}
?>