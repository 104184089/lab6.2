<?php
$host = "localhost";
$user = "root";
$pswd = "";
$dbnm = "test";

// Open connection
$conn = @mysqli_connect($host, $user, $pswd, $dbnm)
    or die("Connection failed: " . mysqli_connect_error());
mysqli_select_db($conn, $dbnm)
    or die("Database selection failed: " . mysqli_error($conn));

// Get data from POST
$input = json_decode(file_get_contents('php://input'), true);

// Check if input is valid
if (!isset($input['username'], $input['article_url'])) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Invalid input"));
    exit();
}

$username = $conn->real_escape_string($input['username']);
$article_url = $conn->real_escape_string($input['article_url']);

// Get userID from username
$sql_user = "SELECT id FROM TheNews_users WHERE username = '$username'";
$result_user = $conn->query($sql_user);

if ($result_user->num_rows == 0) {
    echo json_encode(array("success" => false, "message" => "User not found"));
    exit();
}

$user = $result_user->fetch_assoc();
$userID = $user['id'];

// Delete article from TheNews_user_articles table
$sql = "DELETE FROM TheNews_user_articles WHERE userID = '$userID' AND article_url = '$article_url'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array("success" => true, "message" => "Article removed from reading list"));
} else {
    echo json_encode(array("success" => false, "message" => "Failed to remove article from reading list"));
}

$conn->close();