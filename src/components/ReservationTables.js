import React from 'react';
import { Container, Table } from 'react-bootstrap';

const ReservationTable = () => {
  return (
    <Container>
      <h2 className="text-center m-4">Расписание и стоимость аренды столов</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Дни недели</th>
            <th>Время</th>
            <th>Стоимость</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Понедельник - Пятница</td>
            <td>12:00 - 22:00</td>
            <td>400 рублей/час</td>
          </tr>
          <tr>
            <td>Суббота, Воскресенье</td>
            <td>10:00 - 20:00</td>
            <td>400 рублей/час</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default ReservationTable;