import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const API_BASE_URL = '/api';

class App extends React.Component {
  state = {
    tables: [],
    timeslots: [],
    selectedTable: null,
    selectedTimeslot: [],  // теперь это массив
    selectedDate: new Date(),  // добавляем новое свойство состояния
    name: '',
    phone: '',
    email: '',
    comment: '',
    payment_method: '',
    error: null,  // новое свойство состояния для ошибок
  };

  componentDidMount() {
    this.loadTimeslots();  // загружаем слоты при монтировании
  }

  loadTimeslots = () => {
    // обнуляем состояние ошибки перед началом загрузки
    this.setState({ error: null });
  
    fetch(`${API_BASE_URL}/tables/`)
      .then((response) => response.json())
      .then((tables) => {
        this.setState({ tables });
  
        // Очищаем состояние timeslots перед загрузкой
        this.setState({ timeslots: [] });
  
        // Загрузка временных слотов для каждого стола
        tables.forEach((table) => {
          fetch(`${API_BASE_URL}/timeslots/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ table_id: table.id, date: this.state.selectedDate.toISOString().split('T')[0] }), // add date to the request
          })
            .then((response) => response.json())
            .then((timeslots) => {
              const updatedTimeslots = [...this.state.timeslots];
              timeslots.forEach((timeslot) => {
                if (!updatedTimeslots.some((slot) => slot.id === timeslot.id)) {
                  updatedTimeslots.push(timeslot);
                }
              });
              this.setState({ timeslots: updatedTimeslots });
            })
            .catch((error) => this.setState({ error: error.toString() })); // обрабатываем ошибку
        });
  
        // Загрузка информации о занятых слотах
        fetch(`${API_BASE_URL}/reservations/occupied_slots.php`)
          .then((response) => response.json())
          .then((occupiedSlots) => {
            this.setState({ occupiedSlots });
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => this.setState({ error: error.toString() })); // обрабатываем ошибку
  };

  handleDateChange = (date) => {
    this.setState({ selectedDate: date, selectedTimeslot: [] }, this.loadTimeslots);
  };

  handleSelectTable = (table) => {
    this.setState({ selectedTable: table });
    
  };

  handleSelectTimeslot = (timeslot) => {
    const { selectedTimeslot, occupiedSlots } = this.state;
  
    // Проверяем, занят ли слот
    const isSlotOccupied = occupiedSlots.some(
      (occupiedSlot) =>
        occupiedSlot.date === this.state.selectedDate.toISOString().split('T')[0] &&
        occupiedSlot.occupied_slots.split(',').includes(timeslot.id.toString())
    );
  
    if (isSlotOccupied) {
      console.log('1');
      // Если слот занят, ничего не делаем
      return;
    }
  
    const updatedTimeslots = [...selectedTimeslot];
    const timeslotIndex = updatedTimeslots.findIndex((slot) => slot.id === timeslot.id);
  
    if (timeslotIndex === -1) {
      updatedTimeslots.push(timeslot); // Добавляем временной слот, если он еще не был выбран
    } else {
      updatedTimeslots.splice(timeslotIndex, 1); // Удаляем временной слот, если он уже был выбран
    }
  
    this.setState({ selectedTimeslot: updatedTimeslots });
  };


  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state.selectedDate);
    const { name, phone, email, comment, payment_method, selectedTimeslot, selectedTable, selectedDate } = this.state;

    if (!selectedTimeslot.length || !selectedDate) {
      alert('Пожалуйста, выберите время и дату');
      return;
    }

    Promise.all(selectedTimeslot.map(timeslot => {
      const reservation = {
        name,
        phone,
        email,
        comment,
        payment_method,
        timeslot_id: timeslot.id,
        table_id: selectedTable.id,
        date: selectedDate.toISOString().split('T')[0],  // convert JavaScript Date to YYYY-MM-DD format
      };

      return fetch('/api/reservations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
      })
        .then(response => response.json())
    }))
      .then(responses => {
        if (responses.every(response => response.status === 'success')) {
          this.loadTimeslots();
          alert('Все бронирования успешно созданы!');
        } else {
          alert('Произошла ошибка при создании бронирования');
        }
      });
};
  

  render() {
    const {
      tables,
      timeslots,
      selectedTable,
      selectedTimeslot,
      name,
      phone,
      email,
      comment,
      payment_method,
    } = this.state;

    return (
      <div className="container">
        <Calendar
          onChange={this.handleDateChange}
          value={this.state.selectedDate}
        />

        {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}  // отображаем ошибку, если она есть
        <h2>Выберите стол и время бронирования</h2>
        <div className="row">
          {tables.map((table) => (
            <div key={table.id} className="col-sm-6 col-md-4 mb-4">
              <div
                className={`card ${selectedTable === table ? 'active' : ''}`}
                onClick={() => this.handleSelectTable(table)}>
                <div className="card-body">
                  <h5 className="card-title">{table.name}</h5>
                  <ul className="list-group">
                  {timeslots
                    .filter((timeslot) => timeslot.table_id === table.id)
                    .map((timeslot) => (
                      <li
                        key={timeslot.id}
                        className={`list-group-item ${
                          selectedTimeslot?.some(slot => slot.id === timeslot.id) ? 'active' : ''
                        }`}
                        onClick={() =>
                          this.handleSelectTimeslot(timeslot)
                        }>
                        {timeslot.start_time} - {timeslot.end_time}{' '}
                        {timeslot.isReserved ? 'Занято' : 'Свободно'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2>Форма бронирования</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">ФИО</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              onChange={this.handleInputChange}
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
              onChange={this.handleInputChange}
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
              onChange={this.handleInputChange}
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
              onChange={this.handleInputChange}
              placeholder="Комментарий"
            />
          </div>
          <div className="form-group">
            <label htmlFor="payment_method">Способ оплаты</label>
            <select
              className="form-control"
              id="payment_method"
              name="payment_method"
              value={payment_method}
              onChange={this.handleInputChange}
              required>
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
  }
}

export default App;

