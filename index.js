const server = require("http").Server();
const port = process.env.PORT || 4005;
var io = require("socket.io")(server);

/*var mysql = require('mysql');
var con = mysql.createConnection({
          host     : 'localhost',
          user     : 'root',
          password : '0987poiu',
          database : 'circus_db'
        });
 
con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
});*/


var usrinfo = [];
var msgbox = [];

io.on("connection", function(socket){
    
    
    socket.on("usrinfo",function(data){
       console.log("userinfo name is "+data.name+". avatart is "+data.avatar);
        
        usrinfo.push(data);
        if(data.length != 0){
            socket.myuserobj={
                name:data.name
            }
        
        }
        io.emit("cuser",usrinfo);
        
    });
    
    console.log(usrinfo);

    socket.on("sendmsg", function(data){
        console.log("msg name:"+data.name+"msg ava:"+data.avatar+"msg msg:"+data.msg);
        msgbox.push(data);
        
        io.emit("usrmsgs", msgbox);
    });
    
    socket.on("usrleft", function(data){
        console.log("user left");
        usrinfo = usrinfo.filter((obj,i)=>{
            return(data != obj.name);
        })
        io.emit("cuser",usrinfo);
        
    });
    
    socket.on("disconnect", function(){
        console.log("user has disconnected", socket.myuserobj);
        if(socket.myuserobj !== undefined){
            var disuser = socket.myuserobj.name;
        //delete usrinfo[disuser];
/*        var index = usrinfo.indexOf(disuser);
        usrinfo.splice(index, 1);*/
        usrinfo = usrinfo.filter((obj,i)=>{
            return(disuser != obj.name);
        })
        console.log("users are not connected"+usrinfo.length);
        io.emit("cuser",usrinfo);
        console.log(usrinfo.name);
        }
        
    });
});


server.listen(port, (err)=>{
    if(err){
        console.log("Err is "+err);
        return false
    }
    console.log("Socket is running.");
})