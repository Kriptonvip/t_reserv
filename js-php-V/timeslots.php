<?php


header('Content-Type: application/json');
$db = new PDO('mysql:host=localhost;dbname=host1654944_ttreserv;charset=utf8mb4', 'host1654944_ttreserv', 'Ic6fABXs');


$stmt = $db->prepare('INSERT INTO timeslots (time, table_id) VALUES (?, ?)');

$tables = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'];
$startHour = 10;
$endHour = 22;
$timeInterval = 30;

foreach ($tables as $tableId => $tableName) {
    $currentTime = $startHour . ':00:00';
    while ($currentTime <= $endHour . ':00:00') {
        $stmt->execute([$currentTime, $tableId + 1]); // +1 потому что идентификаторы таблицы начинаются с 1
        $currentTime = date('H:i:s', strtotime($currentTime) + ($timeInterval * 60)); // Увеличиваем текущее время на указанный интервал
    }
}

echo json_encode(['status' => 'success']);


if($stmt->errorCode() != 0) {
    $errors = $stmt->errorInfo();
    echo($errors[2]);
}

?>