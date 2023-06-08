import React from 'react';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = '/api';

class App extends React.Component {
  state = {
    tables: [],
    timeslots: [],
    selectedTable: null,
    selectedTimeslot: [],
    selectedDate: new Date(),
    name: '',
    phone: '',
    email: '',
    comment: '',
    payment_method: '',
    occupiedSlots: [],
    error: null,
  };

  componentDidMount() {
    this.loadTimeslots();
  }

  loadTimeslots = () => {
    this.setState({ error: null });

    fetch(`${API_BASE_URL}/tables/`)
      .then((response) => response.json())
      .then((tables) => {
        this.setState({ tables });

        this.setState({ timeslots: [] });

        tables.forEach((table) => {
          fetch(`${API_BASE_URL}/timeslots/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              table_id: table.id,
              date: this.state.selectedDate.toISOString().split('T')[0],
            }),
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
            .catch((error) => this.setState({ error: error.toString() }));
        });

        fetch(`${API_BASE_URL}/reservations/occupied_slots.php`)
          .then((response) => response.json())
          .then((occupiedSlots) => {
            this.setState({ occupiedSlots });
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => this.setState({ error: error.toString() }));
  };

  handleDateChange = (date) => {
    this.setState({ selectedDate: date, selectedTimeslot: [] }, this.loadTimeslots);
  };

  handleSelectTable = (table) => {
    const { occupiedSlots } = this.state;
    const isTableOccupied = occupiedSlots.some(
      (occupiedSlot) =>
        occupiedSlot.date === this.state.selectedDate.toISOString().split('T')[0] &&
        occupiedSlot.occupied_slots.split(',').some((slotId) => this.getTableIdBySlotId(slotId) === table.id)
    );

    if (isTableOccupied) {
      return;
    }

    this.setState({ selectedTable: table });
  };

  handleSelectTimeslot = (timeslot) => {
    const { selectedTimeslot, occupiedSlots } = this.state;

    const isSlotOccupied = occupiedSlots.some(
      (occupiedSlot) =>
        occupiedSlot.date === this.state.selectedDate.toISOString().split('T')[0] &&
        occupiedSlot.occupied_slots.split(',').includes(timeslot.id.toString())
    );

    if (isSlotOccupied) {
      return;
    }

    const updatedTimeslots = [...selectedTimeslot];
    const timeslotIndex = updatedTimeslots.findIndex((slot) => slot.id === timeslot.id);

    if (timeslotIndex === -1) {
      updatedTimeslots.push(timeslot);
    } else {
      updatedTimeslots.splice(timeslotIndex, 1);
    }

    this.setState({ selectedTimeslot: updatedTimeslots });
  };

  getTableIdBySlotId = (slotId) => {
    const { tables, timeslots } = this.state;
    const timeslot = timeslots.find((slot) => slot.id === slotId);
    if (timeslot) {
      const table = tables.find((table) => table.id === timeslot.table_id);
      if (table) {
        return table.id;
      }
    }
    return null;
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { name, phone, email, comment, payment_method, selectedTimeslot, selectedTable, selectedDate } = this.state;

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
          payment_method,
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
      occupiedSlots,
    } = this.state;

    const isTableOccupied = (table) =>
      occupiedSlots.some(
        (occupiedSlot) =>
          occupiedSlot.date === this.state.selectedDate.toISOString().split('T')[0] &&
          occupiedSlot.occupied_slots.split(',').some((slotId) => this.getTableIdBySlotId(slotId) === table.id)
      );

    const isSlotOccupied = (timeslot) =>
      occupiedSlots.some(
        (occupiedSlot) =>
          occupiedSlot.date === this.state.selectedDate.toISOString().split('T')[0] &&
          occupiedSlot.occupied_slots.split(',').includes(timeslot.id.toString())
      );
      const isTimeslotsLoaded = timeslots.length > 0;
      console.log(timeslots)

    return (
      <div className="container">
        <Calendar onChange={this.handleDateChange} value={this.state.selectedDate} />

        {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
        <h2>Выберите стол и время бронирования</h2>
        <div className="row">
          {tables.map((table) => (
            <div key={table.id} className={`col-sm-6 col-md-4 mb-4 ${isTableOccupied(table) ? 'list-group-item-dark' : ''}`}>
              <div className="card" onClick={() => this.handleSelectTable(table)}>
                <div className="card-body">
                  <h5 className="card-title">{table.name}</h5>
                  {isTimeslotsLoaded ? (
                  <ul className="list-group">
                    {timeslots
                      .filter((timeslot) => timeslot.table_id === table.id)
                      .map((timeslot) => (
                        <li
                          key={timeslot.id}
                          className={`list-group-item ${
                            selectedTimeslot.some((slot) => slot.id === timeslot.id) ? 'active' : ''
                          } ${isSlotOccupied(timeslot) ? 'list-group-item-dark' : ''}`}
                          onClick={() => this.handleSelectTimeslot(timeslot)}
                        >
                          {timeslot.start_time} - {timeslot.end_time}{' '}
                          {isSlotOccupied(timeslot) ? 'Занято' : 'Свободно'}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <div>Loading...</div> // Отображение загрузочного состояния
                )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2>Форма бронирования</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">ФИО</label>
            <input type="text" className="form-control" id="name" name="name" value={name} onChange={this.handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Мобильный телефон</label>
            <input type="tel" className="form-control" id="phone" name="phone" value={phone} onChange={this.handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" className="form-control" id="email" name="email" value={email} onChange={this.handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="comment">Комментарий</label>
            <textarea className="form-control" id="comment" name="comment" value={comment} onChange={this.handleInputChange} placeholder="Комментарий" />
          </div>
          <div className="form-group">
            <label htmlFor="payment_method">Способ оплаты</label>
            <select
              className="form-control"
              id="payment_method"
              name="payment_method"
              value={payment_method}
              onChange={this.handleInputChange}
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
  }
}

export default App;
