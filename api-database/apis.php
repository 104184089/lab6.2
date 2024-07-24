<?php
$host = "localhost";
$user = "root";
$pswd = "";
$dbnm = "test";
$table = "user_topics";
$fld = "id";

// Connect to database
$conn = @mysqli_connect($host, $user, $pswd, $dbnm)
    or die("Connection failed: " . mysqli_connect_error());
mysqli_select_db($conn, $dbnm)
    or die("Database selection failed: " . mysqli_error($conn));

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$key = array_shift($request) + 0;

$input = json_decode(file_get_contents('php://input'), true);

// create SQL
switch ($method) {
  case 'GET':
    $sql = "SELECT * FROM `$table`".($key ? " WHERE $fld='$key'" : ''); 
    break;
  case 'PUT':
    $set = "";
    foreach ($input as $column => $value) {
        $set .= "$column = '".mysqli_real_escape_string($conn, $value)."', ";
    }
    $set = rtrim($set, ', ');
    $sql = "UPDATE `$table` SET $set WHERE ".($key ? "$fld='$key'" : "0=1");
    break;
  case 'POST':
    $set = "";
    foreach ($input as $column => $value) {
        $set .= "$column = '".mysqli_real_escape_string($conn, $value)."', ";
    }
    $set = rtrim($set, ', ');
    $sql = "INSERT INTO `$table` SET $set";
    break;
  case 'DELETE':
    $sql = "DELETE FROM `$table` WHERE ".($key ? "$fld='$key'" : "0=1");
    break;
  default:
    http_response_code(405);
    echo json_encode(array("success" => false, "message" => "Method not allowed"));
    exit();
}

// execute SQL statement
$result = mysqli_query($conn, $sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Query failed: " . mysqli_error($conn)));
    exit();
}

if ($method == 'GET') {
    $response = array();
    while($row = mysqli_fetch_assoc($result)) {
        $response[] = $row;
    }
    echo json_encode($response);
} elseif ($method == 'POST') {
    echo json_encode(array("success" => true, "id" => mysqli_insert_id($conn)));
} else {
    echo json_encode(array("success" => true, "affected_rows" => mysqli_affected_rows($conn)));
}

mysqli_close($conn);
?>
