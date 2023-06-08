<?php



header('Content-Type: application/json');
$db = new PDO('mysql:host=localhost;dbname=host1654944_ttreserv;charset=utf8mb4', 'host1654944_ttreserv', 'Ic6fABXs');

$stmt = $db->prepare('INSERT INTO tables (name) VALUES (?)');

$tables = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'];

foreach ($tables as $tableName) {
    $stmt->execute([$tableName]);
}

echo json_encode(['status' => 'success']);



if($stmt->errorCode() != 0) {
    $errors = $stmt->errorInfo();
    echo($errors[2]);
}

?>