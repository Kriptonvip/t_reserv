<?php
header('Content-Type: application/json');
$db = new PDO('mysql:host=localhost;dbname=host1654944_ttreserv;charset=utf8mb4', 'host1654944_ttreserv', 'Ic6fABXs');

$stmt = $db->prepare('SELECT * FROM timeslots WHERE table_id = ?');
$stmt->execute([$_GET['table_id']]);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
