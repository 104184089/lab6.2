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
if (!isset($input['username'])) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Invalid input"));
    exit();
}

$username = $conn->real_escape_string($input['username']);

// Get userID from username
$sql_user = "SELECT id FROM TheNews_users WHERE username = '$username'";
$result_user = $conn->query($sql_user);

if ($result_user->num_rows == 0) {
    echo json_encode(array("success" => false, "message" => "User not found"));
    exit();
}

$user = $result_user->fetch_assoc();
$userID = $user['id'];

// Get articles from TheNews_user_articles table
$sql = "SELECT article_url, title, image_url, author, published_at, note, date FROM TheNews_user_articles WHERE userID = '$userID'";
$result = $conn->query($sql);

$articles = array();
while ($row = $result->fetch_assoc()) {
    $articles[] = $row;
}

echo json_encode(array("success" => true, "articles" => $articles));

$conn->close();
