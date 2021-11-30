/* 对注册请求的处理 


在mongoose的create函数中的回调函数不能使用return或throw使promis进入完成或失败状态
这里直接send发送了数据，最后注册成功后promise进入凝固pending状态
*/


function registered(app, mongoose, userModel, time) {
    // 接收服务
    app.post('/registered', (req, res) => {
        req.on('data', data => {
            let _data = JSON.parse(data);
            new Promise((resolve, reject) => {
                // 将集合实例挂载传参上并连接数据库
                mongoose.connect('mongodb://localhost:27017/userKey');
                research = mongoose.model('data', userModel);
                // 重名检查
                research.findOne({ username: _data.username }, err => {
                    if (!err) {
                        reject({ state: false, content: '用户名已被注册' })
                    } else {
                        // 用户名与密码的验证
                        if (!_data.username || !_data.password) {
                            reject({ state: false, content: '内容不足' })
                        } else {
                            resolve(research)
                        }
                    }
                })
            }).then(research => {
                // 对注册数据的补充
                _data.createDay = time();
                _data.power = 1;
                _data.newOnLine = time();
                _data.dataCorrent = 0;
                _data.historySearch = [];
                _data.UID = 1
                return Promise.resolve(research)
            }).then(research => {
                // 创建用户
                research.create(_data, err => {
                    if (!err) {
                        res.send(JSON.stringify({ state: true, content: '注册成功' }))
                        console.log('用户:' + _data.username + '注册成功');
                    } else {
                        res.send(JSON.stringify({ state: false, content: '注册失败，请联系管理员' }))
                    }
                })
            }).catch((data) => {
                res.send(JSON.stringify(data))
            })
        })
    })
}

exports.registered = registered;