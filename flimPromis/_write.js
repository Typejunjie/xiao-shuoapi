const { send, findKey } = require('../middleFunction/send')
const { datamodel, userModel } = require('../DataModel/dataModel')
const mongoose = require('mongoose')

function write(app) {
    // 连接库并创建实例
    const text = mongoose.createConnection('mongodb://localhost:27017/text')
    const user = mongoose.createConnection('mongodb://localhost:27017/userKey')
    // 监听请求
    app.post('/write', (req, res) => {
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
                if (!_data.username || !_data.newKey || !_data.content || !_data.type) {
                    params.returnData = { state: false, content: '请检查您的内容是否完全' }
                    return Promise.reject(params)
                } else {
                   params._data.contentLength = params._data.content.length
                }
                return Promise.resolve(params)
            }).then(params => {
                // 检查密钥
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
                // 检查上一步是否失败
                if (!!params.returnData) {
                    return Promise.reject(params)
                }
                // 写入数据
                let writeDataCollection = text.model(params._data.username, datamodel)
                // 将数据解构
                const { writeday, type, content, contentHead, username, contentLength } = params._data
                return Promise.resolve(
                    writeDataCollection.create({
                        writeday,
                        type,
                        content,
                        contentHead,
                        username,
                        contentLength,
                    }).then(writeData => {
                        if (!!writeData) {
                            // 写入成功
                            params.returnData = { state: true, content: '' }
                        } else {
                            // 写入失败
                            params.returnData = { state: false, content: '写入失败，请联系管理员' }
                            console.log('在写入操作异常导致失败');
                        }
                        return params
                    })
                )
            }).then(params => {
                // 修改用户数据
                if (params.returnData.state) {
                    let userDataCollection = user.model('data', userModel)
                    userDataCollection.findOne({ username: params._data.username }).then(findUserData => {
                        if (!!findUserData) {
                            findUserData.set({ dataCorrent: (findUserData.dataCorrent + 1) })
                            findUserData.save(err => {
                                if (!!err) {
                                    console.log('在写入时修改用户数后save失败');
                                }
                            })
                        }
                    })
                }
                // 结束任务
                return Promise.reject(params)
            }).catch(params => {
                // 发送数据
                send(res, params.returnData)
            })
        })
    })
}

exports.write = write
