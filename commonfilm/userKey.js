// 处理用户账户与密码请求
const mongoose = require('mongoose')
const { time } = require('../middleFunction/time');
const { send } = require('../middleFunction/send')
const { userModel, userKey } = require('../DataModel/dataModel')

function userVerify(app) {
    // 发送任务统一处理
    app.post('/userKey', (req, res) => {
        // 收到数据进行处理
        req.on('data', data => {
            let _data = JSON.parse(data);
            const userKeyconnect = mongoose.createConnection('mongodb://localhost:27017/userKey');
            const text = mongoose.createConnection('mongodb://localhost:27017/text')
            let user = userKeyconnect.model('data', userModel);
            let Key = text.model('newKey', userKey)
            // 对收到信息检查
            if (!_data.username || !_data.password) {
                send(res, { state: false, content: '请发送应有的数据' });
                return
            } else {
                _data = { username: _data.username, password: _data.password }
            }
            //查找username
            user.findOne(_data, (err, finddata) => {
                if (finddata) {
                    // 查找成功
                    finddata.set({ newOnLine: time() })
                    finddata.save(err => {
                        if (!err) {
                            // 登录状态设置完成，发送临时Key
                            Key.findOne(_data, (err, findKey) => {
                                if (findKey) {
                                    // 绑定新的newKey
                                    let keyvalue = Math.floor(Math.random() * 100)
                                    findKey.set({ Key: keyvalue })
                                    findKey.save(err => {
                                        if (!err) {
                                            send(res, { state: true, content: '登录成功', newKey: keyvalue })
                                        } else {
                                            send(res, 'findKey save is err')
                                        }
                                    })
                                } else {
                                    // 用户首次登录创建临时key数据
                                    _data.Key = Math.floor(Math.random() * 100)
                                    Key.create(_data, (err, createdata) => {
                                        if (createdata) {
                                            send(res, { state: true, content: '登录成功', newKey: createdata.Key })
                                        } else {
                                            send(res, { state: false, content1: 'create is err' })
                                        }
                                    })
                                }
                            })
                        } else {
                            send(res, { state: false, content: 'save is err' })
                        }
                    })
                } else {
                    send(res, { state: false, content: '请输入正确的用户名与密码' })
                    return
                }
            })
        })
    })
}

exports.userVerify = userVerify