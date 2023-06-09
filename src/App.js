import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { tables, timeslots } from './data';

const API_BASE_URL = '/api';
const App = () => {
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedTimeslots, setSelectedTimeslots] = useState([]);
  const [name, setName] = useState('test');
  const [phone, setPhone] = useState('test');
  const [email, setEmail] = useState('test@mail.ru');
  const [comment, setComment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 

  const loadOccupiedSlots = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/occupied_slots.php`);
      const occupiedSlotsData = await response.json();
      setOccupiedSlots(occupiedSlotsData);
      setLoading(false);
    } catch (error) {
      setError(error.toString());
    }
  };

  useEffect(() => {
    loadOccupiedSlots();

  }, [loading]);

  const handleDateChange = (date) => {
    const originalDate = new Date(date);
    const GMT3Date = new Date(originalDate.getTime() + 3 * 60 * 60 * 1000);
    setSelectedDate(GMT3Date);
    setSelectedTimeslots([]);
  };

  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  const handleSelectTimeslot = (timeslot) => {
    const isSlotOccupied = occupiedSlots.some(
      (occupiedSlot) =>
        occupiedSlot.date === selectedDate.toISOString().split('T')[0] &&
        occupiedSlot.occupied_slots.split(',').includes(timeslot.id.toString())
    );

    if (isSlotOccupied) {
      return;
    }

    if (selectedTimeslots.includes(timeslot)) {
      setSelectedTimeslots((prevTimeslots) => prevTimeslots.filter((slot) => slot.id !== timeslot.id));
    } else {
      setSelectedTimeslots((prevTimeslots) => [...prevTimeslots, timeslot]);
    }
  };

  const getTableIdBySlotId = (slotId) => {
    const timeslot = timeslots.find((slot) => slot.id === slotId);
    if (timeslot) {
      const table = tables.find((table) => table.id === timeslot.table_id);
      if (table) {
        return table.id;
      }
    }
    return null;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedTimeslots.length || !selectedDate || !selectedTable) {
      alert('Пожалуйста, выберите стол, дату и время бронирования');
      return;
    }

    const reservationPromises = selectedTimeslots.map((timeslot) => {
      const reservation = {
        name,
        phone,
        email,
        comment,
        payment_method: paymentMethod,
        timeslot_id: timeslot.id,
        table_id: selectedTable.id,
        date: selectedDate.toISOString().split('T')[0],
      };
      console.log(reservation)
      return fetch(`${API_BASE_URL}/reservations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
      }).then((response) => response.json());
    });

    Promise.all(reservationPromises)
      .then((responses) => {
        if (responses.every((response) => response.status === 'success')) {
          setSelectedTable(null);
          setSelectedTimeslots([]);
          setName('');
          setPhone('');
          setEmail('');
          setComment('');
          setPaymentMethod('');
          loadOccupiedSlots();
          alert('Все бронирования успешно созданы!');
        } else {
          alert('Произошла ошибка при создании бронирования');
        }
      });
  };

  const isTimeslotSelected = (timeslot) =>
    selectedTimeslots.some((selectedSlot) => selectedSlot.id === timeslot.id);

  const isSlotOccupied = (timeslot) =>
    occupiedSlots.some(
      (occupiedSlot) =>
        occupiedSlot.date === selectedDate.toISOString().split('T')[0] &&
        occupiedSlot.occupied_slots.split(',').includes(timeslot.id.toString())
    );

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container">
      <Calendar onChange={handleDateChange} value={selectedDate} />

      <h2>Выберите стол и время бронирования</h2>
      {!loading ? (
      <div className="row">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`col-sm-6 col-md-4 mb-4`}
          >
            <div className="card" onClick={() => handleSelectTable(table)}>
              <div className="card-body">
                <h5 className="card-title">{table.name}</h5>
                <ul className="list-group">
                  {timeslots
                    .filter((timeslot) => timeslot.table_id === table.id)
                    .map((timeslot) => (
                      <li
                        key={timeslot.id}
                        className={`list-group-item ${
                          isTimeslotSelected(timeslot) ? 'active' : ''
                        } ${isSlotOccupied(timeslot) ? 'list-group-item-dark' : ''}`}
                        onClick={() => handleSelectTimeslot(timeslot)}
                      >
                        {timeslot.start_time} - {timeslot.end_time}{' '}
                        {isSlotOccupied(timeslot) ? 'Забронированно' : 'Свободно'}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      ) : (
        <div className="text-center">Загрузка...</div>
      )} 
      <h2>Форма бронирования</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">ФИО</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Мобильный телефон</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="comment">Комментарий</label>
          <textarea
            className="form-control"
            id="comment"
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Комментарий"
          />
        </div>
        <div className="form-group">
          <label htmlFor="payment_method">Способ оплаты</label>
          <select
            className="form-control"
            id="payment_method"
            name="payment_method"
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
        <button type="submit" className="btn btn-primary">
          Оформить бронь
        </button>
      </form>
    </div>
  );
};

export default App;
