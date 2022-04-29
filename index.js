// triger ghi dữ liệu vào SQL
var insert_trigger = false; // Trigger
var old_insert_trigger = false; // Trigger old
// Mảng xuất dữ liệu report Excel
var SQL_Excel = []; // Dữ liệu nhập kho
// /////////////////////////++THIẾT LẬP KẾT NỐI WEB++/////////////////////////
var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

// Home calling
app.get("/", function (req, res) {
  res.render("layout", { screenurl: "./screen/main.ejs" });
});
// display calling
app.get("/display", function (req, res) {
  res.render("layout", { screenurl: "./screen/display.ejs" });
});
// system calling
app.get("/system", function (req, res) {
  res.render("layout", { screenurl: "./screen/system.ejs" });
});
// graph calling
app.get("/graph", function (req, res) {
  res.render("layout", { screenurl: "./screen/graph.ejs" });
});
// alarm calling
app.get("/alarm", function (req, res) {
  res.render("layout", { screenurl: "./screen/alarm.ejs" });
});
// alarm calling
app.get("/Dev_by_Hien_Phong_DH_SPKT_TPHCM", function (req, res) {
  res.send("SEE YOU AGAIN =)) CHO EM 10 NHA THAY");
});
//

// KHỞI TẠO KẾT NỐI PLC
var nodes7 = require("nodes7");
var conn_plc = new nodes7(); //PLC1
// Tạo địa chỉ kết nối (slot = 2 nếu là 300/400, slot = 1 nếu là 1200/1500)
// khi dùng PLC ảo thì IP là địa chỉ mạng, khi dùng PLC thật -IP là địa chỉ của PLC
conn_plc.initiateConnection({ port: 102, host: "192.168.1.176", rack: 0, slot: 1 }, PLC_connected);

// Bảng tag trong Visual studio code
var tags_list = {
  //tag dữ liệu Bool
  Start_Light: "DB6,X0.0",
  Emergency_Light: "DB6,X0.1",
  Auto_mode: "DB6,X0.2",
  Manual_mode: "DB6,X0.3",
  Bom_Light: "DB6,X0.4",
  Van_Light: "DB6,X0.5",
  Default_Light_1: "DB6,X0.6",
  Default_Light_2: "DB6,X0.7",
  Default_Light_3: "DB6,X1.0",
  Default_Light_4: "DB6,X1.1",
  Default_Light_5: "DB6,X1.2",
  Default_Light_6: "DB6,X1.3",
  Default_Light_7: "DB6,X1.4",
  Light_Main_Screen: "DB6,X1.5",
  Light_System_Screen: "DB6,X1.6",
  Light_Display_Screen: "DB6,X1.7",
  Light_Alarm_Screen: "DB6,X2.0",
  Solenoid_Valve: "DB6,X2.1",
  Stop_Light: "DB6,X2.2",
  btt_Start: "DB6,X2.3",
  btt_Stop: "DB6,X2.4",
  btt_Emergency: "DB6,X2.5",
  btt_Auto: "DB6,X2.6",
  btt_Manual: "DB6,X2.7",
  btt_on_Bom: "DB6,X3.0",
  btt_off_Bom: "DB6,X3.1",
  btt_on_Van: "DB6,X3.2",
  btt_off_Van: "DB6,X3.3",
  Bom_Light_off: "DB6,X3.4",
  Van_Light_off: "DB6,X3.5",
  btt_Reset: "DB6,X3.6",
  Reset_Light: "DB6,X3.7",
  // btt_Main:'DB6,X4.0',
  // btt_System:'DB6,X4.1',
  // btt_Display:'DB6,X4.2',
  // btt_Alarm:'DB6,X4.3',
  sql_insert_trigger: "DB6,X4.4",
  Bom_Light_Man: "DB6,X4.5",
  Van_Light_Man: "DB6,X4.6",
  //tag dữ liệu Real
  SP: "DB6,REAL6",
  PV: "DB6,REAL10",
  Level: "DB6,REAL14",
  KP: "DB6,REAL18",
  KI: "DB6,REAL22",
  KD: "DB6,REAL26",
  Flow: "DB6,REAL30",
  Pressure: "DB6,REAL34",
};

