module.exports = function(io, Users){

const users = new Users();

    io.on('connection', (socket) => {
        //console.log('user connected');
        socket.on('join', (params, callback) => {
            socket.join(params.room);

            users.AddUserData(socket.id, params.name, params.room);
            io.to(params.room).emit('usersList', users.GetUsersList(params.room));
            //console.log(users);
            
            callback();
       });
       
       socket.on('drawing', function(data){
        socket.broadcast.emit('drawing', data);
        //console.log(data);
        //io.to(params.room).emit('drawing',data);
        
      });
      
      socket.on('rectangle', function(data){
        socket.broadcast.emit('rectangle', data);
        //console.log(data);
        //io.to(params.room).emit('rectangle',data);
      });
      
      socket.on('linedraw', function(data){
        socket.broadcast.emit('linedraw', data);
        //console.log(data);
        //io.to(params.room).emit('linedraw',data);
      });
      
       socket.on('circledraw', function(data){
        //io.to(params.room).emit('circledraw',data);
        socket.broadcast.emit('circledraw', data);
        //console.log(data);
      });
      
      socket.on('ellipsedraw', function(data){
        socket.broadcast.emit('ellipsedraw', data);
        //console.log(data);
        //io.to(params.room).emit('ellipsedraw',data);
      });
      
      socket.on('textdraw', function(data){
        //io.to(params.room).emit('textdraw',data);
        socket.broadcast.emit('textdraw', data);
        //console.log(data);
      });
      
      socket.on('copyCanvas', function(data){
        socket.broadcast.emit('copyCanvas', data);
        //io.to(params.room).emit('copyCanvas',data);
        //console.log(data);
      });
      
      socket.on('Clearboard', function(data){
        socket.broadcast.emit('Clearboard', data);
        //console.log(data);
        //io.to(params.room).emit('Clearboard',data);
      });
      
       
        socket.on('createMessage', (message,callback) => {
            console.log(message);
            io.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room,
                from: message.from
            });

            callback();
        });
        
        socket.on('disconnect', () => {
            var user = users.RemoveUser(socket.id);
            if(user){
                io.to(user.room).emit('usersList', users.GetUsersList(user.room));
            }
        })
    });
}




