import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
// eslint-disable-next-line no-unused-vars 
import styles from './styles.css';
import { tables, timeslots } from './data';
import { Form, Button, Collapse } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import ReservationTable from './components/ReservationTables';

const API_BASE_URL = '/api';

const limitHours = {
  Mon: {kidsTime: ['10', '11', '12'], limit: ['19', '20', '21'], saleTimes:['13','14','15']},
  Tue: {kidsTime: ['10', '11', '15', '16'], limit: [], saleTimes:['12','13','14']},
  Wed: {kidsTime: ['10', '11', '12'], limit: ['19', '20', '21'], saleTimes:['13','14','15']},
  Thu: {kidsTime: ['10', '11', '15', '16'], limit: ['19', '20', '21'], saleTimes:['12','13','14'] },
  Fri: {kidsTime: ['10', '11', '12'], limit: ['19', '20', '21'], saleTimes:['13','14','15']},
  Sat: {kidsTime:[], limit: ['10', '11','12', '13'], saleTimes:[]},
  Sun: {kidsTime:[], limit: [], saleTimes:[]},
}
const App = () => {
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
  const [dayOfWeek, setWeekDay] = useState(selectedDate.toDateString().split(' ')[0]);
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
  
  const toggleOpen = (id) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [id]: !prevOpen[id],
    }));
  };
  
  const loadReservations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/all_reservations.php`);
      const reservationsData = await response.json();
      // console.log('reservationsData', reservationsData);
      setReservations(reservationsData);      
      
    } catch (error) {
      setError(error.toString());
    }
  };


  useEffect(() => {
    loadReservations();
    handleLoadWeekdays();
    setLoading(false);
  }, []);

  const handleDateChange = (date) => {
    const originalDate = new Date(date);
    const GMT3Date = new Date(originalDate.getTime() + 3 * 60 * 60 * 1000);
    setSelectedDate(GMT3Date);
    setWeekDay(GMT3Date.toDateString().split(' ')[0]);
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
  const isSlotOccupied = (timeslot) => reservations.some(
    (reservation) =>
      reservation.date === selectedDate.toISOString().split('T')[0] &&
      reservation.timeslots.some((reservTimeslot) => reservTimeslot.id === timeslot.id.toString()))
    
  const handleSelectTimeslot = (timeslot) => {
    console.log('handleSelectTimeslot', timeslot);
    console.log('handleSelectTimeslot', selectedTimeslots);
    console.log('hasSaleRate', hasSaleRate);
    if(!hasSaleRate && timeslot.saleRate) {
      setHasSaleRate(true);
    }
    const diffTable = (timeslot) => selectedTimeslots.every((slot) => timeslot.table_id === slot.table_id);
    
    if (!diffTable(timeslot)) {
      setSelectedTimeslots([timeslot]); 
    }
    if (isSlotOccupied(timeslot)) {
      return;
    }

         if (selectedTimeslots.includes(timeslot)) {
        setSelectedTimeslots((prevTimeslots) => prevTimeslots.filter((slot) => slot.id < timeslot.id));
    } else {
      setSelectedTimeslots((prevTimeslots) => {
        if (isRange([...prevTimeslots, timeslot])) {
          // если слоты не идут по порядку, и есть пропуски то добавляем пропущеные слоты.
          return [...prevTimeslots, timeslot];
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
  
    const reservation = {
      name,
      phone,
      email,
      comment,
      timeslot_ids: selectedTimeslots.map((timeslot) => timeslot.id),
      total_price: calculateTotalPrice(selectedTimeslots),
      date: selectedDate.toISOString().split('T')[0],
      confirmed: false,
    };
  
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
      fetch(`${API_BASE_URL}/reservations/delete_reservation.php?id=${reservationId}`, {
        method: 'DELETE',
      })
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
    reservationIds.forEach((reservationId) => {
      fetch(`${API_BASE_URL}/reservations/confirm_reservation.php?id=${reservationId}`, {
        method: 'PUT',
      })
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
    console.log('weekdays', weekdays);
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
    if(timeSlots.length === 0) {
      setHasSaleRate(false);
      return 0;
    }
    let totalPrice = hasSaleRate ? 200 : 0;
    
    timeSlots.forEach((timeSlot) => {
      if (!timeSlot.saleRate) {
        totalPrice += 200;
      }
    });
  
    return totalPrice;
  };

  useEffect(() => {
    
    setPrice(() => {
      return calculateTotalPrice(selectedTimeslots)
    })
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
  
  console.log('reservations', reservations)
  return (
    <div className="container">
      <ReservationTable/>
      <h2  className="text-center m-2">Выберите дату, стол и время бронирования</h2>
      <Calendar onChange={handleDateChange} value={selectedDate} className="mx-auto m-3"/>
      
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
                                          const comparisonDate = new Date();
                                          const newDate = new Date(selectedDate);
                                          const [hour, minutes] = timeslot.start_time.split(':');
                                          newDate.setHours(hour, minutes);
                                          const limit = !(weekdays[dayOfWeek] && limitHours[dayOfWeek].limit.includes(hour));
                                          const kidsTime = !limitHours[dayOfWeek].kidsTime.includes(hour);
                                          return newDate > comparisonDate && limit && kidsTime
                                      })
                                      .map((timeslot) => {
                                        const hour = timeslot.start_time.split(':')[0];
                                        timeslot.saleRate = limitHours[dayOfWeek].saleTimes.includes(hour);
                                        return (
                                        <li
                                          key={timeslot.id}
                                          className={`list-group-item cursor-pointer ${timeslot.saleRate ? 'list-group-item-primary' : ''} text-center ${
                                              isTimeslotSelected(timeslot) ? 'active' : ''
                                          } ${isSlotOccupied(timeslot) ? 'list-group-item-dark' : ''}`}
                                          onClick={() => handleSelectTimeslot(timeslot)}
                                          >
                                          {timeslot.start_time.substring(0, timeslot.start_time.lastIndexOf(':'))} - {timeslot.end_time.substring(0, timeslot.end_time.lastIndexOf(':'))}
                                          {isSlotOccupied(timeslot) ? ` бронь ${isSlotConfirmed(timeslot) ? '(подтверждена)' : '(отправлена)'}` : ' Свободно'}
                                          </li>
                                      )}
                                  )}
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
              onChange={handleInputChange}
            >
              <option value="">Способ оплаты</option>
              <option value="card">Банковской картой в зале</option>
              <option value="cash">Наличными в зале</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary mt-2 d-block mx-auto">
          Забронировать (Стоимость: {price} рублей)
          </button>
          </form>
          </Modal.Body>
       </Modal>
    {window.isUserLoggedIn ? null : 
    ( <>
      <h2>Управление бронированиями</h2>
      <Form.Check
            type="switch"
            id="monladder-switch"
            label={weekdays.Mon ? 'Доступность бронирования на вечер понедельника отменена' : 'Доступность бронирования на вечер понедельника включена'}
            checked={weekdays.Mon}
            onChange={() => handleToggleWeekday('Mon')}
          />

          <Form.Check
            type="switch"
            id="wedladder-switch"
            label={weekdays.Wed ? 'Доступность бронирования на вечер среды отменена' : 'Доступность бронирования на вечер среды включена'}
            checked={weekdays.Wed}
            onChange={() => handleToggleWeekday('Wed')}
          />

          <Form.Check
            type="switch"
            id="thuT-switch"
            label={weekdays.Thu ? 'Доступность бронирования на вечер четверга отменена' : 'Доступность бронирования на вечер четверга включена'}
            checked={weekdays.Thu}
            onChange={() => handleToggleWeekday('Thu')}
          />

          <Form.Check
            type="switch"
            id="satT-switch"
            label={weekdays.Fri ? 'Доступность бронирования на вечер пятницы отменена' : 'Доступность бронирования на вечер пятницы включена'}
            checked={weekdays.Fri}
            onChange={() => handleToggleWeekday('Fri')}
          />

          <Form.Check
            type="switch"
            id="satT-switch"
            label={weekdays.Sat ? 'Доступность бронирования на день субботы отменена' : 'Доступность бронирования на день субботы включена'}
            checked={weekdays.Sat}
            onChange={() => handleToggleWeekday('Sat')}
          />
      
      <div className="row">
      {reservations.map((reservation) => (
        <div className="col-sm-6 col-md-6" key={reservation.id}>
          <p>Бронирование на дату: {reservation.date}</p>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <p>Имя: {reservation.name}</p>
                <p>Телефон: {reservation.phone}</p>
                <p>Комментарий: {reservation.comment}</p>
                <p>
                  Время: {reservation.timeslots[0].start_time} -{" "}
                  {reservation.timeslots[reservation.timeslots.length - 1].end_time}
                </p>
                <p>Стоимость: {reservation.price} рублей</p>
              </div>
              <div>
                <button
                  className="btn btn-danger m-2"
                  onClick={() => deleteReservations([reservation.id])}
                >
                  Удалить
                </button>
                {reservation.confirmed === "1" ? null : (
                  <button
                    className="btn btn-success"
                    onClick={() => confirmReservations([reservation.id])}
                  >
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
    )} 
    </div>
  );
};

export default App;