<?php
session_start();
require_once 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = validateInput($_POST['username']);
    $password = validateInput($_POST['password']);
    $role = validateInput($_POST['role']);
    
    $auth = new Auth();
    $result = $auth->login($username, $password, $role);
    
    header('Content-Type: application/json');
    echo json_encode($result);
    exit;
}
?>