// 处理用户账户与密码请求

const { time } = require('../middleFunction/time');

function userVerify(app, mongoose, userModel) {
    // 发送任务统一处理
    app.post('/userKey', (req, res) => {
        function send(obj){
           res.send(JSON.stringify(obj))
        }
        // 收到数据进行处理
        req.on('data', data => {
            let _data = JSON.parse(data);
            const userKey = mongoose.createConnection('mongodb://localhost:27017/userKey');
            const text = mongoose.createConnection('mongodb://localhost:27017/text')
            let user = userKey.model('data', userModel);
            let Key = text.model('newKey', require('../DataModel/dataModel').userKey)
            //查找username
            user.findOne(_data, (err, finddata) => {
                if (finddata) {
                    // 查找成功
                    finddata.set({ newOnLine: time() })
                    finddata.save(err=>{
                        if(!err){
                            // 登录状态设置完成，发送临时Key
                            Key.findOne(_data, (err, findKey) => {
                                if(findKey){
                                    // 绑定新的newKey
                                    let keyvalue = Math.floor(Math.random() * 100)
                                    findKey.set({Key: keyvalue})
                                    findKey.save(err => {
                                        if(!err){
                                            send({state: true, content: '登录成功', newKey: keyvalue})
                                        } else {
                                            send('findKey save is err')
                                        }
                                    })
                                } else {
                                    // 用户首次登录创建临时key数据
                                    _data.Key = Math.floor(Math.random() * 100)
                                    Key.create(_data, (err, createdata) => {
                                        if(createdata){
                                            send({state: true, content: '登录成功', newKey: createdata.Key})
                                        } else {
                                            send({state: false, content1: 'create is err'})
                                        }
                                    })
                                }
                            })
                        } else {
                            send({ state: false, content: 'save is err' })
                        }
                    })
                } else {
                    send(JSON.stringify({ state: false, content: '请输入正确的用户名与密码' }))
                    return 
                }
            })
        })
    })
}

exports.userVerify = userVerify