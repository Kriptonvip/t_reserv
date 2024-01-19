import React from 'react';
import { Form } from 'react-bootstrap';
import { limitArrs } from '../data';

const BronControl = ({ areAllNotAvailable, handleSaveTimeslots }) => {
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const timeRanges = {
    Mon: [
      { label: 'Дети c 10:00 до 12:00', key: 'Mon100_120' },
      { label: 'Дети c 15:00 до 16:30', key: 'Mon150_163' },
      { label: 'Дети c 17:30 до 19:30', key: 'Mon173_193' },
      { label: 'Понедельник лесенка c 19:30 до 22:00', key: 'Mon193_220' },
    ],
    Tue: [
      { label: 'Вторник c 10:00 до 13:00', key: 'Tue100_130' },
      { label: 'Дети c 15:00 до 16:30', key: 'Tue150_163' },
      { label: 'Дети c 17:00 до 19:00', key: 'Tue170_190' },
      { label: 'Вторник лесенка c 19:30 до 22:00', key: 'Tue193_220' },
    ],
    Wed: [
      { label: 'Дети c 10:00 до 12:00', key: 'Wed100_120' },
      { label: 'Дети c 15:00 до 16:30', key: 'Wed150_163' },
      { label: 'Дети c 17:30 до 19:30', key: 'Wed173_193' },
      { label: 'Среда лесенка c 19:30 до 22:00', key: 'Wed193_220' },
    ],
    Thu: [
      { label: 'Четверг c 10:00 до 13:00', key: 'Thu100_130' },
      { label: 'Дети c 15:00 до 16:30', key: 'Thu150_163' },
      { label: 'Дети c 17:00 до 19:00', key: 'Thu170_190' },
      { label: 'Четверг c 19:30 до 22:00', key: 'Thu193_220' },
    ],
    Fri: [
      { label: 'Дети c 10:00 до 12:00', key: 'Fri100_120' },
      { label: 'Дети c 15:00 до 16:30', key: 'Fri150_163' },
      { label: 'Дети c 17:30 до 19:30', key: 'Fri173_193' },
      { label: 'Пятница лесенка c 19:30 до 22:00', key: 'Fri193_220' },
    ],
    Sat: [
      { label: 'Суббота Турнир c 10:00 до 14:30', key: 'Sat100_143' },
      { label: 'Турнир c 14:30 до 18:00', key: 'Sat143_180' },
      { label: 'Вечер c 20:00 до 22:00', key: 'Sat200_220' },
    ],
    Sun: [
      { label: 'Ком Турнир c 10:00 до 14:30', key: 'Sun100_143' },
      { label: 'Вечер c 20:00 до 22:00', key: 'Sun200_220' },
    ],
  };

  return (
    <>
      {weekdays.map((day, index) => (
        <>
          <h3 key={index}>Ограничения в {day}</h3>
          {timeRanges[day].map((timeRange) => (
            <>
              <Form.Check
                inline
                label={timeRange.label}
                type="checkbox"
                checked={areAllNotAvailable(limitArrs[timeRange.key].flat(), day)}
                onChange={() => handleSaveTimeslots(limitArrs[timeRange.key].flat(), day)}
              />
              {['checkbox'].map((type) => (
                <div key={`inline-${type}`} className="mb-3">
                  {limitArrs[timeRange.key].map((table, index) => (
                    <Form.Check
                      inline
                      label={index + 1}
                      checked={areAllNotAvailable(table, day)}
                      type={type}
                      onChange={() => handleSaveTimeslots(table, day)}
                    />
                  ))}
                </div>
              ))}
            </>
          ))}
        </>
      ))}
    </>
  );
};

export default BronControl;