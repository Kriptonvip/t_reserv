import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';

// Подключение к базе данных MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'host1654944_ttreserv',
  password: 'Ic6fABXs',
  database: 'host1654944_ttreserv',
});

db.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    return;
  }
  console.log('Подключение к базе данных успешно установлено');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Запрос для создания нового бронирования
app.post('/api/reservations', (req, res) => {
  const { name, phone, email, comment, payment_method, timeslot_id } = req.body;
  const reservation = {
    name,
    phone,
    email,
    comment,
    payment_method,
    timeslot_id,
  };

  db.query('INSERT INTO reservations SET ?', reservation, (err, result) => {
    if (err) {
      console.error('Ошибка при создании бронирования:', err);
      res.json({ status: 'error' });
    } else {
      console.log('Бронирование успешно создано');
      res.json({ status: 'success' });
    }
  });
});

// Запрос для получения списка столов
app.get('/api/tables', (req, res) => {
  db.query('SELECT * FROM tables', (err, result) => {
    if (err) {
      console.error('Ошибка при получении списка столов:', err);
      res.json([]);
    } else {
      res.json(result);
    }
  });
});

// Запрос для получения временных слотов для заданного стола
app.get('/api/timeslots/:tableId', (req, res) => {
  const tableId = req.params.tableId;
  db.query('SELECT * FROM timeslots WHERE table_id = ?', tableId, (err, result) => {
    if (err) {
      console.error('Ошибка при получении временных слотов:', err);
      res.json([]);
    } else {
      res.json(result);
    }
  });
});

// Запуск сервера
const port = 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
