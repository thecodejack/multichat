var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = {
    data: [],
    msgs: [],
    user: function(username) {
        return {
            id: Math.round(Math.random()*100000),
            username: username || 'Anonymous',
            status: 1
        };
    },
    sendAllMsgs: function() {
        var msgs = [];
        users.msgs.forEach(function(msgObj){
            console.log(users.data + '    &&   ' + msgObj.userid);
            var name = users.data.filter(function(Obj){
                return Obj.id == msgObj.userid;
            })[0].username;
            msgs.push(name + '  : ' + msgObj.message);
        });
        return msgs;
    }
};

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
    var user = users.user();
    console.log(user);
    users.data.push(user);
    console.log('a user connected');
    socket.emit('updateUserData', user);
    socket.on('updateUserName', function(data){
        user.username = data;
        socket.emit('updateUserData', user);
        io.emit('message', users.sendAllMsgs());
    });

    socket.on('chat', function(msg) {
        console.log(user.id + ' sent msg : ' + msg);
        users.msgs.push({
            userid: user.id,
            message: msg
        });
        socket.broadcast.emit('message', users.sendAllMsgs());
    });
    //socket.broadcast('add user', user);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
