import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const App = () => {
  const [tables, setTables] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    fetch('/api/tables')
      .then(response => response.json())
      .then(data => setTables(data));

    fetch('/api/timeslots')
      .then(response => response.json())
      .then(data => setTimeslots(data));
  }, []);

  const handleSelectTimeslot = (timeslot) => {
    setSelectedTimeslot(timeslot);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const reservation = {
      name,
      phone,
      email,
      comment,
      payment_method: paymentMethod,
      timeslot_id: selectedTimeslot.id,
    };

    fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          alert('Бронирование успешно создано!');
        } else {
          alert('Произошла ошибка при создании бронирования');
        }
      });
  };

  return (
    <div className="container">
      <h1>Система бронирования</h1>
      <div className="row">
        <div className="col-md-6">
          <h2>Выберите стол</h2>
          <ul className="list-group">
            {tables.map(table => (
              <li
                key={table.id}
                className={`list-group-item ${selectedTimeslot && selectedTimeslot.table_id === table.id ? 'active' : ''}`}
                onClick={() => handleSelectTimeslot(null)}
              >
                {table.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h2>Выберите время</h2>
          <Calendar
            tileContent={({ date }) => {
              const timeslot = timeslots.find(slot => slot.date === date.toISOString().split('T')[0]);
              if (timeslot) {
                return <p className="text-center">{timeslot.available ? 'Свободно' : 'Занято'}</p>;
              }
            }}
            onClickDay={date => {
              const timeslot = timeslots.find(slot => slot.date === date.toISOString().split('T')[0]);
              if (timeslot && timeslot.available) {
                handleSelectTimeslot(timeslot);
              }
            }}
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <h2>Оформить бронь</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="ФИО"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                className="form-control"
                placeholder="Мобильный телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-control"
                placeholder="Комментарий"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group">
              <select
                className="form-control"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="">Способ оплаты</option>
                <option value="card">Банковской картой в зале</option>
                <option value="cash">Наличными в зале</option>
                <option value="subscription">У меня абонемент</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Оформить бронь</button>
          </form>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
