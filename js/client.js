var socket = io("localhost:3000"),
    msgs = [],
    userData = {};

socket.on('hi', function(data){
    document.querySelector('#msg').innerHTML=data;
});



document.querySelector('#usernameInput').addEventListener('keydown', setUserName);

document.querySelector('#msgInput').addEventListener('keydown', sendMessage);


function setUserName(event) {
    var elem = event.target;
    if(elem.value != "" && event.which == 13) {
        document.querySelector('#username').innerHTML = '<h2>' + elem.value + '</h2>';
        elem.style.display = 'none';
        socket.emit('updateUserName', elem.value);
        event.preventDefault();
        event.stopPropagation();
    }
}

function sendMessage(event) {
    if(event.target.value != '' && event.which == 13) {
        socket.emit('chat', event.target.value);
        msgs.push(userData.username + '  : ' + event.target.value);
        event.target.value = "";
        event.preventDefault();
        event.stopPropagation();
        renderChat();
    }
}

function renderChat() {
    var msgDiv = '',
        msgCont = document.querySelector('#msg');
    msgs.forEach(function(msg) {
        msgDiv += '<div><h5>' + msg + '</h5></div>';
    });
    msgCont.innerHTML = msgDiv;
    msgCont.scrollTop = msgCont.scrollHeight;
}

socket.on('updateUserData', function(data){
    userData = data;
});

socket.on('message', function(data){
    msgs = data;
    renderChat();
});
