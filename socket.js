let server=require('http').createServer();
let io=require('socket.io')(server);

// client side  developer,should  know how to deal with socket-io 

// client side
//let io=require('socket.io-client');
//let socket=io('https://localhost:6660');

io.on('connection',(socket)=>{
    let count=0;
    let online_users=[];
    socket.on('add-user',(userId)=>{
        // client side will fire when user is added => socket.emit('add-user',userId);
        online_users.push({userId,socketId:socket.id});
        io.emit('user-join-server',userId);
        // client side will listen to => socket.on('user-join-server',(data)=>{});
    });


    socket.on('send-message',(data)=>{
        // client side will fire => socket.emit('new-message',recipientId);
        // data:{message,recipientId};
        if(data.recipientId){
            let user=online_users.find((ele)=>{return ele.userId == data.recipientId});
            io.to(user.socketId).emit('get-message',data);
            io.to(user.socketId).emit('notification',data);
        }else{
            // if no recipientId we will emit message to all users
            io.emit('get-message',data);
            io.emit('notification',data);
        };
        // client side will listen to => socket.on('send-message',(data)=>{});
        // client side will listen to => socket.on('notifications',(data)=>{});
    });


    socket.on('disconnect',()=>{
        // if user is not connected we will remove user from online users list
        online_users=online_users.filter((user)=>{return socket.id !== user.socketId;});
        let user=online_users.find((ele)=>{return ele.socketId === socket.id;});
        io.emit('user-left-server',user.userId);
        // client side will listen to => socket.on('user-left-server',(data)=>{});
    });


    socket.on('typing',(data)=>{
        // client side will fire => socket.emit('typing',recipientId);
        // data:{typing:"typing",recipientId};
        data.typing = "typing";
        if(data.recipientId){
            let user=online_users.find((ele)=>{return ele.socketId == socket.id});
            if(!user){
                return false;
            };
            io.to(user.socketId).emit('typing',data);
            // client side will listen to => socket.on('typing',(data)=>{});
            
        };
    });

    socket.on('join-chat-room',(data)=>{
        // client side will fire > socket.emit('join-chat',recipientId);
        // data:{chatId,userId};
        count++;
        socket.join(data.chatId);
        data.dataOfGroupMembers=count;
        io.in(data.chatId).emit('user-join-group',count);
        // client side will listen to => socket.on('user-join-group',(data)=>{});
    });

    socket.on('send-chat-room',(data)=>{
        // client side will fire => socket.emit('send-chat-room',recipientId);
        // data:{chatId,message};
        io.to(data.chatId).emit('get-room-message',data);
        io.to(data.chatId).emit('notifications',data);
        // client side will listen to => socket.on('get-room-message',(data)=>{});
        // client side will listen to => socket.on('notifications',(data)=>{});
    });
});

server.listen(6660,()=>{})