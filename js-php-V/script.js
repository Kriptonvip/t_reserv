class App extends React.Component {
  state = {
    tables: [],
    timeslots: [],
    selectedTable: null,
    selectedTimeslot: null,
    name: '',
    phone: '',
    email: '',
    comment: '',
    payment_method: '',
  };

  componentDidMount() {
    fetch('/api/tables')
      .then(response => response.json())
      .then(tables => {
        this.setState({ tables });
        // Загрузка временных слотов для каждого стола
        tables.forEach(table => {
          fetch(`/api/timeslots/${table.id}`)
            .then(response => response.json())
            .then(timeslots => {
              const updatedTimeslots = [...this.state.timeslots, ...timeslots];
              	console.log(tables);
              this.setState({ timeslots: updatedTimeslots });
            })
            .catch(error => console.log(error));
        });
      })
      .catch(error => console.log(error));
  }

  handleSelectTable = (table) => {
    this.setState({ selectedTable: table });
  };

  handleSelectTimeslot = (timeslot) => {
    this.setState({ selectedTimeslot: timeslot });
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { name, phone, email, comment, payment_method, selectedTimeslot } = this.state;
    const reservation = { name, phone, email, comment, payment_method, timeslot_id: selectedTimeslot };

    fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservation)
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

  render() {
    const { tables, timeslots, selectedTable, selectedTimeslot, name, phone, email, comment, payment_method } = this.state;

    return (
      <div className="container">
        <h2>Список столов</h2>
        <div className="row">
          {tables.map(table => (
            <div key={table.id} className="col-sm-6 col-md-4 mb-4">
              <div
                className={`card ${selectedTable === table ? 'selected' : ''}`}
                onClick={() => this.handleSelectTable(table)}
              >
                <div className="card-body">
                  <h5 className="card-title">{table.name}</h5>
                  <ul className="list-group">
                    {timeslots
                      .filter(timeslot => timeslot.table_id === table.id)
                      .map(timeslot => (
                        <li
                          key={timeslot.id}
                          className={`list-group-item ${selectedTimeslot === timeslot.id ? 'selected' : ''}`}
                          onClick={() => this.handleSelectTimeslot(timeslot.id)}
                        >
                          {timeslot.time} - {timeslot.isReserved ? 'Занято' : 'Свободно'}
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
            <label htmlFor="table">Выберите стол:</label>
            <select className="form-control" id="table" name="table" onChange={this.handleInputChange} required>
              <option value="">Выберите стол</option>
              {tables.map(table => (
                <option key={table.id} value={table.id}>
                  {table.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="comment">Комментарий</label>
            <textarea className="form-control" id="comment" name="comment" value={comment} onChange={this.handleInputChange} placeholder="Комментарий" />
          </div>
          <div className="form-group">
            <label htmlFor="payment_method">Способ оплаты</label>
            <select className="form-control" id="payment_method" name="payment_method" value={payment_method} onChange={this.handleInputChange} required>
              <option value="">Способ оплаты</option>
              <option value="card">Банковской картой в зале</option>
              <option value="cash">Наличными в зале</option>
              <option value="subscription">У меня абонемент</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Оформить бронь</button>
        </form>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
