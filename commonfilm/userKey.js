// 处理用户账户与密码请求

function userVerify(app, mongoose, userModel) {
    app.post('/userKey', (req, res) => {
        req.on('data', data => {
            let _data = JSON.parse(data);
            const userKey = mongoose.createConnection('mongodb://localhost:27017/userKey');
            let research = userKey.model('data', userModel);
            
        })
    })
}

exports.userVerify = userVerify