<?php

header('Content-Type: application/json');
$db = new PDO('mysql:host=localhost;dbname=host1654944_ttreserv;charset=utf8mb4', 'host1654944_ttreserv', 'Ic6fABXs');

$stmt = $db->prepare('INSERT INTO reservations (name, phone, email, comment, payment_method, timeslot_id) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->execute([$_POST['name'], $_POST['phone'], $_POST['email'], $_POST['comment'], $_POST['payment_method'], $_POST['timeslot_id']]);
echo json_encode(['status' => 'success']);
?>
