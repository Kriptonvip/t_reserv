import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { tables, timeslots } from '../src/data';

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
  const [reservations, setReservations] = useState([]);
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
  const loadReservations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/all_reservations.php`);
      const reservationsData = await response.json();
      setReservations(reservationsData);
    } catch (error) {
      setError(error.toString());
    }
  };

  useEffect(() => {
    loadOccupiedSlots();
    loadReservations();
  }, []);

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
          loadReservations();
        } else {
          alert('Произошла ошибка при создании бронирования');
        }
      });
  };

  const deleteReservation = (reservationId) => {
    console.log(reservationId);
    fetch(`${API_BASE_URL}/reservations/deleted_reservations.php?id=${reservationId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          loadOccupiedSlots();
          loadReservations();
          // alert('Бронирование успешно удалено!');
        } else {
          alert('Произошла ошибка при удалении бронирования');
        }
      });
  };

  const confirmReservation = (reservationId) => {
    console.log(reservationId);
    fetch(`${API_BASE_URL}/reservations/confirmed_reservations.php?id=${reservationId}`, {
      method: 'PUT',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          loadOccupiedSlots();
          loadReservations();
          // alert('Бронирование успешно подтверждено!');
        } else {
          alert('Произошла ошибка при подтверждении бронирования');
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
    const isSlotConfirmed = (timeslot) => reservations.some(
      (reservation) => {
       const hasInReserv = reservation.timeslots.some((slot) => slot.id === `${timeslot.id}`);
        return hasInReserv && reservation.confirmed === "1";
      })
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'comment':
        setComment(value);
        break;
      case 'payment_method':
        setPaymentMethod(value);
        break;
      default:
        break;
    }
  };
  
  const groupedReservations = reservations.reduce((acc, reservation) => {
    const { date, timeslots, confirmed, id } = reservation;
    if (!acc[date]) {
      acc[date] = [];
    }
    // Добавление информации о столе, времени начала и окончания в каждое бронирование
    const formattedTimeslots = timeslots.map((timeslot) => ({
      id,
      table_id: timeslot.table_id,
      start_time: timeslot.start_time,
      end_time: timeslot.end_time,
      confirmed: confirmed
    }));
    acc[date] = acc[date].concat(formattedTimeslots);
    return acc;
  }, {});
  
  // Сортировка столов по возрастанию номера стола и времени начала
  for (const date in groupedReservations) {
    groupedReservations[date].sort((a, b) => {
      if (a.table_id !== b.table_id) {
        return a.table_id - b.table_id;
      }
      return a.start_time.localeCompare(b.start_time);
    });
  }
  

  return (
    <div className="container">
      <Calendar onChange={handleDateChange} value={selectedDate} />

      <h2>Выберите стол и время бронирования</h2>
      {!loading ? (
        <div className="row">
          {tables.map((table) => (
            <div key={table.id} className={`col-sm-6 col-md-4 mb-4`}>
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
                          {isSlotOccupied(timeslot) ? `бронь ${isSlotConfirmed(timeslot) ? '(подтверждена)' : '(отправлена)'}` : 'Свободно'}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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

      <h2>Управление бронированиями</h2>
      <div className="row">
        {Object.keys(groupedReservations).sort().map((date) => (
          <div className = "col-sm-6 col-md-4" key={date}>
            <p>Бронирование на дату: {date}</p>
            <ul className="list-group">
              {groupedReservations[date].map((reservation) => {
                const { id, start_time, end_time, table_id } = reservation;
                const table = table_id;
                const confirmed = reservation.confirmed;
                return (
                  <li className="list-group-item d-flex justify-content-between align-items-center" key={id}>
                    Стол №{table} {start_time} - {end_time}
                    <button className="btn btn-danger m-2"  onClick={() => deleteReservation(reservation.id)}>Удалить</button>
                    {confirmed === "1" ? null : (
                      <button className="btn btn-success" onClick={() => confirmReservation(reservation.id)}>Подтвердить</button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>


    </div>
  );
};

export default App;
