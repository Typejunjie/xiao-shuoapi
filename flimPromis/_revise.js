const { datamodel } = require('../DataModel/dataModel')
const mongoose = require('mongoose')
const { send,findKey } = require('../middleFunction/send')


function revise(app) {
    // 创建数据库连接实例
    const text = mongoose.createConnection('mongodb://localhost:27017/text')
    // 监听请求
    app.post('/revise', (req, res) => {
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
                let _data = params._data
                if (!_data.username || !_data.newKey || !_data.content || !_data._id) {
                    params.returnData = { state: false, content: '请填写完整数据' }
                    return Promise.reject(params)
                }
                return Promise.resolve(params)
            }).then(params => {
                // 查找密钥
                return Promise.resolve(
                    findKey(params._data).then(returnData => {
                        if (returnData) {
                            // 查找成功
                        } else {
                            params.returnData = { state: false, content: '请重新登录' }
                        }
                        return params
                    })
                )
            }).then(params => {
                // 判断上一步是否失败
                if (!!params.returnData) {
                    return Promise.reject(params)
                }
                // 执行修改操作
                let reviseDataCollection = text.model(params._data.username, datamodel)
                return Promise.resolve(
                    reviseDataCollection.findOne({ _id: params._data._id }).then(findData => {
                        if (!!findData) {
                            findData.set({ content: params._data.content })
                            findData.save(err => {
                                if(err){
                                    console.log(err, '在修改操作的save方法错误');
                                }
                            })
                            params.returnData = { state: true, content: '修改成功', newContent: params._data.content }
                            return params
                        } else {
                            params.returnData = { state: false, content: '未找到该数据' }
                            return params
                        }
                        
                    })
                )
            }).then(params => {
                // 异步任务结束
                return Promise.reject(params)
            }).catch(params => {
                // 发送数据
                send(res, params.returnData)
            })
        })
    })

}

exports.revise = revise