// GỬI DỮ LIỆu TAG CHO PLC
function PLC_connected(err) {
  if (typeof err !== "undefined") {
    console.log(err); // Hiển thị lỗi nếu không kết nối đƯỢc với PLC
  }
  conn_plc.setTranslationCB(function (tag) {
    return tags_list[tag];
  }); // Đưa giá trị đọc lên Web từ PLC và mảng
  conn_plc.addItems([
    "Start_Light",
    "Emergency_Light",
    "Auto_mode",
    "Manual_mode",
    "Bom_Light",
    "Van_Light",
    "Default_Light_1",
    "Default_Light_2",
    "Default_Light_3",
    "Default_Light_4",
    "Default_Light_5",
    "Default_Light_6",
    "Default_Light_7",
    "Light_Main_Screen",
    "Light_System_Screen",
    "Light_Display_Screen",
    "Light_Alarm_Screen",
    "Solenoid_Valve",
    "Stop_Light",
    "btt_Start",
    "btt_Stop",
    "btt_Emergency",
    "btt_Auto",
    "btt_Manual",
    "btt_on_Bom",
    "btt_off_Bom",
    "btt_on_Van",
    "btt_off_Van",
    "Bom_Light_off",
    "Van_Light_off",
    "btt_Reset",
    "Reset_Light",
    //   'btt_Main',
    //   'btt_System',
    //   'btt_Display',
    //   'btt_Alarm',
    "sql_insert_trigger",
    "Bom_Light_Man",
    "Van_Light_Man",
    "SP",
    "PV",
    "Level",
    "KP",
    "KI",
    "KD",
    "Flow",
    "Pressure",
  ]);
}

// Đọc dữ liệu từ PLC và đưa vào array tags
var arr_tag_value = []; // Tạo một mảng lưu giá trị tag đọc về
function valuesReady(anythingBad, values) {
  if (anythingBad) {
    console.log("Lỗi khi đọc dữ liệu tag");
  } // Cảnh báo lỗi
  var lodash = require("lodash"); // Chuyển variable sang array
  arr_tag_value = lodash.map(values, (item) => item);
  console.log(values); // Hiển thị giá trị để kiểm tra
}

// Hàm chức năng scan giá trị
function fn_read_data_scan() {
  conn_plc.readAllItems(valuesReady);
  fn_sql_insert();
}
// Time cập nhật mỗi 1s
setInterval(
  () => fn_read_data_scan(),
  1000 // 1s = 1000ms
);

////////////////LẬP BẢNG TAG ĐỂ GỬI QUA CLIENT (TRÌNH DUYỆT)///////////
function fn_tag() {
  io.sockets.emit("Start_Light", arr_tag_value[0]);
  io.sockets.emit("Emergency_Light", arr_tag_value[1]);
  io.sockets.emit("Auto_mode", arr_tag_value[2]);
  io.sockets.emit("Manual_mode", arr_tag_value[3]);
  io.sockets.emit("Bom_Light", arr_tag_value[4]);
  io.sockets.emit("Van_Light", arr_tag_value[5]);
  io.sockets.emit("Default_Light_1", arr_tag_value[6]);
  io.sockets.emit("Default_Light_2", arr_tag_value[7]);
  io.sockets.emit("Default_Light_3", arr_tag_value[8]);
  io.sockets.emit("Default_Light_4", arr_tag_value[9]);
  io.sockets.emit("Default_Light_5", arr_tag_value[10]);
  io.sockets.emit("Default_Light_6", arr_tag_value[11]);
  io.sockets.emit("Default_Light_7", arr_tag_value[12]);
  io.sockets.emit("Light_Main_Screen", arr_tag_value[13]);
  io.sockets.emit("Light_System_Screen", arr_tag_value[14]);
  io.sockets.emit("Light_Display_Screen", arr_tag_value[15]);
  io.sockets.emit("Light_Alarm_Screen", arr_tag_value[16]);
  io.sockets.emit("Solenoid_Valve", arr_tag_value[17]);
  io.sockets.emit("Stop_Light", arr_tag_value[18]);
  io.sockets.emit("btt_Start", arr_tag_value[19]);
  io.sockets.emit("btt_Stop", arr_tag_value[20]);
  io.sockets.emit("btt_Emergency", arr_tag_value[21]);
  io.sockets.emit("btt_Auto", arr_tag_value[22]);
  io.sockets.emit("btt_Manual", arr_tag_value[23]);
  io.sockets.emit("btt_on_Bom", arr_tag_value[24]);
  io.sockets.emit("btt_off_Bom", arr_tag_value[25]);
  io.sockets.emit("btt_on_Van", arr_tag_value[26]);
  io.sockets.emit("btt_off_Van", arr_tag_value[27]);
  io.sockets.emit("Bom_Light_off", arr_tag_value[28]);
  io.sockets.emit("Van_Light_off", arr_tag_value[29]);
  io.sockets.emit("btt_Reset", arr_tag_value[30]);
  io.sockets.emit("Reset_Light", arr_tag_value[31]);
  // io.sockets.emit("btt_Main", arr_tag_value[32]);
  // io.sockets.emit("btt_System", arr_tag_value[33]);
  // io.sockets.emit("btt_Display", arr_tag_value[34]);
  // io.sockets.emit("btt_Alarm", arr_tag_value[35]);
  io.sockets.emit("sql_insert_trigger", arr_tag_value[32]);
  io.sockets.emit("Bom_Light_Man", arr_tag_value[33]);
  io.sockets.emit("Van_Light_Man", arr_tag_value[34]);
  io.sockets.emit("SP", arr_tag_value[35]);
  io.sockets.emit("PV", arr_tag_value[36]);
  io.sockets.emit("Level", arr_tag_value[37]);
  io.sockets.emit("KP", arr_tag_value[38]);
  io.sockets.emit("KI", arr_tag_value[39]);
  io.sockets.emit("KD", arr_tag_value[40]);
  io.sockets.emit("Flow", arr_tag_value[41]);
  io.sockets.emit("Pressure", arr_tag_value[42]);
}

