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

    // Get assignments with submission counts
    $query = "SELECT 
                a.*,
                c.class_name,
                s.subject_name,
                COUNT(DISTINCT sub.id) as submission_count,
                COUNT(DISTINCT st.id) as total_students,
                u.first_name as teacher_first_name,
                u.last_name as teacher_last_name
              FROM assignments a
              JOIN classes c ON a.class_id = c.id
              JOIN subjects s ON a.subject_id = s.id
              JOIN users u ON a.teacher_id = u.id
              LEFT JOIN students st ON a.class_id = st.class_id
              LEFT JOIN assignment_submissions sub ON a.id = sub.assignment_id AND sub.status != 'not_submitted'
              WHERE a.teacher_id = :teacher_id
              GROUP BY a.id
              ORDER BY a.created_at DESC";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':teacher_id', $teacher_id);
    $stmt->execute();
    
    $assignments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calculate statistics
    $stats = [
        'total_assignments' => 0,
        'pending_grading' => 0,
        'active_assignments' => 0,
        'submitted_count' => 0
    ];

    foreach ($assignments as $assignment) {
        $stats['total_assignments']++;
        $stats['submitted_count'] += $assignment['submission_count'];
        
        if ($assignment['status'] === 'published' && strtotime($assignment['due_date']) > time()) {
            $stats['active_assignments']++;
        }
        
        // Count assignments that have submissions but aren't graded
        if ($assignment['submission_count'] > 0) {
            // We'll need a separate query for precise pending grading count
            $stats['pending_grading'] += $assignment['submission_count'];
        }
    }

    echo json_encode([
        'assignments' => $assignments,
        'stats' => $stats
    ]);

} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>