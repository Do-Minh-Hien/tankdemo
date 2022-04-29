// Chương trình con đọc dữ liệu SQL
function fn_Table01_SQL_Show(){
    socket.emit("msg_SQL_Show", "true");
    socket.on('SQL_Show',function(data){
        fn_table_01(data);
    }); 
}
 
// Chương trình con hiển thị SQL ra bảng
function fn_table_01(data){
    if(data){
        $("#table_01 tbody").empty(); 
        var len = data.length;
        var txt = "<tbody>";
        if(len > 0){
            for(var i=0;i<len;i++){
                    txt += "<tr><td>"+data[i].date_time
                        +"</td><td>"+data[i].SP
                        +"</td><td>"+data[i].Level
                        +"</td><td>"+data[i].Flow
                        +"</td><td>"+data[i].Pressure
                        // +"</td><td>"+data[i].data_String
                        +"</td></tr>";
                    }
            if(txt != ""){
            txt +="</tbody>"; 
            $("#table_01").append(txt);
            }
        }
    }   
}

///// CHƯƠNG TRÌNH CON NÚT NHẤN SỬA //////
// Tạo 1 tag tạm báo đang sửa dữ liệu
var Display_data_edditting = false;    // Khi tag này lên "true" thì dừng đọc dữ liệu từ PLC lên để có thể ghi dữ liệu
function fn_Display_EditBtt(){
    // Cho hiển thị nút nhấn lưu
    fn_DataEdit('btt_Display_Save','btt_Display_Edit');
    // Cho tag báo đang sửa dữ liệu lên giá trị true
    Display_data_edditting = true; 
    // Kích hoạt chức năng sửa của các IO Field
    document.getElementById("setpoint").disabled = false; // Tag bool
    // document.getElementById("Byte").disabled = false; // Tag Byte
    // document.getElementById("Integer").disabled = false; // Tag Integer
    // document.getElementById("Real").disabled = false; // Tag Real
    // document.getElementById("String").disabled = false; // Tag String 
}
///// CHƯƠNG TRÌNH CON NÚT NHẤN LƯU //////
function fn_Display_SaveBtt(){
// Cho hiển thị nút nhấn sửa
fn_DataEdit('btt_Display_Edit','btt_Display_Save');
    // Cho tag đang sửa dữ liệu về 0
    Display_data_edditting = false; 
                        // Gửi dữ liệu cần sửa xuống PLC
    var data_edit_array = [document.getElementById('setpoint').value];
    socket.emit('cmd_Edit_Data', data_edit_array);
    alert('Dữ liệu đã được lưu!');
    // Vô hiệu hoá chức năng sửa của các IO Field
    document.getElementById("setpoint").disabled = true;    // Tag bool
    // document.getElementById("Byte").disabled = true;    // Tag Byte
    // document.getElementById("Integer").disabled = true; // Tag Integer
    // document.getElementById("Real").disabled = true;    // Tag Real
    // document.getElementById("String").disabled = true;  // Tag String 
}
 
// Chương trình con đọc dữ liệu lên IO Field
function fn_scrDisplay_IOField_IO(tag, IOField, tofix)
{
    socket.on(tag, function(data){
        if (tofix == 0 & Display_data_edditting != true)
        {
            document.getElementById(IOField).value = data;
        }
        else if(Display_data_edditting != true)
        {
            document.getElementById(IOField).value = data.toFixed(tofix);
        }
    });
}

// Tìm kiếm SQL theo khoảng thời gian
function fn_SQL_By_Time()
{
    var val = [document.getElementById('dtpk_Search_Start').value,
               document.getElementById('dtpk_Search_End').value];
    socket.emit('msg_SQL_ByTime', val);
    socket.on('SQL_ByTime', function(data){
        fn_table_01(data); // Show sdata
    });
}