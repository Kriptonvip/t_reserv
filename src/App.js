import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';

// eslint-disable-next-line no-unused-vars
import styles from './styles.css';
import { limitHours, tables, timeslotsData, limitArrs } from './data';
import { Form, Button, Collapse } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import ReservationTable from './components/ReservationTables';
import BronControl from './components/BronControl';
import { AuthContext } from './components/AuthProvider';

const API_BASE_URL = '/api';
const GMT3Date = (date) => new Date(date.getTime() + 3 * 60 * 60 * 1000);
const App = () => {
  const [selectedDate, setSelectedDate] = useState(GMT3Date(new Date()));
  const [selectedTable, setSelectedTable] = useState(null);
  const [timeslots, setTimeslots] = useState(timeslotsData);
  const [selectedTimeslots, setSelectedTimeslots] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dayOfWeek, setWeekDay] = useState(
    selectedDate.toDateString().split(' ')[0]
  );
  const [weekdays, setWeekdays] = useState({
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });
  const [price, setPrice] = useState(0);
  const [hasSaleRate, setHasSaleRate] = useState(false);
  const [skipInitial, setSkipInitial] = useState(true);
  const [open, setOpen] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { loadingAuth, token } = useContext(AuthContext);
  // console.log(token);

  const loadTimeslots = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/timeslots/index.php`);
      const timeslotsData = await response.json();
      setTimeslots(timeslotsData);
      console.log('timeslots fetch', timeslots);
    } catch (error) {
      console.error('Ошибка при загрузке данных о слотах:', error);
    }
  };
  const saveTimeslotsToDatabase = async (timeslotsData) => {
    console.log( 'при отправке', timeslotsData)
    try {
      const response = await fetch(`${API_BASE_URL}/timeslots/index.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timeslotsData),
      });

      if (response.ok) {
        console.log('Данные о слотах успешно сохранены');
        console.log('timeslots POST', timeslots);
        loadTimeslots();
      } else {
        console.error('Произошла ошибка при сохранении данных о слотах');
      }
    } catch (error) {
      console.error('Ошибка при отправке данных о слотах на сервер:', error);
    }
  };
  // Вызываем функцию загрузки данных о слотах при инициализации компонента
  const handleSaveTimeslots = (idArr, day) => {
    // Подготавливаем данные о слотах для сохранения (можете использовать timeslots или другую структуру данных)
    const timeslotsData = timeslots.slice();
    // timeslotsData.forEach(timeSlot => timeSlot.notAvailable = '');
    idArr.forEach((id) => {
      if (timeslotsData[id - 1].notAvailable.includes(day)) {
        timeslotsData[id - 1].notAvailable = timeslotsData[id - 1].notAvailable.replace(day, '');
      } else {
        timeslotsData[id - 1].notAvailable += day;
      }
    });
    // Вызываем функцию для отправки данных о слотах на сервер
    saveTimeslotsToDatabase(timeslotsData);
    // ваша структура данных о слотах
  };
  function areAllNotAvailable(ids, day) {
    return ids.every((id) =>
      timeslots.find((item) => item.id === id)?.notAvailable.includes(day)
    );
  }

  const toggleOpen = (id) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [id]: !prevOpen[id],
    }));
  };

  const loadReservations = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reservations/all_reservations.php`
      );
      const reservationsData = await response.json();
      setReservations(reservationsData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadTimeslots();
    loadReservations();
    handleLoadWeekdays();
    // handleDateChange(selectedDate)
    setLoading(false);
  }, []);

  const handleDateChange = (date) => {
    const dateGMT3 = GMT3Date(date);
    setSelectedDate(dateGMT3);
    setWeekDay(dateGMT3.toDateString().split(' ')[0]);
    setSelectedTimeslots([]);
    loadReservations();
  };

  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  const isRange = (arr) => {
    const sortedArr = arr.map((obj) => obj.id).sort((a, b) => a - b); // Получаем массив id и сортируем его по возрастанию
    const min = sortedArr[0]; // Минимальное значение

    // Проверяем, является ли массив диапазоном чисел
    return sortedArr.every((value, index) => value === min + index);
  };

  function addMissingObjects(arr) {
    const sortedArr = arr.map((obj) => obj.id).sort((a, b) => a - b); // Получаем массив id и сортируем его по возрастанию
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
      missingIds.map((id) => {
        // if(isSlotOccupied(timeslots[id-1])) {
        //   return;
        // }
        console.log(isSlotOccupied(timeslots[id - 1]));
        // Создаем новый объект с недостающим id
        return timeslots[id - 1];
      })
    );

    return newArray;
  }
  const isSlotOccupied = (timeslot) =>
    reservations.some(
      (reservation) =>
        reservation.date === selectedDate.toISOString().split('T')[0] &&
        reservation.timeslots.some(
          (reservTimeslot) => reservTimeslot.id === timeslot.id.toString()
        )
    );

  const handleSelectTimeslot = (timeslot) => {
    loadReservations();
    if (!hasSaleRate && timeslot.saleRate) {
      setHasSaleRate(true);
    }
    const diffTable = (timeslot) =>
      selectedTimeslots.every((slot) => timeslot.table_id === slot.table_id);

    if (!diffTable(timeslot)) {
      setSelectedTimeslots([timeslot]);
    }
    if (isSlotOccupied(timeslot)) {
      return;
    }
    if (selectedTimeslots.includes(timeslot)) {
      setSelectedTimeslots((prevTimeslots) => {
        const updatedTimeslots = prevTimeslots.filter(
          (slot) => slot.id < timeslot.id
        );
        return updatedTimeslots;
      });
    } else {
      setSelectedTimeslots((prevTimeslots) => {
        if (isRange([...prevTimeslots, timeslot])) {
          // если слоты не идут по порядку, и есть пропуски то добавляем пропущеные слоты.
          return [...prevTimeslots, timeslot];
        }
        if (
          addMissingObjects([...prevTimeslots, timeslot]).some((item) =>
            isSlotOccupied(item)
          )
        ) {
          return [timeslot];
        }
        return addMissingObjects([...prevTimeslots, timeslot]);
      });
    }
  };

  const isReservationExists = (reservation, reservations) => {
    // Преобразуем дату в строку в формате "YYYY-MM-DD"
    const reservationDate = reservation.date;
  
    // Проверяем каждый резерв в массиве reservations
    for (const existingReservation of reservations) {
      // Проверяем совпадение дат
      if (existingReservation.date === reservationDate) {
        // Проверяем совпадение id слотов
        for (const timeslotId of reservation.timeslot_ids) {
          if (existingReservation.timeslots.find((timeslot) => {
              return timeslot.id === timeslotId.toString()
            } )) {
            // Если найден хотя бы один резерв с совпадающим id слота и датой, возвращаем true
            return true;
          }
        }
      }
    }
    // Если не найдено совпадений, возвращаем false
    return false;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    handleClose();
    const response = await fetch(`${API_BASE_URL}/reservations/all_reservations.php`);
    const reservationsData = await response.json(); //берем актуальные данные о резервах перед созданием нового бронирования.
    
    console.log('loadReservations end', reservationsData );
    if (!selectedTimeslots.length || !selectedDate || !selectedTable) {
      alert('Пожалуйста, выберите стол, дату и время бронирования');
      return;
    }
    const sortedTimeslots = [...selectedTimeslots].sort((a, b) => a.id - b.id);
    const reservation = {
      name,
      phone,
      email,
      comment,
      timeslot_ids: selectedTimeslots.map((timeslot) => timeslot.id),
      total_price: calculateTotalPrice(selectedTimeslots),
      date: selectedDate.toISOString().split('T')[0],
      confirmed: false,
      table_num: selectedTable,
      reservationTime: `${sortedTimeslots[0].start_time} - ${
        sortedTimeslots[sortedTimeslots.length - 1].end_time
      }`,
      payment_method: paymentMethod,
    };
    if(isReservationExists(reservation, reservationsData)) { //проверяем не сделал ли кто нибудь бронь, пока делалась эта бронь
     
      // обнуляем выбранные таймслоты и актуализируем весь список.
      setSelectedTable(null);
          setSelectedTimeslots([]);
          setName('');
          setPhone('');
          setComment('');
          setPaymentMethod('');
          alert('Внимание!!!\nПроизошла ошибка при создании бронирования\nваша бронь не принята, кто-то уже забронировал это время,\nпока вы делали бронь.');
          loadReservations();
      return;
    }
    fetch(`${API_BASE_URL}/reservations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setSelectedTable(null);
          setSelectedTimeslots([]);
          setName('');
          setPhone('');
          setComment('');
          setPaymentMethod('');
          alert('Бронирование успешно создано!');
          loadReservations();
        } else {
          alert('Произошла ошибка при создании бронирования');
        }
      });
  };

  const deleteReservations = (reservationIds) => {
    reservationIds.forEach((reservationId) => {
      fetch(
        `${API_BASE_URL}/reservations/delete_reservation.php?id=${reservationId}`,
        {
          method: 'DELETE',
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            loadReservations();
          } else {
            alert('Произошла ошибка при удалении бронирования');
          }
        });
    });
  };

  const confirmReservations = (reservationIds) => {
    console.log('reservationIds', reservationIds)
    reservationIds.forEach((reservationId) => {
      console.log('reservationId', reservationId)
      fetch(
        `${API_BASE_URL}/reservations/confirm_reservation.php?id=${reservationId}`,
        {
          method: 'PUT',
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            loadReservations();
          } else {
            alert('Произошла ошибка при подтверждении бронирования');
          }
        });
    });
  };

  const isTimeslotSelected = (timeslot) =>
    selectedTimeslots.some((selectedSlot) => selectedSlot.id === timeslot.id);

    const isSlotConfirmed = (timeslot) =>
    reservations.some((reservation) => {
      const hasInReserv = reservation.timeslots.some(
        (slot) => slot.id === `${timeslot.id}`
      );
      const isDateMatch = reservation.date === selectedDate.toISOString().split('T')[0];
      return hasInReserv && reservation.confirmed === '1' && isDateMatch;
    });

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

  // Сортировка столов по возрастанию номера стола и времени начала

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
        console.log('Success');
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

  const calculateTotalPrice = (timeSlots) => {
    if (timeSlots.length === 0) {
      setHasSaleRate(false);
      return 0;
    }
    let totalPrice = 0;

    timeSlots.forEach((timeSlot) => {
      if (timeSlot.saleRate) {
        totalPrice += 150;
      } else {
        totalPrice += 200;
      }
    });
    return totalPrice; // Здесь добавлена недостающая строка
  };

  useEffect(() => {
    setPrice(() => {
      return calculateTotalPrice(selectedTimeslots);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeslots]);

  const handleLoadWeekdays = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/weekdays/index.php`);
      const weekdaysData = await response.json();
      setWeekdays(weekdaysData);
    } catch (error) {
      // Обработка ошибки запроса
    }
  };
  return (
    <div className="container">
      <ReservationTable />
      <h2 className="text-center m-2">
        Выберите дату, стол и время бронирования
      </h2>
      <Calendar
        locale="ru"
        onChange={handleDateChange}
        value={selectedDate}
        className="mx-auto m-3"
      />

      {!loading ? (
        <div className="row">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2mb-4 mt-2`}>
              <div className="card" onClick={() => handleSelectTable(table.id)}>
                <div className="card-body">
                  <h5 className="card-title d-flex justify-content-between m-0 align-items-center ">
                    <p className="m-0">{table.name} </p>
                    <Button
                      onClick={() => toggleOpen(table.id)}
                      aria-controls="collapse-text"
                      aria-expanded={open[table.id]}
                      className="float-right" // этот класс размещает кнопку справа
                    >
                      {open[table.id] ? 'скрыть −' : 'раскрыть +'}
                    </Button>
                  </h5>

                  <Collapse in={open[table.id]}>
                    <div id="collapse-text">
                      <div className="list-group mt-2">
                        {timeslots
                          .filter((timeslot) => timeslot.table_id === table.id) // фильтруем отображение слотов только для выбранного стола.
                          .filter((timeslot) => {
                            // фильтруем отображение слотов на сегодня, и по стальным фильтрам.
                            const comparisonDate = new Date();
                            const newDate = new Date(selectedDate);
                            const [hour, minutes] =
                              timeslot.start_time.split(':');
                            newDate.setHours(hour, minutes);
                            const notAvailable =
                              timeslot.notAvailable.includes(dayOfWeek);
                            return (
                              (window.isUserLoggedIn ||
                                newDate > comparisonDate) &&
                              !notAvailable
                            );
                          })
                          .map((timeslot) => {
                            const hour = timeslot.start_time.split(':')[0];
                            timeslot.saleRate =
                              limitHours[dayOfWeek].saleTimes.includes(hour);
                            return (
                              <li
                                key={timeslot.id}
                                className={`hover-el pointer list-group-item cursor-pointer ${
                                  timeslot.saleRate
                                    ? 'list-group-item-primary'
                                    : ''
                                } text-center ${
                                  isTimeslotSelected(timeslot) ? 'active' : ''
                                } ${
                                  isSlotOccupied(timeslot)
                                    ? 'list-group-item-dark'
                                    : ''
                                }`}
                                onClick={() => handleSelectTimeslot(timeslot)}
                                onDoubleClick={() =>
                                  handleSelectTimeslot(timeslot)
                                }>
                                {timeslot.start_time} - {timeslot.end_time}
                                {isSlotOccupied(timeslot)
                                  ? ` бронь ${
                                      isSlotConfirmed(timeslot)
                                        ? '(подтверждена)'
                                        : '(отправлена)'
                                    }`
                                  : ' Свободно'}
                              </li>
                            );
                          })}
                      </div>
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
        className="m-3 position-sticky fixed-bottom d-block w-50 mx-auto"
        onClick={handleShow}>
        Забронировать (Стоимость: {price} рублей)
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
                onChange={handleInputChange}>
                <option value="">Способ оплаты</option>
                <option value="Предоплата картой">Предоплата картой</option>
                <option value="Банковской картой в зале">
                  Банковской картой в зале
                </option>
                <option value="Наличными в зале">Наличными в зале</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-2 d-block mx-auto">
              Забронировать (Стоимость: {price} рублей)
            </button>
          </form>
        </Modal.Body>
      </Modal>
      {!loadingAuth ? (
        token ? (
          <>
            <h2>Управление бронированиями</h2>
            <BronControl
            areAllNotAvailable={areAllNotAvailable}
            handleSaveTimeslots={handleSaveTimeslots}
            />
            <div className="row">
              {reservations
                .filter((reservation) => {
                  const comparisonDate = new Date();
                  const newDate = new Date(reservation.date);
                  const hour = reservation.reservationTime.split(':')[0];
                  newDate.setHours(hour);
                  return newDate > comparisonDate;
                })
                .map((reservation) => (
                  <div className="col-md-3 mt-3" key={reservation.id}>
                    <ul className="list-group">
                      <li className="list-group-item">
                        <p className="h6">
                          Бронирование на: {reservation.date}
                        </p>
                        <div>
                          <p>Номер стола: {reservation.table_num}</p>
                          <p>Имя: {reservation.name}</p>
                          <p>Телефон: {reservation.phone}</p>
                          <p>Комментарий: {reservation.comment}</p>
                          <p>Время: {reservation.reservationTime}</p>
                          <p>Оплата: {reservation.payment_method}</p>
                          <p>Стоимость: {reservation.price} рублей</p>
                        </div>
                        <div>
                          <button
                            className="btn btn-danger m-2"
                            onClick={() =>
                              deleteReservations([reservation.id])
                            }>
                            Удалить
                          </button>
                          {reservation.confirmed === '1' ? null : (
                            <button
                              className="btn btn-success"
                              onClick={() =>
                                confirmReservations([reservation.id])
                              }>
                              Подтвердить
                            </button>
                          )}
                        </div>
                      </li>
                    </ul>
                  </div>
                ))}
            </div>
          </>
        ) : null
      ) : (
        'Loading...'
      )}
    </div>
  );
};

export default App;
