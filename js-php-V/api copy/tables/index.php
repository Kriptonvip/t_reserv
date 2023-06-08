<?php
header('Content-Type: application/json');
$db = new PDO('mysql:host=localhost;dbname=host1654944_ttreserv;charset=utf8mb4', 'host1654944_ttreserv', 'Ic6fABXs');

$stmt = $db->query('SELECT * FROM tables');
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>s