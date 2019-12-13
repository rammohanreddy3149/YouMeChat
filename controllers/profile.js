const path = require('path');
const fs = require('fs');
module.exports = function(async, Users, Message, aws, formidable, FriendResult){
    return {
        SetRouting: function(router){
            router.get('/settings/profile', this.getProfilePage);
            router.post('/userupload', this.userUpload);
            router.post('/settings/profile', this.postProfilePage);
        },
        getProfilePage: function(req, res){
            
            async.parallel([
                function(callback){
                    Users.findOne({'username': req.user.username})
                    .populate('request.userId')
                    .exec((err, result) => {
                        callback(err, result);
                    })

                },
                
                function(callback){
                    const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i")
                    Message.aggregate([
                        {$match:{$or:[{"senderName":nameRegex}, {"receiverName":nameRegex}]}},
                        {$sort:{"createdAt":-1}},
                        {
                            $group:{"_id":{
                            "last_message_between":{
                                $cond:[
                                    {
                                        $gt:[
                                        {$substr:["$senderName",0,1]},
                                        {$substr:["$receiverName",0,1]}]
                                    },
                                    {$concat:["$senderName"," and ","$receiverName"]},
                                    {$concat:["$receiverName"," and ","$senderName"]}
                                ]
                            }
                            }, "body": {$first:"$$ROOT"}
                            }
                        }
                    ]).exec(function(err, newResults){
                        callback(err, newResults);
                    })
                }
            ], (err, results) => {
                const result1 = results[0];
               // console.log(result1+"in group");
                const result2 = results[1];
                res.render('user/profile', {title: 'YouMeChat - Profile', user:req.user, data: result1, chat: result2});
               // res.render('groupchat/group', {title: 'Footballkik - Group', user:req.user, groupName:name, data: result1, chat:result2, groupMsg: result3});
            });
           },

           postProfilePage: function(req, res){
            FriendResult.PostRequest(req, res, '/settings/profile/');

            async.waterfall([
                function(callback){
                    Users.findOne({'_id':req.user._id}, (err, result) => {
                        callback(err, result);
                    })
                },
                function(result, callback){
                    Users.update({
                        '_id':req.user._id
                    },
                    {
                        username: req.body.username,
                        fullname: req.body.fullname,
                        bio: req.body.bio,
                        gender: req.body.gender,
                        userImage: req.body.upload,
                        section: req.body.section
                    },
                    {
                        upsert: true
                    }, (err, result) => {
                        console.log(result);
                        res.redirect('/settings/profile');
                    })
                }
            ]);
           },
           userUpload: function(req, res) {
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname,'../public/profilepics');
            form.on('file', (field, file) => {
                fs.rename(file.path, path.join(form.uploadDir, file.name), (err)=>{
                    if(err) throw err;
                    //console.log('File renamed successfully');
                });
            });
            //form.on('file', (field, file) => {});
            form.on('error', (err) => {});
            form.on('end', () => {});
            form.parse(req);
            
        },
    }
}