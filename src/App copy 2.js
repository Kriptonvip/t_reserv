import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = '/api';

const App = () => {
  const [tables, setTables] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTimeslots();
  }, []);

  useEffect(() => {
    setSelectedTimeslot([]);
    loadTimeslots();
  }, [selectedDate]);

  const loadTimeslots = () => {
    setError(null);

    fetch(`${API_BASE_URL}/tables/`)
      .then((response) => response.json())
      .then((tables) => {
        setTables(tables);

        const timeslotPromises = tables.map((table) =>
          fetch(`${API_BASE_URL}/timeslots/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              table_id: table.id,
              date: selectedDate.toISOString().split('T')[0],
            }),
          })
            .then((response) => response.json())
            .then((timeslots) => {
              return timeslots.map((timeslot) => ({ ...timeslot, tableId: table.id }));
            })
            .catch((error) => {
              console.error(error);
              return [];
            })
        );

        Promise.all(timeslotPromises)
          .then((timeslotResults) => {
            const updatedTimeslots = timeslotResults.flat();
            setTimeslots(updatedTimeslots);
          })
          .catch((error) => setError(error.toString()));

        fetch(`${API_BASE_URL}/reservations/occupied_slots.php`)
          .then((response) => response.json())
          .then((occupiedSlots) => {
            setOccupiedSlots(occupiedSlots);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => setError(error.toString()));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSelectTable = (table) => {
    const isTableOccupied = occupiedSlots.some(
      (occupiedSlot) =>
        occupiedSlot.date === selectedDate.toISOString().split('T')[0] &&
        occupiedSlot.occupied_slots.split(',').some((slotId) => getTableIdBySlotId(slotId) === table.id)
    );

    if (isTableOccupied) {
      return;
    }

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

    const timeslotIndex = selectedTimeslot.findIndex((slot) => slot.id === timeslot.id);

    if (timeslotIndex === -1) {
      setSelectedTimeslot((prevTimeslots) => [...prevTimeslots, timeslot]);
    } else {
      setSelectedTimeslot((prevTimeslots) => prevTimeslots.filter((slot) => slot.id !== timeslot.id));
    }
  };

  const getTableIdBySlotId = (slotId) => {
    const timeslot = timeslots.find((slot) => slot.id === slotId);
    if (timeslot) {
      const table = tables.find((table) => table.id === timeslot.tableId);
      if (table) {
        return table.id;
      }
    }
    return null;
  };

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedTimeslot.length || !selectedDate) {
      alert('Пожалуйста, выберите дату и время бронирования');
      return;
    }

    Promise.all(
      selectedTimeslot.map((timeslot) => {
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
      })
    )
      .then((responses) => {
        if (responses.every((response) => response.status === 'success')) {
          loadTimeslots();
          alert('Все бронирования успешно созданы!');
        } else {
          alert('Произошла ошибка при создании бронирования');
        }
      });
  };

  const isTableOccupied = (table) =>
    occupiedSlots.some(
      (occupiedSlot) =>
        occupiedSlot.date === selectedDate.toISOString().split('T')[0] &&
        occupiedSlot.occupied_slots.split(',').some((slotId) => getTableIdBySlotId(slotId) === table.id)
    );

  const isSlotOccupied = (timeslot) =>
    occupiedSlots.some(
      (occupiedSlot) =>
        occupiedSlot.date === selectedDate.toISOString().split('T')[0] &&
        occupiedSlot.occupied_slots.split(',').includes(timeslot.id.toString())
    );

  return (
    <div className="container">
      <Calendar onChange={handleDateChange} value={selectedDate} />

      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Выберите стол и время бронирования</h2>
      <div className="row">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`col-sm-6 col-md-4 mb-4 ${isTableOccupied(table) ? 'list-group-item-dark' : ''}`}
          >
            <div className="card" onClick={() => handleSelectTable(table)}>
              <div className="card-body">
                <h5 className="card-title">{table.name}</h5>
                <ul className="list-group">
                  {timeslots
                    .filter((timeslot) => timeslot.tableId === table.id)
                    .map((timeslot) => (
                      <li
                        key={timeslot.id}
                        className={`list-group-item ${
                          selectedTimeslot.some((slot) => slot.id === timeslot.id) ? 'active' : ''
                        } ${isSlotOccupied(timeslot) ? 'list-group-item-dark' : ''}`}
                        onClick={() => handleSelectTimeslot(timeslot)}
                      >
                        {timeslot.start_time} - {timeslot.end_time}{' '}
                        {isSlotOccupied(timeslot) ? 'Занято' : 'Свободно'}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default App;
