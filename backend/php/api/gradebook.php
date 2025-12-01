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

    // Get filter parameters
    $class_id = $_GET['class_id'] ?? '';
    $subject_id = $_GET['subject_id'] ?? '';
    $term = $_GET['term'] ?? '';
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = max(1, intval($_GET['limit'] ?? 10));
    $offset = ($page - 1) * $limit;

    // Build base query
    $query = "SELECT SQL_CALC_FOUND_ROWS
                g.id,
                g.marks,
                g.grade,
                g.term,
                g.created_at as last_updated,
                s.first_name,
                s.last_name,
                st.roll_number,
                c.class_name,
                sub.subject_name,
                CONCAT(s.first_name, ' ', s.last_name) as student_name
              FROM grades g
              JOIN students st ON g.student_id = st.id
              JOIN users s ON st.user_id = s.id
              JOIN classes c ON g.class_id = c.id
              JOIN subjects sub ON g.subject_id = sub.id
              JOIN class_subjects cs ON g.class_id = cs.class_id AND g.subject_id = cs.subject_id
              WHERE cs.teacher_id = :teacher_id";

    $params = [':teacher_id' => $teacher_id];

    // Add filters
    if (!empty($class_id)) {
        $query .= " AND g.class_id = :class_id";
        $params[':class_id'] = $class_id;
    }

    if (!empty($subject_id)) {
        $query .= " AND g.subject_id = :subject_id";
        $params[':subject_id'] = $subject_id;
    }

    if (!empty($term)) {
        $query .= " AND g.term = :term";
        $params[':term'] = $term;
    }

    $query .= " ORDER BY g.created_at DESC LIMIT :limit OFFSET :offset";

    // Prepare and execute query
    $stmt = $conn->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $grades = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get total count
    $stmt = $conn->query("SELECT FOUND_ROWS()");
    $total = $stmt->fetchColumn();

    // Get statistics
    $stats = getGradebookStats($conn, $teacher_id, $class_id, $subject_id, $term);

    echo json_encode([
        'grades' => $grades,
        'total' => $total,
        'stats' => $stats,
        'page' => $page,
        'total_pages' => ceil($total / $limit)
    ]);

} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

function getGradebookStats($conn, $teacher_id, $class_id, $subject_id, $term) {
    $query = "SELECT 
                COUNT(*) as total_grades,
                COUNT(DISTINCT g.student_id) as graded_students,
                COUNT(DISTINCT g.subject_id) as unique_subjects,
                AVG(g.marks) as average_marks
              FROM grades g
              JOIN class_subjects cs ON g.class_id = cs.class_id AND g.subject_id = cs.subject_id
              WHERE cs.teacher_id = :teacher_id";

    $params = [':teacher_id' => $teacher_id];

    if (!empty($class_id)) {
        $query .= " AND g.class_id = :class_id";
        $params[':class_id'] = $class_id;
    }

    if (!empty($subject_id)) {
        $query .= " AND g.subject_id = :subject_id";
        $params[':subject_id'] = $subject_id;
    }

    if (!empty($term)) {
        $query .= " AND g.term = :term";
        $params[':term'] = $term;
    }

    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    
    return $stmt->fetch(PDO::FETCH_ASSOC);
}
?>