// /////////// GỬI DỮ LIỆU BẢNG TAG ĐẾN CLIENT (TRÌNH DUYỆT) ///////////////
io.on("connection", function (socket) {
  socket.on("Client-send-data", function (data) {
    fn_tag();
  });
  fn_SQLSearch(); // Hàm tìm kiếm SQL
  fn_SQLSearch_ByTime(); // Hàm tìm kiếm SQL theo thời gian
  fn_Require_ExcelExport(); // Nhận yêu cầu xuất Excel
});

// HÀM GHI DỮ LIỆU XUỐNG PLC
function valuesWritten(anythingBad) {
  if (anythingBad) {
    console.log("SOMETHING WENT WRONG WRITING VALUES!!!!");
  }
  console.log("Done writing.");
}

// Nhận các bức điện được gửi từ trình duyệt
io.on("connection", function (socket) {
  // NÚT START
  socket.on("cmd_START", function (data) {
    conn_plc.writeItems("btt_Start", data, valuesWritten);
  });
  // NÚT STOP
  socket.on("cmd_STOP", function (data) {
    conn_plc.writeItems("btt_Stop", data, valuesWritten);
  });
  // NÚT EMERGENCY
  socket.on("cmd_EMERGENCY", function (data) {
    conn_plc.writeItems("btt_Emergency", data, valuesWritten);
  });
  // NÚT RESET
  socket.on("cmd_RESET", function (data) {
    conn_plc.writeItems("btt_Reset", data, valuesWritten);
  });
  // NÚT AUTO
  socket.on("cmd_AUTO", function (data) {
    conn_plc.writeItems("btt_Auto", data, valuesWritten);
  });
  // NÚT MANUAL
  socket.on("cmd_MANUAL", function (data) {
    conn_plc.writeItems("btt_Manual", data, valuesWritten);
  });
  // NÚT ON BOM
  socket.on("cmd_ON_BOM", function (data) {
    conn_plc.writeItems("btt_on_Bom", data, valuesWritten);
  });
  // NÚT OFF BOM
  socket.on("cmd_OFF_BOM", function (data) {
    conn_plc.writeItems("btt_off_Bom", data, valuesWritten);
  });
  // NÚT ON VAN
  socket.on("cmd_ON_VAN", function (data) {
    conn_plc.writeItems("btt_on_Van", data, valuesWritten);
  });
  // NÚT OFF VAN
  socket.on("cmd_OFF_VAN", function (data) {
    conn_plc.writeItems("btt_off_Van", data, valuesWritten);
  });
  // Ghi dữ liệu từ IO field
  socket.on("cmd_Edit_Data", function (data) {
    conn_plc.writeItems(["SP"], [data[0]], valuesWritten);
  });
});

////////////////////////////////CƠ SỞ DỮ LIỆU SQL///////////////////////////
// Khởi tạo SQL
var mysql = require("mysql");

