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

// Check if table exists, if not, create it
$table_check_query = "SHOW TABLES LIKE 'TheNews_users'";
$table_check_result = $conn->query($table_check_query);

if ($table_check_result->num_rows == 0) {
    $create_table_query = "
    CREATE TABLE TheNews_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    if ($conn->query($create_table_query) !== TRUE) {
        die("Error creating table: " . $conn->error);
    }
}

// Get data from POST
$input = json_decode(file_get_contents('php://input'), true);

// Check if input is valid
if (!isset($input['firstname'], $input['lastname'], $input['username'], $input['password'], $input['email'])) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Invalid input"));
    exit();
}

$firstname = $input['firstname'];
$lastname = $input['lastname'];
$username = $input['username'];
$password = $input['password'];
$email = $input['email'];

// Check if username is unique
$sql_check = "SELECT * FROM TheNews_users WHERE username = '$username'";
$result_check = $conn->query($sql_check);
if ($result_check->num_rows > 0) {
    echo json_encode(array("success" => false, "message" => "Username already exists"));
    exit();
}

// Encrypt passwords
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// insert data to table
$sql = "INSERT INTO TheNews_users (firstname, lastname, username, password, email) VALUES ('$firstname', '$lastname', '$username', '$hashed_password', '$email')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(array("success" => true, "message" => "Registration successful"));
} else {
    echo json_encode(array("success" => false, "message" => "Registration failed"));
}

$conn->close();
?>