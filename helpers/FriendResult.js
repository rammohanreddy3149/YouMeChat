module.exports = function(async, Users, Message){
    return {
        PostRequest: function(req, res, url){
            
            async.parallel([
                function(callback){
                    if(req.body.receiverName){
                        Users.update({
                            'username': req.body.receiverName,
                            'request.userId': {$ne: req.user._id},
                            'friendsList.friendId': {$ne: req.user._id},
                        },
                        {
                            $push: {request: {
                                userId: req.user._id,
                                username:req.user.username
                            }},
                            $inc: {totalRequest: 1}
                        }, (err, count) => {
                            callback(err, count);
                        })
                    }
                },
                function(callback){
                    //console.log("hello     "+req.user);
                    if(req.body.receiverName){
                        //console.log("bello      "+req.user);
                        Users.update({
                            'fullname': req.user.fullname,
                            'sentRequests.username': {$ne: req.body.receiverName}
                        },
                        {
                            $push: {sentRequests: {
                                username: req.body.receiverName
                            }}
                        }, (err, count) => {
                            callback(err, count);
                        })
                    }
                }   
            ], (err, results) => {
                res.redirect(url);
            });
            async.parallel([
                //accepted update receiver
                function(callback){
                    //console.log(req.body.senderName+" is sender");
                    if(req.body.senderId){
                        Users.update({
                            '_id': req.user._id,
                            'friendsList.friendId': {$ne: req.body.senderId}
                        },{
                            $push: {friendsList: {
                                friendId: req.body.senderId,
                                friendName: req.body.senderName
                            }},
                            $pull: {request: {
                                userId: req.body.senderId,
                                username: req.body.senderName//error: sender name is null 
                            }},
                            $inc: {totalRequest: -1}
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                },
                //accepted update sender
                function(callback){
                    if(req.body.senderId){
                        Users.update({
                            '_id': req.body.senderId,
                            'friendsList.friendId': {$ne: req.user._id}
                        },{
                            $push: {friendsList: {
                                friendId: req.user._id,
                                friendName: req.user.username
                            }},
                            $pull: {sentRequests: {
                                username: req.user.username
                            }},
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                },
                //rejected update receiver
                function(callback){
                    if(req.body.user_Id){
                     Users.update({
                            '_id': req.user._id,
                            'request.userId': {$eq: req.body.user_Id}
                        },{
                            $pull: {request: {
                                userId: req.body.user_Id
                            }},
                            $inc: {totalRequest: -1}
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                },
                //rejected update sender
                function(callback){
                    if(req.body.user_Id){
                        Users.update({
                            '_id': req.body.user_Id,
                            'sentRequest.username': {$eq: req.user.username}
                        },{
                            $pull: {sentRequests: {
                                username: req.user.username
                            }}
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                },
                function(callback){//console.log(req.body);

                    if(req.body.chatId){
                        //console.log(req.body);
                        Message.update({
                            '_id': req.body.chatId
                        },
                        {
                            "isRead": true
                        }, (err,done) => {
                            //console.log(done);
                            callback(err, done);
                        })
                    }
                }
            ], (err, results) => {
                res.redirect(url);
            });
        }
    }
}