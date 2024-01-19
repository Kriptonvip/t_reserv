export const tables = [
    { id: 1, name: 'Стол 1' },
    { id: 2, name: 'Стол 2' },
    { id: 3, name: 'Стол 3' },
    { id: 4, name: 'Стол 4' },
    { id: 5, name: 'Стол 5' },
  ];

export const limitArrs = {
  Mon100_120: [[1,2,3,4],[25,26,27,28],[49,50,51,52],[73,74,75,76],
[97,98,99,100]],
  Mon150_163: [[11,12,13],[35,36,37],[59,60,61],[83,84,85],
[107,108,109]],
  Mon173_193: [[16,17,18,19],[40,41,42,43],[64,65,66,67],[88,89,90,91],
[112,113,114,115]],
  Mon193_220: [[20,21,22,23,24],[44,45,46,47,48],[68,69,70,71,72],[92,93,94,95,96],
[116,117,118,119,120]],
  Tue100_130: [[1,2,3,4,5,6],[25,26,27,28,29,30],[49,50,51,52,53,54],[73,74,75,76,77,78],
[97,98,99,100,101,102]],
  Tue150_163: [[11,12,13],[35,36,37],[59,60,61],[83,84,85],
[107,108,109]],
  Tue170_190: [[15,16,17,18],[39,40,41,42],[63,64,65,66],[87,88,89,90],
[111,112,113,114]],
  Tue193_220: [[20,21,22,23,24],[44,45,46,47,48],[68,69,70,71,72],[92,93,94,95,96],
[116,117,118,119,120]],
  Wed100_120: [[1,2,3,4],[25,26,27,28],[49,50,51,52],[73,74,75,76],
[97,98,99,100]],
  Wed150_163: [[11,12,13],[35,36,37],[59,60,61],[83,84,85],
[107,108,109]],
  Wed173_193: [[16,17,18,19],[40,41,42,43],[64,65,66,67],[88,89,90,91],
[112,113,114,115]],
  Wed193_220: [[20,21,22,23,24],[44,45,46,47,48],[68,69,70,71,72],[92,93,94,95,96],
[116,117,118,119,120]],
Thu100_130: [[1,2,3,4,5,6],[25,26,27,28,29,30],[49,50,51,52,53,54],[73,74,75,76,77,78],
[97,98,99,100,101,102]],
  Thu150_163: [[11,12,13],[35,36,37],[59,60,61],[83,84,85],
[107,108,109]],
  Thu170_190: [[15,16,17,18],[39,40,41,42],[63,64,65,66],[87,88,89,90],
[111,112,113,114]],
Thu193_220: [[20,21,22,23,24],[44,45,46,47,48],[68,69,70,71,72],[92,93,94,95,96],
[116,117,118,119,120]],
 Fri100_120: [[1,2,3,4],[25,26,27,28],[49,50,51,52],[73,74,75,76],
[97,98,99,100]],
  Fri150_163: [[11,12,13],[35,36,37],[59,60,61],[83,84,85],
[107,108,109]],
  Fri173_193: [[16,17,18,19],[40,41,42,43],[64,65,66,67],[88,89,90,91],
[112,113,114,115]],
  Fri193_220: [[20,21,22,23,24],[44,45,46,47,48],[68,69,70,71,72],[92,93,94,95,96],
[116,117,118,119,120]],
Sat100_143: [[1,2,3,4,5,6,7,8,9],[25,26,27,28,29,30,31,32,33],[49,50,51,52,53,54,55,56],[73,74,75,76,77,78,79,80],
[97,98,99,100,101,102,103,104]],
Sat143_180: [[10,11,12,13,14,15,16,],[34,35,36,37,38,39,40],[58,59,60,61,62,63,64],[82,83,84,85,86,87,88],
[106,107,108,109,110,111,112]],
Sat200_220: [[21,22,23,24],[45,46,47,48],[69,70,71,72],[93,94,95,96],
[117,118,119,120]],
Sun100_143: [[1,2,3,4,5,6,7,8,9],[25,26,27,28,29,30,31,32,33],[49,50,51,52,53,54,55,56],[73,74,75,76,77,78,79,80],
[97,98,99,100,101,102,103,104]],
Sun200_220: [[21,22,23,24],[45,46,47,48],[69,70,71,72],[93,94,95,96],
[117,118,119,120]],
}
  
