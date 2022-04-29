 ////////////// YÊU CẦU DỮ LIỆU TỪ SERVER- REQUEST DATA //////////////

    var myVar = setInterval(myTimer, 100);
    function myTimer() {
        socket.emit("Client-send-data", "Request data client");
    }

    
 ////////////// CÁC KHỐI CHƯƠNG TRÌNH CON //////////////

    // Chương trình con đọc dữ liệu lên IO Field
    function fn_IOFieldDataShow(tag, IOField, tofix){
        socket.on(tag,function(data){
            if(tofix == 0){
                document.getElementById(IOField).value = data;
            } else{
            document.getElementById(IOField).value = data.toFixed(tofix);
            }
        });
    }

    // Chương trình con đổi màu Symbol
    function fn_SymbolStatus(ObjectID, SymName, Tag){
        var imglink_0 = "images/symbol/" + SymName + "_0.png"; // Trạng thái tag = 0
        var imglink_1 = "images/symbol/" + SymName + "_1.png"; // Trạng thái tag = 1
        var imglink_2 = "images/symbol/" + SymName + "_2.png"; // Trạng thái tag = 2
        var imglink_3 = "images/symbol/" + SymName + "_3.png"; // Trạng thái tag = 3
        var imglink_4 = "images/symbol/" + SymName + "_4.png"; // Trạng thái tag = 4
        var imglink_5 = "images/symbol/" + SymName + "_5.png"; // Trạng thái tag = 5
        socket.on(Tag,function(data){
            if(data == 0){
                document.getElementById(ObjectID).src = imglink_0;
            }
            else if(data == 1){
                document.getElementById(ObjectID).src = imglink_1;
            }
            else if(data == 2){
                document.getElementById(ObjectID).src = imglink_2;
            }
            else if(data == 3){
                document.getElementById(ObjectID).src = imglink_3;
            }
            else if(data == 4){
                document.getElementById(ObjectID).src = imglink_4;
            }
            else{
                document.getElementById(ObjectID).src = imglink_0;
            }
        });
    }

    // Chương trình con nút sửa/lưu dữ liệu
    function fn_DataEdit(button1, button2)
    {
        document.getElementById(button1).style.zIndex='1';  // Hiển nút 1
        document.getElementById(button2).style.zIndex='0';  // Ẩn nút 2
    }