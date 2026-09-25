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

        $data = json_decode(file_get_contents('php://input'), true);
        $exam_id = $data['exam_id'];
        $answers = $data['answers'];
        $time_spent = $data['time_spent'];

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

        // Get exam attempt
        $attempt_query = "SELECT id FROM exam_attempts 
                          WHERE exam_id = :exam_id 
                          AND student_id = :student_id 
                          AND status = 'in_progress'";
        
        $attempt_stmt = $conn->prepare($attempt_query);
        $attempt_stmt->execute([
            ':exam_id' => $exam_id,
            ':student_id' => $student_db_id
        ]);
        
        $attempt = $attempt_stmt->fetch(PDO::FETCH_ASSOC);

        if (!$attempt) {
            echo json_encode(['error' => 'No active exam attempt found']);
            exit;
        }

        $attempt_id = $attempt['id'];

        // Calculate scores and save answers
        $total_marks = 0;
        $obtained_marks = 0;

        foreach ($answers as $question_id => $student_answer) {
            // Get question details
            $question_query = "SELECT * FROM exam_questions WHERE id = :question_id";
            $question_stmt = $conn->prepare($question_query);
            $question_stmt->bindParam(':question_id', $question_id);
            $question_stmt->execute();
            $question = $question_stmt->fetch(PDO::FETCH_ASSOC);

            if ($question) {
                $marks = $question['marks'];
                $total_marks += $marks;

                // Calculate marks based on answer
                $question_marks = calculateMarks($question, $student_answer);
                $obtained_marks += $question_marks;

                // Save answer
                $answer_query = "INSERT INTO exam_answers 
                                (attempt_id, question_id, student_answer, marks_obtained) 
                                VALUES (:attempt_id, :question_id, :student_answer, :marks_obtained)";
                
                $answer_stmt = $conn->prepare($answer_query);
                $answer_stmt->execute([
                    ':attempt_id' => $attempt_id,
                    ':question_id' => $question_id,
                    ':student_answer' => $student_answer,
                    ':marks_obtained' => $question_marks
                ]);
            }
        }

        // Calculate percentage
        $percentage = $total_marks > 0 ? ($obtained_marks / $total_marks) * 100 : 0;

        // Update exam attempt
        $update_attempt = "UPDATE exam_attempts 
                          SET end_time = NOW(),
                              time_spent = :time_spent,
                              total_marks_obtained = :obtained_marks,
                              percentage = :percentage,
                              status = 'submitted',
                              submitted_at = NOW()
                          WHERE id = :attempt_id";
        
        $update_stmt = $conn->prepare($update_attempt);
        $update_stmt->execute([
            ':time_spent' => $time_spent,
            ':obtained_marks' => $obtained_marks,
            ':percentage' => $percentage,
            ':attempt_id' => $attempt_id
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Exam submitted successfully',
            'attempt_id' => $attempt_id,
            'total_marks' => $total_marks,
            'obtained_marks' => $obtained_marks,
            'percentage' => round($percentage, 2)
        ]);

    } catch(PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}

function calculateMarks($question, $student_answer) {
    // For now, simple exact match checking
    // You can extend this for partial marks, etc.
    
    if (empty($student_answer)) {
        return 0;
    }

    $correct_answer = $question['correct_answer'];
    
    if ($question['question_type'] === 'multiple_choice' || $question['question_type'] === 'true_false') {
        return strtolower(trim($student_answer)) === strtolower(trim($correct_answer)) ? $question['marks'] : 0;
    }
    
    // For short answer and essay, we'll need manual grading
    // For now, return 0 - teacher will grade later
    return 0;
}
?>  