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

// Get data from request POST
$input = json_decode(file_get_contents('php://input'), true);

// Check if input is valid
if (!isset($input['username'], $input['password'])) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Invalid input"));
    exit();
}

$username = $input['username'];
$password = $input['password'];

// Check if the user exists
$sql = "SELECT * FROM TheNews_users WHERE username='$username'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // Check password
    if (password_verify($password, $row['password'])) {
        echo json_encode(array("success" => true, "message" => "Login successful"));
    } else {
        http_response_code(401);
        echo json_encode(array("success" => false, "message" => "Invalid username or password"));
    }
} else {
    http_response_code(404);
    echo json_encode(array("success" => false, "message" => "User not found"));
}

$conn->close();
?>