var sqlcon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "160400",
  database: "SQL_PLC",
  dateStrings: true, // Hiển thị không có T và Z
});

function fn_sql_insert() {
  insert_trigger = arr_tag_value[32]; // Read trigger from PLC
  var sqltable_Name = "plc_data";
  // Lấy thời gian hiện tại
  var tzoffset = new Date().getTimezoneOffset() * 60000; //Vùng Việt Nam (GMT7+)
  var temp_datenow = new Date();
  var timeNow = new Date(temp_datenow - tzoffset).toISOString().slice(0, -1).replace("T", " ");
  var timeNow_toSQL = "'" + timeNow + "',";

  // Dữ liệu đọc lên từ các tag
  var data_SP = "'" + arr_tag_value[35] + "',";
  var data_Level = "'" + arr_tag_value[37] + "',";
  var data_Flow = "'" + arr_tag_value[41] + "',";
  var data_Pressure = "'" + arr_tag_value[42] + "'";
  // var data_String = "'" + arr_tag_value[5] + "'";
  ////////// Ghi dữ liệu vào SQL///////////////
  if (insert_trigger && !old_insert_trigger) {
    var sql_write_str11 = "INSERT INTO " + sqltable_Name + " (date_time, SP, Level, Flow, Pressure) VALUES (";
    var sql_write_str12 = timeNow_toSQL + data_SP + data_Level + data_Flow + data_Pressure;
    var sql_write_str1 = sql_write_str11 + sql_write_str12 + ");";
    // Thực hiện ghi dữ liệu vào SQL
    sqlcon.query(sql_write_str1, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("SQL - Ghi dữ liệu thành công");
      }
    });
  }
  old_insert_trigger = insert_trigger;
}

// Đọc dữ liệu từ SQL
function fn_SQLSearch() {
  io.on("connection", function (socket) {
    socket.on("msg_SQL_Show", function (data) {
      var sqltable_Name = "plc_data";
      var queryy1 = "SELECT * FROM " + sqltable_Name + ";";
      sqlcon.query(queryy1, function (err, results, fields) {
        if (err) {
          console.log(err);
        } else {
          const objectifyRawPacket = (row) => ({ ...row });
          const convertedResponse = results.map(objectifyRawPacket);
          socket.emit("SQL_Show", convertedResponse);
          console.log(convertedResponse);
        }
      });
    });
  });
}

//////////////////////////// TRUY VẪN DỮ LIỆU THEO THỜI GIAN CỤ THỂ////////////////////////////
function fn_SQLSearch_ByTime() {
  io.on("connection", function (socket) {
    socket.on("msg_SQL_ByTime", function (data) {
      console.log(true);
      if (data && data.length === 2 && data[0] !== "" && data[1] !== "") {
        var tzoffset = new Date().getTimezoneOffset() * 60000; //offset time Việt Nam (GMT7+)
        // Lấy thời gian tìm kiếm từ date time piker
        var timeS = new Date(data[0]); // Thời gian bắt đầu
        var timeE = new Date(data[1]); // Thời gian kết thúc
        // Quy đổi thời gian ra định dạng cua MySQL
        var timeS1 = "'" + new Date(timeS - tzoffset).toISOString().slice(0, -1).replace("T", " ") + "'";
        var timeE1 = "'" + new Date(timeE - tzoffset).toISOString().slice(0, -1).replace("T", " ") + "'";
        var timeR = timeS1 + "AND" + timeE1; // Khoảng thời gian tìm kiếm (Time Range)

        var sqltable_Name = "plc_data"; // Tên bảng
        var dt_col_Name = "date_time"; // Tên cột thời gian

        var Query1 = "SELECT * FROM " + sqltable_Name + " WHERE " + dt_col_Name + " BETWEEN ";
        var Query = Query1 + timeR + ";";

        sqlcon.query(Query, function (err, results, fields) {
          if (err) {
            console.log(err);
          } else {
            const objectifyRawPacket = (row) => ({ ...row });
            const convertedResponse = results.map(objectifyRawPacket);
            SQL_Excel = convertedResponse; // Xuất báo cáo Excel
            socket.emit("SQL_ByTime", convertedResponse);
          }
        });
      } else {
        var Query = `SELECT * FROM sql_plc.plc_data ORDER BY date_time DESC LIMIT 1;`;
        
        console.log(Query);
        sqlcon.query(Query, function (err, results, fields) {
          if (err) {
            console.log(err);
          } else {
            const objectifyRawPacket = (row) => ({ ...row });
            const convertedResponse = results.map(objectifyRawPacket);
            SQL_Excel = convertedResponse; // Xuất báo cáo Excel
            socket.emit("SQL_ByTime", convertedResponse);
          }
        });
      }
    });
  });
}

