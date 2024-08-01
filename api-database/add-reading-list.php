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
if (!isset($input['username'], $input['article_url'], $input['title'],  $input['image_url'], $input['author'], $input['published_at'], $input['note'])) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Invalid input"));
    exit();
}

$username = $conn->real_escape_string($input['username']);
$article_url = $conn->real_escape_string($input['article_url']);
$title = $conn->real_escape_string($input['title']);
$image_url = $conn->real_escape_string($input['image_url']);
$author = $conn->real_escape_string($input['author']);
$published_at = $conn->real_escape_string($input['published_at']);
$note = $conn->real_escape_string($input['note']);
$date = date('Y-m-d H:i:s');

// Get userID from username
$sql_user = "SELECT id FROM TheNews_users WHERE username = '$username'";
$result_user = $conn->query($sql_user);

if ($result_user->num_rows == 0) {
    echo json_encode(array("success" => false, "message" => "User not found"));
    exit();
}

$user = $result_user->fetch_assoc();
$userID = $user['id'];

// Insert article into TheNews_user_articles table
$sql = "INSERT INTO TheNews_user_articles (userID, username, article_url, title, image_url, author, published_at, note, date) 
        VALUES ('$userID', '$username', '$article_url', '$title', '$image_url', '$author', '$published_at', '$note', '$date')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array("success" => true, "message" => "Article added to reading list"));
} else {
    echo json_encode(array("success" => false, "message" => "Failed to add article to reading list"));
}

$conn->close();