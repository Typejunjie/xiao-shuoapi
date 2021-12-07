const { datamodel, userModel } = require('../DataModel/dataModel')
const mongoose = require('mongoose')
const { send, findKey } = require('../middleFunction/send')

function _delete(app) {
    // 连接库并创建实例
    const text = mongoose.createConnection('mongodb://localhost:27017/text')
    const user = mongoose.createConnection('mongodb://localhost:27017/userKey')
    // 监听请求
    app.post('/delete', (req, res) => {
        // 监听数据
        req.on('data', data => {
            // 创建promis异步任务
            new Promise(resolve => {
                // 挂载数据
                let params = new Object
                params._data = JSON.parse(data);
                resolve(params)
            }).then(params => {
                // 数据校验
                let _data = params._data
                if (!_data.username || !_data.newKey || !! !_data._id) {
                    params.returnData = { state: false, content: '请先登录，如已登录可进入个人页面再访问' }
                    return Promise.reject(params);
                }
                return Promise.resolve(params);
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
                    return Promise.reject(params);
                }
                // 执行删除操作
                let deleteDataCollection = text.model(params._data.username, datamodel)
                return Promise.resolve(
                    deleteDataCollection.deleteOne({ _id: params._data._id }).then(deleteData => {
                        if (!!deleteData) {
                            params.returnData = { state: true, content: '删除成功' }
                        } else {
                            params.returnData = { state: false, content: '未找到该数据' }
                        }
                        return params
                    })
                )
            }).then(params => {
                // 修改用户数据
                if (params.returnData.state) {
                    let userDataCollection = user.model('data', userModel)
                    userDataCollection.findOne({
                        username: params._data.username
                    }).then(findUserData => {
                        findUserData.set({ dataCorrent: (findUserData.dataCorrent - 1) })
                        findUserData.save(err => {
                            if (!!err) {
                                // 修改失败回调
                                console.log(err, '在删除操作中修改用户数据失败');
                            }
                        })
                    })
                }
                // 异步任务结束
                return Promise.reject(params)
            }).catch(params => {
                // 无论是否成功，发送数据
                send(res, params.returnData)
            })
        })
    })
}

exports._delete = _delete