export const limitHours = {
    Mon: {kidsTime: [], limit: ['19', '20', '21'], saleTimes:[]},
    Tue: {kidsTime: [], limit: ['19', '20', '21'], saleTimes:[]},
    Wed: {kidsTime: [], limit: ['19', '20', '21'], saleTimes:[]},
    Thu: {kidsTime: [], limit: ['19', '20', '21'], saleTimes:[]},
    Fri: {kidsTime: [], limit: ['19', '20', '21'], saleTimes:[]},
    Sat: {kidsTime: [], limit: ['10', '11','12', '13','14'], saleTimes:[]},
    Sun: {kidsTime: [], limit: ['10', '11','12', '13','14'], saleTimes:[]},
  }
  
  export const timeslotsData = [
    { id: 1, table_id: 1, start_time: '10:00', end_time: '10:30', saleRate: false, notAvailable: ''},
    { id: 2, table_id: 1, start_time: '10:30', end_time: '11:00', saleRate: false, notAvailable: ''},
    { id: 3, table_id: 1, start_time: '11:00', end_time: '11:30', saleRate: false, notAvailable: ''},
    { id: 4, table_id: 1, start_time: '11:30', end_time: '12:00', saleRate: false, notAvailable: ''},
    { id: 5, table_id: 1, start_time: '12:00', end_time: '12:30', saleRate: false, notAvailable: ''},
    { id: 6, table_id: 1, start_time: '12:30', end_time: '13:00', saleRate: false, notAvailable: ''},
    { id: 7, table_id: 1, start_time: '13:00', end_time: '13:30', saleRate: false, notAvailable: ''},
    { id: 8, table_id: 1, start_time: '13:30', end_time: '14:00', saleRate: false, notAvailable: ''},
    { id: 9, table_id: 1, start_time: '14:00', end_time: '14:30', saleRate: false, notAvailable: ''},
    { id: 10, table_id: 1, start_time: '14:30', end_time: '15:00', saleRate: false, notAvailable: ''},
    { id: 11, table_id: 1, start_time: '15:00', end_time: '15:30', saleRate: false, notAvailable: ''},
    { id: 12, table_id: 1, start_time: '15:30', end_time: '16:00', saleRate: false, notAvailable: ''},
    { id: 13, table_id: 1, start_time: '16:00', end_time: '16:30', saleRate: false, notAvailable: ''},
    { id: 14, table_id: 1, start_time: '16:30', end_time: '17:00', saleRate: false, notAvailable: ''},
    { id: 15, table_id: 1, start_time: '17:00', end_time: '17:30', saleRate: false, notAvailable: ''},
    { id: 16, table_id: 1, start_time: '17:30', end_time: '18:00', saleRate: false, notAvailable: ''},
    { id: 17, table_id: 1, start_time: '18:00', end_time: '18:30', saleRate: false, notAvailable: ''},
    { id: 18, table_id: 1, start_time: '18:30', end_time: '19:00', saleRate: false, notAvailable: ''},
    { id: 19, table_id: 1, start_time: '19:00', end_time: '19:30', saleRate: false, notAvailable: ''},
    { id: 20, table_id: 1, start_time: '19:30', end_time: '20:00', saleRate: false, notAvailable: ''},
    { id: 21, table_id: 1, start_time: '20:00', end_time: '20:30', saleRate: false, notAvailable: ''},
    { id: 22, table_id: 1, start_time: '20:30', end_time: '21:00', saleRate: false, notAvailable: ''},
    { id: 23, table_id: 1, start_time: '21:00', end_time: '21:30', saleRate: false, notAvailable: ''},
    { id: 24, table_id: 1, start_time: '21:30', end_time: '22:00', saleRate: false, notAvailable: ''},
    { id: 25, table_id: 2, start_time: '10:00', end_time: '10:30', saleRate: false, notAvailable: ''},
    { id: 26, table_id: 2, start_time: '10:30', end_time: '11:00', saleRate: false, notAvailable: ''},
    { id: 27, table_id: 2, start_time: '11:00', end_time: '11:30', saleRate: false, notAvailable: ''},
    { id: 28, table_id: 2, start_time: '11:30', end_time: '12:00', saleRate: false, notAvailable: ''},
    { id: 29, table_id: 2, start_time: '12:00', end_time: '12:30', saleRate: false, notAvailable: ''},
    { id: 30, table_id: 2, start_time: '12:30', end_time: '13:00', saleRate: false, notAvailable: ''},
    { id: 31, table_id: 2, start_time: '13:00', end_time: '13:30', saleRate: false, notAvailable: ''},
    { id: 32, table_id: 2, start_time: '13:30', end_time: '14:00', saleRate: false, notAvailable: ''},
    { id: 33, table_id: 2, start_time: '14:00', end_time: '14:30', saleRate: false, notAvailable: ''},
    { id: 34, table_id: 2, start_time: '14:30', end_time: '15:00', saleRate: false, notAvailable: ''},
    { id: 35, table_id: 2, start_time: '15:00', end_time: '15:30', saleRate: false, notAvailable: ''},
    { id: 36, table_id: 2, start_time: '15:30', end_time: '16:00', saleRate: false, notAvailable: ''},
    { id: 37, table_id: 2, start_time: '16:00', end_time: '16:30', saleRate: false, notAvailable: ''},
    { id: 38, table_id: 2, start_time: '16:30', end_time: '17:00', saleRate: false, notAvailable: ''},
    { id: 39, table_id: 2, start_time: '17:00', end_time: '17:30', saleRate: false, notAvailable: ''},
    { id: 40, table_id: 2, start_time: '17:30', end_time: '18:00', saleRate: false, notAvailable: ''},
    { id: 41, table_id: 2, start_time: '18:00', end_time: '18:30', saleRate: false, notAvailable: ''},
    { id: 42, table_id: 2, start_time: '18:30', end_time: '19:00', saleRate: false, notAvailable: ''},
    { id: 43, table_id: 2, start_time: '19:00', end_time: '19:30', saleRate: false, notAvailable: ''},
    { id: 44, table_id: 2, start_time: '19:30', end_time: '20:00', saleRate: false, notAvailable: ''},
    { id: 45, table_id: 2, start_time: '20:00', end_time: '20:30', saleRate: false, notAvailable: ''},
    { id: 46, table_id: 2, start_time: '20:30', end_time: '21:00', saleRate: false, notAvailable: ''},
    { id: 47, table_id: 2, start_time: '21:00', end_time: '21:30', saleRate: false, notAvailable: ''},
    { id: 48, table_id: 2, start_time: '21:30', end_time: '22:00', saleRate: false, notAvailable: ''},
    { id: 49, table_id: 3, start_time: '10:00', end_time: '10:30', saleRate: false, notAvailable: ''},
    { id: 50, table_id: 3, start_time: '10:30', end_time: '11:00', saleRate: false, notAvailable: ''},
    { id: 51, table_id: 3, start_time: '11:00', end_time: '11:30', saleRate: false, notAvailable: ''},
    { id: 52, table_id: 3, start_time: '11:30', end_time: '12:00', saleRate: false, notAvailable: ''},
    { id: 53, table_id: 3, start_time: '12:00', end_time: '12:30', saleRate: false, notAvailable: ''},
    { id: 54, table_id: 3, start_time: '12:30', end_time: '13:00', saleRate: false, notAvailable: ''},
    { id: 55, table_id: 3, start_time: '13:00', end_time: '13:30', saleRate: false, notAvailable: ''},
    { id: 56, table_id: 3, start_time: '13:30', end_time: '14:00', saleRate: false, notAvailable: ''},
    { id: 57, table_id: 3, start_time: '14:00', end_time: '14:30', saleRate: false, notAvailable: ''},
    { id: 58, table_id: 3, start_time: '14:30', end_time: '15:00', saleRate: false, notAvailable: ''},
    { id: 59, table_id: 3, start_time: '15:00', end_time: '15:30', saleRate: false, notAvailable: ''},
    { id: 60, table_id: 3, start_time: '15:30', end_time: '16:00', saleRate: false, notAvailable: ''},
    { id: 61, table_id: 3, start_time: '16:00', end_time: '16:30', saleRate: false, notAvailable: ''},
    { id: 62, table_id: 3, start_time: '16:30', end_time: '17:00', saleRate: false, notAvailable: ''},
    { id: 63, table_id: 3, start_time: '17:00', end_time: '17:30', saleRate: false, notAvailable: ''},
    { id: 64, table_id: 3, start_time: '17:30', end_time: '18:00', saleRate: false, notAvailable: ''},
    { id: 65, table_id: 3, start_time: '18:00', end_time: '18:30', saleRate: false, notAvailable: ''},
    { id: 66, table_id: 3, start_time: '18:30', end_time: '19:00', saleRate: false, notAvailable: ''},
    { id: 67, table_id: 3, start_time: '19:00', end_time: '19:30', saleRate: false, notAvailable: ''},
    { id: 68, table_id: 3, start_time: '19:30', end_time: '20:00', saleRate: false, notAvailable: ''},
    { id: 69, table_id: 3, start_time: '20:00', end_time: '20:30', saleRate: false, notAvailable: ''},
    { id: 70, table_id: 3, start_time: '20:30', end_time: '21:00', saleRate: false, notAvailable: ''},
    { id: 71, table_id: 3, start_time: '21:00', end_time: '21:30', saleRate: false, notAvailable: ''},
    { id: 72, table_id: 3, start_time: '21:30', end_time: '22:00', saleRate: false, notAvailable: ''},
    { id: 73, table_id: 4, start_time: '10:00', end_time: '10:30', saleRate: false, notAvailable: ''},
    { id: 74, table_id: 4, start_time: '10:30', end_time: '11:00', saleRate: false, notAvailable: ''},
    { id: 75, table_id: 4, start_time: '11:00', end_time: '11:30', saleRate: false, notAvailable: ''},
    { id: 76, table_id: 4, start_time: '11:30', end_time: '12:00', saleRate: false, notAvailable: ''},
    { id: 77, table_id: 4, start_time: '12:00', end_time: '12:30', saleRate: false, notAvailable: ''},
    { id: 78, table_id: 4, start_time: '12:30', end_time: '13:00', saleRate: false, notAvailable: ''},
    { id: 79, table_id: 4, start_time: '13:00', end_time: '13:30', saleRate: false, notAvailable: ''},
    { id: 80, table_id: 4, start_time: '13:30', end_time: '14:00', saleRate: false, notAvailable: ''},
    { id: 81, table_id: 4, start_time: '14:00', end_time: '14:30', saleRate: false, notAvailable: ''},
    { id: 82, table_id: 4, start_time: '14:30', end_time: '15:00', saleRate: false, notAvailable: ''},
    { id: 83, table_id: 4, start_time: '15:00', end_time: '15:30', saleRate: false, notAvailable: ''},
    { id: 84, table_id: 4, start_time: '15:30', end_time: '16:00', saleRate: false, notAvailable: ''},
    { id: 85, table_id: 4, start_time: '16:00', end_time: '16:30', saleRate: false, notAvailable: ''},
    { id: 86, table_id: 4, start_time: '16:30', end_time: '17:00', saleRate: false, notAvailable: ''},
    { id: 87, table_id: 4, start_time: '17:00', end_time: '17:30', saleRate: false, notAvailable: ''},
    { id: 88, table_id: 4, start_time: '17:30', end_time: '18:00', saleRate: false, notAvailable: ''},
    { id: 89, table_id: 4, start_time: '18:00', end_time: '18:30', saleRate: false, notAvailable: ''},
    { id: 90, table_id: 4, start_time: '18:30', end_time: '19:00', saleRate: false, notAvailable: ''},
    { id: 91, table_id: 4, start_time: '19:00', end_time: '19:30', saleRate: false, notAvailable: ''},
    { id: 92, table_id: 4, start_time: '19:30', end_time: '20:00', saleRate: false, notAvailable: ''},
    { id: 93, table_id: 4, start_time: '20:00', end_time: '20:30', saleRate: false, notAvailable: ''},
    { id: 94, table_id: 4, start_time: '20:30', end_time: '21:00', saleRate: false, notAvailable: ''},
    { id: 95, table_id: 4, start_time: '21:00', end_time: '21:30', saleRate: false, notAvailable: ''},
    { id: 96, table_id: 4, start_time: '21:30', end_time: '22:00', saleRate: false, notAvailable: ''},
    { id: 97, table_id: 5, start_time: '10:00', end_time: '10:30', saleRate: false, notAvailable: ''},
    { id: 98, table_id: 5, start_time: '10:30', end_time: '11:00', saleRate: false, notAvailable: ''},
    { id: 99, table_id: 5, start_time: '11:00', end_time: '11:30', saleRate: false, notAvailable: ''},
    { id: 100, table_id: 5, start_time: '11:30', end_time: '12:00', saleRate: false, notAvailable: ''},
    { id: 101, table_id: 5, start_time: '12:00', end_time: '12:30', saleRate: false, notAvailable: ''},
    { id: 102, table_id: 5, start_time: '12:30', end_time: '13:00', saleRate: false, notAvailable: ''},
    { id: 103, table_id: 5, start_time: '13:00', end_time: '13:30', saleRate: false, notAvailable: ''},
    { id: 104, table_id: 5, start_time: '13:30', end_time: '14:00', saleRate: false, notAvailable: ''},
    { id: 105, table_id: 5, start_time: '14:00', end_time: '14:30', saleRate: false, notAvailable: ''},
    { id: 106, table_id: 5, start_time: '14:30', end_time: '15:00', saleRate: false, notAvailable: ''},
    { id: 107, table_id: 5, start_time: '15:00', end_time: '15:30', saleRate: false, notAvailable: ''},
    { id: 108, table_id: 5, start_time: '15:30', end_time: '16:00', saleRate: false, notAvailable: ''},
    { id: 109, table_id: 5, start_time: '16:00', end_time: '16:30', saleRate: false, notAvailable: ''},
    { id: 110, table_id: 5, start_time: '16:30', end_time: '17:00', saleRate: false, notAvailable: ''},
    { id: 111, table_id: 5, start_time: '17:00', end_time: '17:30', saleRate: false, notAvailable: ''},
    { id: 112, table_id: 5, start_time: '17:30', end_time: '18:00', saleRate: false, notAvailable: ''},
    { id: 113, table_id: 5, start_time: '18:00', end_time: '18:30', saleRate: false, notAvailable: ''},
    { id: 114, table_id: 5, start_time: '18:30', end_time: '19:00', saleRate: false, notAvailable: ''},
    { id: 115, table_id: 5, start_time: '19:00', end_time: '19:30', saleRate: false, notAvailable: ''},
    { id: 116, table_id: 5, start_time: '19:30', end_time: '20:00', saleRate: false, notAvailable: ''},
    { id: 117, table_id: 5, start_time: '20:00', end_time: '20:30', saleRate: false, notAvailable: ''},
    { id: 118, table_id: 5, start_time: '20:30', end_time: '21:00', saleRate: false, notAvailable: ''},
    { id: 119, table_id: 5, start_time: '21:00', end_time: '21:30', saleRate: false, notAvailable: ''},
    { id: 120, table_id: 5, start_time: '21:30', end_time: '22:00', saleRate: false, notAvailable: ''},
  ];