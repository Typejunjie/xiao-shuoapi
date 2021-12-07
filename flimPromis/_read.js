const { send, findKey } = require('../middleFunction/send')
const { userKey, datamodel } = require('../DataModel/dataModel')
const mongoose = require('mongoose')

function read(app) {
    const text = mongoose.createConnection(`mongodb://localhost:27017/text`)
    app.post('/read', (req, res) => {
        req.on('data', data => {
            new Promise(resolve => {
                // 事件处理
                let params = new Object
                params._data = JSON.parse(data);
                resolve(params)
            }).then(params => {
                // 数据校验
                if (!params._data.type) {
                    params.returnData = { state: false, content: '请发送类型数据' }
                    return Promise.reject(params);
                } if (!params._data.skip) {
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
                return Promise.reject(params)
            }).catch(params => {
                send(res, params.returnData)
            })
        })
    })


}
exports.read = read
