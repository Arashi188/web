<?php
session_start();
require_once 'config.php';

class Auth {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    public function login($username, $password, $role) {
        try {
            $query = "SELECT * FROM users WHERE username = :username AND role = :role AND status = 'active'";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":username", $username);
            $stmt->bindParam(":role", $role);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                if (password_verify($password, $user['password'])) {
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['username'];
                    $_SESSION['role'] = $user['role'];
                    $_SESSION['first_name'] = $user['first_name'];
                    
                    return array('success' => true, 'message' => 'Login successful');
                }
            }
            return array('success' => false, 'message' => 'Invalid credentials');
        } catch(PDOException $e) {
            return array('success' => false, 'message' => 'Database error: ' . $e->getMessage());
        }
    }

    public function logout() {
        session_destroy();
        return array('success' => true, 'message' => 'Logout successful');
    }

    public function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }

    public function getUserRole() {
        return $_SESSION['role'] ?? null;
    }
}
?>