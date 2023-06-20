import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
// eslint-disable-next-line no-unused-vars 
import styles from './styles.css';
import { tables, timeslots } from './data';
import { Form, Button, Collapse } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

const API_BASE_URL = '/api';

const App = () => {
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedTimeslots, setSelectedTimeslots] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dayOfWeek, setWeekDay] = useState(selectedDate.getDay());
  const [weekdays, setWeekdays] = useState({
    monday: false,
    wednesday: false,
    thursday: false,
    saturday: false,
    friday: false,
  });
  const [skipInitial, setSkipInitial] = useState(true);
  const [open, setOpen] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const toggleOpen = (id) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [id]: !prevOpen[id],
    }));
  };
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
  const isWorkDay = (day) => day >= 1 && day <= 5;
  useEffect(() => {
    loadOccupiedSlots();
    loadReservations();
    handleLoadWeekdays();
  }, []);


  const handleDateChange = (date) => {
    const originalDate = new Date(date);
    const GMT3Date = new Date(originalDate.getTime() + 3 * 60 * 60 * 1000);
    setSelectedDate(GMT3Date);
    setWeekDay(GMT3Date.getDay());
    setSelectedTimeslots([]);
  };

  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  const isRange = (arr) => {
    const sortedArr = arr.map(obj => obj.id).sort((a, b) => a - b); // Получаем массив id и сортируем его по возрастанию
    const min = sortedArr[0]; // Минимальное значение
  
    // Проверяем, является ли массив диапазоном чисел
    return sortedArr.every((value, index) => value === min + index);
  }

  function addMissingObjects(arr) {
    const sortedArr = arr.map(obj => obj.id).sort((a, b) => a - b); // Получаем массив id и сортируем его по возрастанию
    const min = sortedArr[0]; // Минимальное значение
    const max = sortedArr[arr.length - 1]; // Максимальное значение
  
    const missingIds = []; // Массив для хранения недостающих id
  
    // Проверяем, является ли массив диапазоном чисел
    if (!isRange(arr)) {
      for (let i = min; i <= max; i++) {
        if (!sortedArr.includes(i)) {
          missingIds.push(i); // Добавляем недостающие id в массив missingIds
        }
      }
    }
  
    // Создаем новый массив с добавленными недостающими объектами
    const newArray = arr.concat(
      missingIds.map(id => {
        // Создаем новый объект с недостающим id
        return timeslots[id - 1];
      })
    );
  
    return newArray;
  }

  const handleSelectTimeslot = (timeslot) => {
    console.log(timeslot);
    console.log(selectedTimeslots);
    const isSlotOccupied = occupiedSlots.some(
      (occupiedSlot) =>
        occupiedSlot.date === selectedDate.toISOString().split('T')[0] &&
        occupiedSlot.occupied_slots.split(',').includes(timeslot.id.toString())
    );

    if (isSlotOccupied) {
      return;
    }
    const rateTimeFlags = [13, 14, 15];
      const isTimeslotInRateTime = rateTimeFlags.some(value => timeslot.start_time.includes(value))
      const hasSelectedTime = selectedTimeslots.some(slot => {
        const startTime = parseInt(slot.start_time.split(':')[0]); // Получаем часы начала как целое число
        return rateTimeFlags.includes(startTime); // Проверяем, присутствует ли startTime в массиве timeFlags
      });
      // если время выбранных таймслотов с 13 до 16, то нельзя вырать время позже
      if (hasSelectedTime && !isTimeslotInRateTime && isWorkDay(dayOfWeek)) {
        console.log('ratetime', dayOfWeek)
      return;
    }
    if (selectedTimeslots.length > 0 && !hasSelectedTime && isTimeslotInRateTime && isWorkDay(dayOfWeek)) {
      console.log('hourpaytime')
    return;
  }
    if (selectedTimeslots.includes(timeslot)) {
      setSelectedTimeslots((prevTimeslots) => {
        if(isRange(prevTimeslots.filter((slot) => slot.id !== timeslot.id))){
          return prevTimeslots.filter((slot) => slot.id !== timeslot.id)
        }
       return addMissingObjects([...prevTimeslots.filter((slot) => slot.id !== timeslot.id), timeslot]); 
       // если удаление слота делает массив выьранных солотов не упорядоченным диапазоном, то слот не удаляется, удалять слоты можно только с края всего промежутка времени.
      });
    } else {
     
      setSelectedTimeslots((prevTimeslots) => {
        if(isRange([...prevTimeslots, timeslot])){ // если слоты не идут по порядку, и есть пропуски то добавляем пропущеные слоты.
          return [...prevTimeslots, timeslot]
        }
        return addMissingObjects([...prevTimeslots, timeslot]);
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleClose();
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

  const deleteReservations = (reservationIds) => {
    reservationIds.forEach((reservationId) => {
      fetch(`${API_BASE_URL}/reservations/deleted_reservations.php?id=${reservationId}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            loadOccupiedSlots();
            loadReservations();
          } else {
            alert('Произошла ошибка при удалении бронирования');
          }
        });
    });
  };
  
  const confirmReservations = (reservationIds) => {
    reservationIds.forEach((reservationId) => {
      fetch(`${API_BASE_URL}/reservations/confirmed_reservations.php?id=${reservationId}`, {
        method: 'PUT',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            loadOccupiedSlots();
            loadReservations();
          } else {
            alert('Произошла ошибка при подтверждении бронирования');
          }
        });
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
    const { date, timeslots, confirmed, id, name, phone, comment } = reservation;
    if (!acc[date]) {
      acc[date] = [];
    }
    // Добавление информации о столе, времени начала и окончания в каждое бронирование
    const formattedTimeslots = timeslots.map((timeslot) => ({
      id,
      table_id: timeslot.table_id,
      start_time: timeslot.start_time,
      end_time: timeslot.end_time,
      confirmed,
      name,
      phone, 
      comment
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

 

  const handleToggleWeekday = (weekday) => {
    setSkipInitial(false); // Устанавливаем skipInitial в false после первой инициализации
    setWeekdays((prevWeekdays) => ({
      ...prevWeekdays,
      [weekday]: !prevWeekdays[weekday],
    }));
  };
  // useEffect для handleSaveWeekdays
  const handleSaveWeekdays = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/weekdays/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weekdays),
      });

      if (response.ok) {
        // Состояние сохранено успешно
      } else {
        // Обработка ошибки сохранения состояния
      }
    } catch (error) {
      // Обработка ошибки запроса
    }
  };

  
  useEffect(() => {
    if (skipInitial) {
      return;
    }
    handleSaveWeekdays();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekdays]);
  

  const handleLoadWeekdays = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/weekdays/index.php`);
      const weekdaysData = await response.json();
      setWeekdays(weekdaysData);
    } catch (error) {
      // Обработка ошибки запроса
    }
  };

  function getOverallTime(slots) {
    if (slots.length === 0) {
      return [];
    }
    slots.sort((a, b) => {
      return a.start_time.localeCompare(b.start_time);
    });
  
    const startTime = slots[0].start_time.slice(0, 5);
    const endTime = slots[slots.length - 1].end_time.slice(0, 5);
  
    return [startTime, endTime];
  }
  
  function calculateTableRentCost(startTimeSlot, endTimeSlot, reservDayOfWeek) {
    if(startTimeSlot === undefined && endTimeSlot === undefined) {
      return '0 рублей';
    }
    const [startH, startM] = startTimeSlot.split(':');
    const [endH, endM] = endTimeSlot.split(':');
    const startTime = new Date(0, 0, 0, startH, startM); // 13:00
    const endTime = new Date(0, 0, 0, endH, endM); // 16:30

    const weekdayRateStartTime = 13; // Начальное время с рабочей ставкой
    const weekdayRateEndTime = 16; // Конечное время с рабочей ставкой
    const weekdayRate = 200; // Стоимость аренды в рабочие часы
  
    const hourlyRate = 400; // Стоимость аренды за час в остальное время
  
    // Вычисляем количество часов бронирования
    const duration = (endTime - startTime) / (60 * 60 * 1000); // Предполагается, что startTime и endTime представляют себя время в миллисекундах
  
    // Проверяем, попадает ли время бронирования в рабочие часы
    if (
      startTime.getHours() >= weekdayRateStartTime &&
      (endTime.getHours() < weekdayRateEndTime || (endTime.getHours() === weekdayRateEndTime && endTime.getMinutes() === 0)) &&
      isWorkDay(reservDayOfWeek)
    ) {
      return weekdayRate + ' рублей c человека';
    }
  
    // В остальных случаях возвращаем стоимость аренды за час, умноженную на количество часов бронирования
    return hourlyRate * duration + ' рублей';
  }

  const [stT, andT] = getOverallTime(selectedTimeslots)


  return (
    <div className="container">
      <Calendar onChange={handleDateChange} value={selectedDate} className="mx-auto m-3"/>

      <h2  className="text-center m-2">Выберите дату, стол и время бронирования</h2>
      {!loading ? (
        <div className="row">
          {tables.map((table) => (
            <div key={table.id} className={`col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2mb-4 mt-2`}>
              <div className="card" onClick={() => handleSelectTable(table)}>
                <div className="card-body">
                    <h5 className="card-title d-flex justify-content-between m-0 align-items-center ">
                        <p className="m-0">{table.name} </p>
                        <Button
                            onClick={() => toggleOpen(table.id)}
                            aria-controls="collapse-text"
                            aria-expanded={open[table.id]}
                            className="float-right"  // этот класс размещает кнопку справа
                        >
                            {open[table.id] ? 'скрыть −' : 'раскрыть +'}
                        </Button>
                    </h5>

                    <Collapse in={open[table.id]}>
                       <div id="collapse-text">
                              <ul className="list-group mt-2">
                                  {timeslots
                                      .filter((timeslot) => timeslot.table_id === table.id)
                                      .filter((timeslot) => {
                                          let originalDate = new Date(selectedDate);
                                          let comparisonDate = new Date();
                                          const [hours, minutes] = timeslot.start_time.split(':');
                                          let newDate = new Date(originalDate);
                                          newDate.setHours(hours, minutes);
                                          const childrenClasses = !(isWorkDay(dayOfWeek) && (hours >= 10 && hours < 13))
                                          const mon = dayOfWeek === 1 && weekdays.monday && (hours >= 19);
                                          const wed = dayOfWeek === 3 && weekdays.wednesday && (hours >= 19);
                                          const thu = dayOfWeek === 4 && weekdays.thursday && (hours >= 19);
                                          const sat = dayOfWeek === 6 && weekdays.saturday && (hours >= 10 && hours <= 13);
                                          const fri = dayOfWeek === 5 && weekdays.friday && (hours >= 19);
                                          return newDate > comparisonDate && childrenClasses && !mon && !wed && !thu && !sat && !fri;
                                      })
                                      .map((timeslot) => (
                                          <li
                                          key={timeslot.id}
                                          className={`list-group-item text-center ${
                                              isTimeslotSelected(timeslot) ? 'active' : ''
                                          } ${isSlotOccupied(timeslot) ? 'list-group-item-dark' : ''}`}
                                          onClick={() => handleSelectTimeslot(timeslot)}
                                          >
                                          {timeslot.start_time.substring(0, timeslot.start_time.lastIndexOf(':'))} - {timeslot.end_time.substring(0, timeslot.end_time.lastIndexOf(':'))}
                                          {isSlotOccupied(timeslot) ? ` бронь ${isSlotConfirmed(timeslot) ? '(подтверждена)' : '(отправлена)'}` : ' Свободно'}
                                          </li>
                                      ))}
                              </ul>
                          </div>
                      </Collapse>
                  </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">Загрузка...</div>
      )}
     <Button 
        variant="success" 
        className='m-3 position-sticky fixed-bottom d-block w-50 mx-auto'
        onClick={handleShow}
      >
        Забронировать (Цена: {calculateTableRentCost(stT, andT, selectedDate.getDay())})
      </Button>



      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Форма бронирования</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-2">
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
          <div className="form-group mb-2">
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
          <div className="form-group mb-2">
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
          <div className="form-group mb-2">
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
          <div className="form-group mb-2">
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
            </select>
          </div>
          <button type="submit" className="btn btn-primary mt-2 d-block mx-auto">
          Забронировать (Цена: {calculateTableRentCost(stT, andT, selectedDate.getDay())})
          </button>
          </form>
          </Modal.Body>
       </Modal>
    {!!window.isUserLoggedIn ? null : 
    ( <>
      <h2>Управление бронированиями</h2>
      <Form.Check
            type="switch"
            id="monladder-switch"
            label={weekdays.monday ? 'Доступность бронирования на вечер понедельника отменена' : 'Доступность бронирования на вечер понедельника включена'}
            checked={weekdays.monday}
            onChange={() => handleToggleWeekday('monday')}
          />

          <Form.Check
            type="switch"
            id="wedladder-switch"
            label={weekdays.wednesday ? 'Доступность бронирования на вечер среды отменена' : 'Доступность бронирования на вечер среды включена'}
            checked={weekdays.wednesday}
            onChange={() => handleToggleWeekday('wednesday')}
          />

          <Form.Check
            type="switch"
            id="thuT-switch"
            label={weekdays.thursday ? 'Доступность бронирования на вечер четверга отменена' : 'Доступность бронирования на вечер четверга включена'}
            checked={weekdays.thursday}
            onChange={() => handleToggleWeekday('thursday')}
          />

          <Form.Check
            type="switch"
            id="satT-switch"
            label={weekdays.friday ? 'Доступность бронирования на вечер пятницы отменена' : 'Доступность бронирования на вечер пятницы включена'}
            checked={weekdays.friday}
            onChange={() => handleToggleWeekday('friday')}
          />

          <Form.Check
            type="switch"
            id="satT-switch"
            label={weekdays.saturday ? 'Доступность бронирования на день субботы отменена' : 'Доступность бронирования на день субботы включена'}
            checked={weekdays.saturday}
            onChange={() => handleToggleWeekday('saturday')}
          />
      
      <div className="row">
      {Object.keys(groupedReservations).sort().map((date) => (
        <div className="col-sm-6 col-md-6" key={date}>
          <p>Бронирование на дату: {date}</p>
          <ul className="list-group">
            {groupedReservations[date].reduce((acc, reservation) => {
              const { id, start_time, end_time, table_id, name, phone, comment } = reservation;
              const confirmed = reservation.confirmed;
              const lastReservation = acc[acc.length - 1];

              if (lastReservation && lastReservation.phone === phone && lastReservation.end_time === start_time) {
                // Смежные таймслоты, забронированные одним человеком
                lastReservation.end_time = end_time;
                lastReservation.reservationIds.push(id);
              } else {
                // Новый таймслот
                acc.push({
                  id,
                  start_time,
                  end_time,
                  table_id,
                  name,
                  phone,
                  comment,
                  confirmed,
                  reservationIds: [id], // Создаем массив с одним элементом - текущим id резерва
                });
              }

              return acc;
            }, []).map((reservation) => {
              const { id, start_time, end_time, table_id, name, phone, comment, confirmed, reservationIds } = reservation;
              return (
                <li className="list-group-item d-flex justify-content-between align-items-center" key={id}>
                  <div>
                    <p>Имя: {name}</p>
                    <p>Телефон: {phone}</p>
                    <p>Комментарий: {comment}</p>
                    <p>Стол №{table_id} {start_time} - {end_time}</p>
                    <p>Стоимость: {calculateTableRentCost(start_time,end_time, new Date(date).getDay())}</p>
                  </div>
                  <div>
                    <button className="btn btn-danger m-2" onClick={() => deleteReservations(reservationIds)}>Удалить</button>
                    {confirmed === "1" ? null : (
                      <button className="btn btn-success" onClick={() => confirmReservations(reservationIds)}>Подтвердить</button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      </div>
      </>
    )} 
    </div>
  );
};

export default App;