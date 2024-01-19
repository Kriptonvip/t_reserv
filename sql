sql 

CREATE TABLE timeslots (
    id INT PRIMARY KEY,
    table_id INT,
    start_time VARCHAR(255),
    end_time VARCHAR(255),
    saleRate BOOLEAN,
    notAvailable BOOLEAN
);

INSERT INTO timeslots (id, table_id, start_time, end_time, saleRate, notAvailable) VALUES
(1,1, '10:00', '10:30', FALSE, TRUE),
(2,1, '10:30', '11:00', FALSE, TRUE),
(3,1, '11:00', '11:30', FALSE, TRUE),
(4,1, '11:30', '12:00', FALSE, TRUE),
(5,1, '12:00', '12:30', FALSE, FALSE),
(6,1, '12:30', '13:00', FALSE, FALSE),
(7,1, '13:00', '13:30', FALSE, FALSE),
(8,1, '13:30', '14:00', FALSE, FALSE),
(9,1, '14:00', '14:30', FALSE, FALSE),
(10,1, '14:30', '15:00', FALSE, FALSE),
(11,1, '15:00', '15:30', FALSE, FALSE),
(12,1, '15:30', '16:00', FALSE, FALSE),
(13,1, '16:00', '16:30', FALSE, FALSE),
(14,1, '16:30', '17:00', FALSE, FALSE),
(15,1, '17:00', '17:30', FALSE, FALSE),
(16,1, '17:30', '18:00', FALSE, FALSE),
(17,1, '18:00', '18:30', FALSE, FALSE),
(18,1, '18:30', '19:00', FALSE, FALSE),
(19,1, '19:00', '19:30', FALSE, FALSE),
(20,1, '19:30', '20:00', FALSE, FALSE),
(21,1, '20:00', '20:30', FALSE, FALSE),
(22,1, '20:30', '21:00', FALSE, FALSE),
(23,1, '21:00', '21:30', FALSE, FALSE),
(24,1, '21:30', '22:00', FALSE, FALSE),
(25,2, '10:00', '10:30', FALSE, TRUE),
(26,2, '10:30', '11:00', FALSE, TRUE),
(27,2, '11:00', '11:30', FALSE, TRUE),
(28,2, '11:30', '12:00', FALSE, TRUE),
(29,2, '12:00', '12:30', FALSE, FALSE),
(30,2, '12:30', '13:00', FALSE, FALSE),
(31,2, '13:00', '13:30', FALSE, FALSE),
(32,2, '13:30', '14:00', FALSE, FALSE),
(33,2, '14:00', '14:30', FALSE, FALSE),
(34,2, '14:30', '15:00', FALSE, FALSE),
(35,2, '15:00', '15:30', FALSE, FALSE),
(36,2, '15:30', '16:00', FALSE, FALSE),
(37,2, '16:00', '16:30', FALSE, FALSE),
(38,2, '16:30', '17:00', FALSE, FALSE),
(39,2, '17:00', '17:30', FALSE, FALSE),
(40,2, '17:30', '18:00', FALSE, FALSE),
(41,2, '18:00', '18:30', FALSE, FALSE),
(42,2, '18:30', '19:00', FALSE, FALSE),
(43,2, '19:00', '19:30', FALSE, FALSE),
(44,2, '19:30', '20:00', FALSE, FALSE),
(45,2, '20:00', '20:30', FALSE, FALSE),
(46,2, '20:30', '21:00', FALSE, FALSE),
(47,2, '21:00', '21:30', FALSE, FALSE),
(48,2, '21:30', '22:00', FALSE, FALSE),
(49,3, '10:00', '10:30', FALSE, TRUE),
(50,3, '10:30', '11:00', FALSE, TRUE),
(51,3, '11:00', '11:30', FALSE, TRUE),
(52,3, '11:30', '12:00', FALSE, TRUE),
(53,3, '12:00', '12:30', FALSE, FALSE),
(54,3, '12:30', '13:00', FALSE, FALSE),
(55,3, '13:00', '13:30', FALSE, FALSE),
(56,3, '13:30', '14:00', FALSE, FALSE),
(57,3, '14:00', '14:30', FALSE, FALSE),
(58,3, '14:30', '15:00', FALSE, FALSE),
(59,3, '15:00', '15:30', FALSE, FALSE),
(60,3, '15:30', '16:00', FALSE, FALSE),
(61,3, '16:00', '16:30', FALSE, FALSE),
(62,3, '16:30', '17:00', FALSE, FALSE),
(63,3, '17:00', '17:30', FALSE, FALSE),
(64,3, '17:30', '18:00', FALSE, FALSE),
(65,3, '18:00', '18:30', FALSE, FALSE),
(66,3, '18:30', '19:00', FALSE, FALSE),
(67,3, '19:00', '19:30', FALSE, FALSE),
(68,3, '19:30', '20:00', FALSE, FALSE),
(69,3, '20:00', '20:30', FALSE, FALSE),
(70,3, '20:30', '21:00', FALSE, FALSE),
(71,3, '21:00', '21:30', FALSE, FALSE),
(72,3, '21:30', '22:00', FALSE, FALSE),
(73,4, '10:00', '10:30', FALSE, TRUE),
(74,4, '10:30', '11:00', FALSE, TRUE),
(75,4, '11:00', '11:30', FALSE, TRUE),
(76,4, '11:30', '12:00', FALSE, TRUE),
(77,4, '12:00', '12:30', FALSE, FALSE),
(78,4, '12:30', '13:00', FALSE, FALSE),
(79,4, '13:00', '13:30', FALSE, FALSE),
(80,4, '13:30', '14:00', FALSE, FALSE),
(81,4, '14:00', '14:30', FALSE, FALSE),
(82,4, '14:30', '15:00', FALSE, FALSE),
(83,4, '15:00', '15:30', FALSE, FALSE),
(84,4, '15:30', '16:00', FALSE, FALSE),
(85,4, '16:00', '16:30', FALSE, FALSE),
(86,4, '16:30', '17:00', FALSE, FALSE),
(87,4, '17:00', '17:30', FALSE, FALSE),
(88,4, '17:30', '18:00', FALSE, FALSE),
(89,4, '18:00', '18:30', FALSE, FALSE),
(90,4, '18:30', '19:00', FALSE, FALSE),
(91,4, '19:00', '19:30', FALSE, FALSE),
(92,4, '19:30', '20:00', FALSE, FALSE),
(93,4, '20:00', '20:30', FALSE, FALSE),
(94,4, '20:30', '21:00', FALSE, FALSE),
(95,4, '21:00', '21:30', FALSE, FALSE),
(96,4, '21:30', '22:00', FALSE, FALSE),
(97,5, '10:00', '10:30', FALSE, TRUE),
(98,5, '10:30', '11:00', FALSE, TRUE),
(99,5, '11:00', '11:30', FALSE, TRUE),
(100,5, '11:30', '12:00', FALSE, TRUE),
(101,5, '12:00', '12:30', FALSE, FALSE),
(102,5, '12:30', '13:00', FALSE, FALSE),
(103,5, '13:00', '13:30', FALSE, FALSE),
(104,5, '13:30', '14:00', FALSE, FALSE),
(105,5, '14:00', '14:30', FALSE, FALSE),
(106,5, '14:30', '15:00', FALSE, FALSE),
(107,5, '15:00', '15:30', FALSE, FALSE),
(108,5, '15:30', '16:00', FALSE, FALSE),
(109,5, '16:00', '16:30', FALSE, FALSE),
(110,5, '16:30', '17:00', FALSE, FALSE),
(111,5, '17:00', '17:30', FALSE, FALSE),
(112,5, '17:30', '18:00', FALSE, FALSE),
(113,5, '18:00', '18:30', FALSE, FALSE),
(114,5, '18:30', '19:00', FALSE, FALSE),
(115,5, '19:00', '19:30', FALSE, FALSE),
(116,5, '19:30', '20:00', FALSE, FALSE),
(117,5, '20:00', '20:30', FALSE, FALSE),
(118,5, '20:30', '21:00', FALSE, FALSE),
(119,5, '21:00', '21:30', FALSE, FALSE),
(120,5, '21:30', '22:00', FALSE, FALSE);

    CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    comment TEXT,
    payment_method VARCHAR(255) NOT NULL,
    timeslot_id INT NOT NULL,
    table_id INT NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY(timeslot_id) REFERENCES timeslots(id),
    FOREIGN KEY(table_id) REFERENCES tables(id)
);

 