// /////////////////////////////// XUẤT DỮ LIỆU EXCEL ///////////////////////////////
const Excel = require("exceljs");
const { CONNREFUSED } = require("dns");
function fn_excelExport() {
  // =====================CÁC THUỘC TÍNH CHUNG=====================
  // Lấy ngày tháng hiện tại
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  let day = date_ob.getDay();
  var dayName = "";
  if (day == 0) {
    dayName = "Chủ nhật,";
  } else if (day == 1) {
    dayName = "Thứ hai,";
  } else if (day == 2) {
    dayName = "Thứ ba,";
  } else if (day == 3) {
    dayName = "Thứ tư,";
  } else if (day == 4) {
    dayName = "Thứ năm,";
  } else if (day == 5) {
    dayName = "Thứ sáu,";
  } else if (day == 6) {
    dayName = "Thứ bảy,";
  } else {
  }
  // Tạo và khai báo Excel
  let workbook = new Excel.Workbook();
  let worksheet = workbook.addWorksheet("data", {
    pageSetup: { paperSize: 9, orientation: "landscape" },
    properties: { tabColor: { argb: "FFC0000" } },
  });
  // Page setup (cài đặt trang)
  worksheet.properties.defaultRowHeight = 20;
  worksheet.pageSetup.margins = {
    left: 0.3,
    right: 0.25,
    top: 0.75,
    bottom: 0.75,
    header: 0.3,
    footer: 0.3,
  };
  // =====================THẾT KẾ HEADER=====================
  // Logo KHOA ĐIỆN
  const imageId1 = workbook.addImage({
    filename: "public/images/FEEE.png",
    extension: "png",
  });
  worksheet.addImage(imageId1, "A1:B7");
  // Logo SPKT
  const imageId2 = workbook.addImage({
    filename: "public/images/SPKT2.png",
    extension: "png",
  });
  worksheet.addImage(imageId2, "C1:J7");
  // Logo AUTO
  const imageId3 = workbook.addImage({
    filename: "public/images/AUTO.png",
    extension: "png",
  });
  worksheet.addImage(imageId1, "K1:L7");

  worksheet.getCell("A9").value = "DATA";
  worksheet.mergeCells("A9:F9");
  worksheet.getCell("A9").style = { font: { name: "Times New Roman", bold: true, size: 16 }, alignment: { horizontal: "center", vertical: "middle" } };
  // Ngày in biểu
  worksheet.getCell("E11").value = "Ngày in biểu: " + dayName + date + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
  worksheet.getCell("F11").style = { font: { bold: false, italic: true }, alignment: { horizontal: "right", vertical: "bottom", wrapText: false } };

  // Tên nhãn các cột
  var rowpos = 12;
  var collumName = ["STT", "Thời gian", "SP", "Level", "FLOW", "PRESSURE"];
  worksheet.spliceRows(rowpos, 1, collumName);

  // =====================XUẤT DỮ LIỆU EXCEL SQL=====================
  // Dump all the data into Excel
  var rowIndex = 1;
  SQL_Excel.forEach((e, index) => {
    // row 1 is the header.
    rowIndex = index + rowpos;
    // worksheet1 collum
    worksheet.columns = [
      { key: "STT" },
      { key: "date_time" },
      { key: "SP" },
      { key: "Level" },
      { key: "Flow" },
      { key: "Presure" },
      //   {key: 'data_String'}
    ];
    worksheet.addRow({
      STT: {
        formula: index + 1,
      },
      ...e,
    });
  });
  // Lấy tổng số hàng
  const totalNumberOfRows = worksheet.rowCount;
  // Tính tổng
  worksheet.addRow([
    "Tổng cộng:",
    "",
    "",
    { formula: `=sum(C${rowpos + 1}:C${totalNumberOfRows})` },
    { formula: `=sum(D${rowpos + 1}:D${totalNumberOfRows})` },
    { formula: `=sum(E${rowpos + 1}:E${totalNumberOfRows})` },
    { formula: `=sum(F${rowpos + 1}:F${totalNumberOfRows})` },
  ]);
  // Style cho hàng total (Tổng cộng)
  worksheet.getCell(`A${totalNumberOfRows + 1}`).style = { font: { bold: true, size: 12 }, alignment: { horizontal: "center" } };
  // Tô màu cho hàng total (Tổng cộng)
  const total_row = ["A", "B", "C", "D", "E", "F"];
  total_row.forEach((v) => {
    worksheet.getCell(`${v}${totalNumberOfRows + 1}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "f2ff00" } };
  });

  // =====================STYLE CHO CÁC CỘT/HÀNG=====================
  // Style các cột nhãn
  const HeaderStyle = ["A", "B", "C", "D", "E", "F"];
  HeaderStyle.forEach((v) => {
    worksheet.getCell(`${v}${rowpos}`).style = { font: { bold: true }, alignment: { horizontal: "center", vertical: "middle", wrapText: true } };
    worksheet.getCell(`${v}${rowpos}`).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
  // Cài đặt độ rộng cột
  worksheet.columns.forEach((column, index) => {
    column.width = 15;
  });
  // Set width header
  // worksheet.getColumn(1).width = 12;
  // worksheet.getColumn(2).width = 20;
  // worksheet.getColumn(7).width = 30;
  // worksheet.getColumn(8).width = 30;

  // ++++++++++++Style cho các hàng dữ liệu++++++++++++
  worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
    var datastartrow = rowpos;
    var rowindex = rowNumber + datastartrow;
    const rowlength = datastartrow + SQL_Excel.length;
    if (rowindex >= rowlength + 1) {
      rowindex = rowlength + 1;
    }
    const insideColumns = ["A", "B", "C", "D", "E", "F"];
    // Tạo border
    insideColumns.forEach((v) => {
      // Border
      (worksheet.getCell(`${v}${rowindex}`).border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      }),
        // Alignment
        (worksheet.getCell(`${v}${rowindex}`).alignment = { horizontal: "center", vertical: "middle", wrapText: true });
    });
  });

  // =====================THỰC HIỆN XUẤT DỮ LIỆU EXCEL=====================
  // Export Link
  var currentTime = year + "_" + month + "_" + date + "_" + hours + "h" + minutes + "m" + seconds + "s";
  var saveasDirect = "Report/Report_" + currentTime + ".xlsx";
  SaveAslink = saveasDirect; // Send to client
  var booknameLink = "public/" + saveasDirect;

  var Bookname = "Report_" + currentTime + ".xlsx";
  // Write book name
  workbook.xlsx.writeFile(booknameLink);

  // Return
  return [SaveAslink, Bookname];
} // Đóng fn_excelExport

// =====================TRUYỀN NHẬN DỮ LIỆU VỚI TRÌNH DUYỆT=====================
// Hàm chức năng truyền nhận dữ liệu với trình duyệt
function fn_Require_ExcelExport() {
  io.on("connection", function (socket) {
    socket.on("msg_Excel_Report", function (data) {
      const [SaveAslink1, Bookname] = fn_excelExport();
      var data = [SaveAslink1, Bookname];
      socket.emit("send_Excel_Report", data);
    });
  });
}

// ++++++++++++++++++++++++++GHI DỮ LIỆU XUỐNG PLC+++++++++++++++++++++++++++
// MÀN HÌNH CHÍNH
// io.on("connection", function(socket)
// {
//     // Ghi dữ liệu từ IO field
//     socket.on("cmd_Main_Edit_Data", function(data){
//         conn_plc.writeItems([
//                             'tag_Bool', 'tag_Byte', 'tag_Integer', 'tag_Real', 'tag_String'],
//                             [data[0],data[1],data[2],data[3],data[4]
//                         ], valuesWritten);
//         });
// });

// MÀN HÌNH 1
// io.on("connection", function(socket)
// {
//     // Ghi dữ liệu từ IO field
//     socket.on("cmd_S1_Edit_Data", function(data){
//         conn_plc.writeItems([
//                             'tag_Byte', 'tag_Integer', 'tag_Real'],
//                             [data[0],data[1],data[2]
//                         ], valuesWritten);
//         });
// });

// MÀN HÌNH 2
// io.on("connection", function(socket)
// {
//     // Ghi dữ liệu từ IO field
//     socket.on("cmd_S2_Edit_Data", function(data){
//         conn_plc.writeItems([
//                             'tag_Real'],
//                             [data[0]
//                         ], valuesWritten);
//         });
// });
