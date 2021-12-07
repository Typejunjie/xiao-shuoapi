// 处理用户账户与密码请求
const mongoose = require('mongoose')
const { time } = require('../middleFunction/time');
const { send } = require('../middleFunction/send')
const { userModel } = require('../DataModel/dataModel');

function userOnLine(app) {
    // 配置环境
    const userKeyconnect = mongoose.createConnection('mongodb://localhost:27017/userKey');
    const text = mongoose.createConnection('mongodb://localhost:27017/text')
    // 监听请求
    app.post('userKey', (req, res) => {
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
                if(!_data.username || !_data.password){
                    params.returnData = { state: false, content: '用户名或密码错误' }
                    return Promise.reject(params)
                }
                return Promise.resolve(params)
            }).then(params => {
                
            })
        })
    })

}

exports.userOnLine = userOnLine
