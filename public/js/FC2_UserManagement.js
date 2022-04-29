// Danh sách người dùng
var admin = ["admin","123456"]
var user1 = ["user1","1"]
var user2 = ["user2","2"]
    
// Chương trình con
function login()
{
    var a = document.getElementById("inputuser").value;
    var b = document.getElementById("inputpass").value;
    // Admin
    if (a == admin[0] && b == admin[1])
    {
        fn_ScreenChange('main_screen','system_screen','display_screen','graph_screen','alarm_screen');
        document.getElementById('id01').style.display='none';
    }
    // User 1
    else if (a == user1[0] && b == user1[1])
    {
        fn_ScreenChange('main_screen','system_screen','display_screen','graph_screen','alarm_screen');
        document.getElementById('id01').style.display='none';
        document.getElementById("btt_system_screen").disabled = true;
    }
    // User 2
    else if (a == user2[0] && b == user2[1])
    {
        fn_ScreenChange('main_screen','system_screen','display_screen','graph_screen','alarm_screen');
        document.getElementById('id01').style.display='none';
        document.getElementById("btt_Screen_Main").disabled = true;
        document.getElementById("btt_display_screen").disabled = true;
    } 
    else
    {
        window.location.href = '';
    }
}
function logout() // Ctrinh login
{
    alert("Đăng xuất thành công");
    window.location.href = 'Dev_by_Hien_Phong_DH_SPKT_TPHCM';
}