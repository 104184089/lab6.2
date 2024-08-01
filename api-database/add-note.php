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
if (!isset($input['username']) || !isset($input['article_url']) || !isset($input['note'])) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Invalid input"));
    exit();
}

$username = $conn->real_escape_string($input['username']);
$article_url = $conn->real_escape_string($input['article_url']);
$note = $conn->real_escape_string($input['note']);

// Get userID from username
$sql_user = "SELECT id FROM TheNews_users WHERE username = '$username'";
$result_user = $conn->query($sql_user);

if ($result_user->num_rows == 0) {
    echo json_encode(array("success" => false, "message" => "User not found"));
    exit();
}

$user = $result_user->fetch_assoc();
$userID = $user['id'];

// Update note in TheNews_user_articles table
$sql_update = "UPDATE TheNews_user_articles SET note = '$note' WHERE userID = '$userID' AND article_url = '$article_url'";

if ($conn->query($sql_update) === TRUE) {
    echo json_encode(array("success" => true, "message" => "Note updated successfully"));
} else {
    echo json_encode(array("success" => false, "message" => "Failed to update note: " . $conn->error));
}

$conn->close();