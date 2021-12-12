// 处理用户账户与密码请求
const mongoose = require('mongoose')
const { time } = require('../middleFunction/time');
const { send } = require('../middleFunction/send')
const { userModel, userKey } = require('../DataModel/dataModel');

function userOnLine(app) {
    // 配置环境
    const userKeyconnect = mongoose.createConnection('mongodb://localhost:27017/userKey');
    const text = mongoose.createConnection('mongodb://localhost:27017/text')
    // 监听请求
    app.post('/userKey', (req, res) => {
        // 监听数据
        req.on('data', data => {
            // 创建异步任务
            new Promise(resolve => {
                // 挂载数据
                let params = new Object
                params._data = JSON.parse(data);
                resolve(params)
            }).then(params => {
                // 数据校验
                let _data = params._data;
                if (!_data.username || !_data.password) {
                    params.returnData = { state: false, content: '用户名或密码错误' }
                    return Promise.reject(params)
                }
                return Promise.resolve(params)
            }).then(params => {
                // 查找username
                let findUserDataCollection = userKeyconnect.model('data', userModel)
                // 解构数据
                const { username, password } = params._data;
                return Promise.resolve(
                    findUserDataCollection.findOne({
                        username,
                        password
                    }).then(findUserData => {
                        if (!!findUserData) {
                            // 设置最近登录事件
                            findUserData.set({ newOnLine: time() })
                            findUserData.save(err => {
                                if (!!err) {
                                    console.log(err, `在登录操作中设置用户最近登录时间时失败`);
                                }
                            })
                        } else {
                            params.returnData = { state: false, content: '请输入正确的用户名或密码' }
                        }
                        return params
                    })
                )
            }).then(params => {
                // 检查上一步是否失败
                if (!!params.returnData) {
                    return Promise.reject(params)
                }
                // 设置临时密钥
                let setNewKeyCollection = text.model('newKey', userKey)
                return Promise.resolve(
                    setNewKeyCollection.findOne({ username: params._data.username }).then(findNewKeyData => {
                        let keyValue = Math.floor(Math.random() * 100)
                        if (!!findNewKeyData) {
                            // 查找成功
                            findNewKeyData.set({ Key: keyValue })
                            findNewKeyData.save(err => {
                                if (!!err) {
                                    console.log(err, `在用户设置新的临时密钥时失败`);
                                }
                            })
                            params.returnData = { state: true, content: '登录成功', newKey: keyValue }
                        } else {
                            // 查找失败，应为用户首次登录
                            params.keyValue = keyValue
                        }
                        return params
                    })
                )
            }).then(params => {
                // 解决用户首次登录问题
                if(!params.returnData){
                    const { username, password } = params._data
                    let setNewKeyCollection = text.model('newKey', userKey)
                    return Promise.resolve(
                        setNewKeyCollection.create({
                            username,
                            password,
                            Key: params.keyValue
                        }).then(createData => {
                            if(!!createData){
                                // 创建成功
                                params.returnData = { state: true, content: '登录成功', newKey: params.keyValue }
                            } else {
                                // 创建异常
                                console.log(`在创建用户首次登录密钥时失败`);
                            }
                            return params
                        })
                    )
                } else {
                    return Promise.resolve(params)
                }
            }).then(params => {
                // 结束异步任务
                return Promise.reject(params)
            }).catch(params => {
                // 发送数据
                send(res, params.returnData)
            })
        })
    })

}

exports.userOnLine = userOnLine
