const { send, findKey } = require('../middleFunction/send')
const { datamodel } = require('../DataModel/dataModel')
const mongoose = require('mongoose')

function read(app) {
    // 环境配置
    const text = mongoose.createConnection(`mongodb://localhost:27017/text`)
    // 请求监听
    app.post('/read', (req, res) => {
        // 数据监听
        req.on('data', data => {
            new Promise(resolve => {
                // 数据挂载
                let params = new Object
                params._data = JSON.parse(data);
                resolve(params)
            }).then(params => {
                // 数据校验
                if(!params._data.username || !params._data.newKey){
                    params.returnData = { state: false, content: '请先登录' }
                    return Promise.reject(params)
                }
                // 自动补全
                if (!params._data.skip) {
                    params._data.skip = 0;
                } if (!params._data.corrent) {
                    params._data.corrent = 10
                }
                return Promise.resolve(params)
            }).then(params => {
                // 查找密钥
                return Promise.resolve(
                    findKey(params._data).then(returnData => {
                        if (returnData) {
                            // 查找成功
                        } else {
                            // 查找失败
                            params.returnData = { state: false, content: '请重新登录' }
                        }
                        return params
                    })
                )
            }).then(params => {
                // 处理上一步无法reject
                if (!!params.returnData) {
                    return Promise.reject(params)
                }
                // 查找数据
                let readDataCollection = text.model(params._data.username, datamodel)
                if (!params._data.type) {
                    // 查找所有内容
                    return Promise.resolve(
                        readDataCollection.find().then(findAllData => {
                            params.returnData = { state: true, content: '', findAllData }
                            return params
                        })
                    )
                } else {
                    // 查找特定内容
                    return Promise.resolve(
                        readDataCollection.find(
                            { //查找内容
                                type: params._data.type
                            }, {},
                            {
                                skip: params._data.skip, limit: params._data.corrent
                            }
                        ).then(findAllData => {
                            if (!!findAllData) {
                                params.returnData = { state: true, content: '', findAllData }
                                return params
                            } else {
                            }

                        })
                    )
                }
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
exports.read = read
