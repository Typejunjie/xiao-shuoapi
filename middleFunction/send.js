// 发送数据操作的封装
function send(res, obj) {
    res.send(JSON.stringify(obj))
}

// 查找密钥
function findKey({ username, newKey }) {
    // 配置环境
    const { userKey } = require('../DataModel/dataModel')
    const mongoose = require('mongoose')
    let text = mongoose.createConnection(`mongodb://localhost:27017/text`)
    let newKeyCollection = text.model('newKey', userKey);
    // 执行操作
    return Promise.resolve(
        newKeyCollection.findOne({
            username,
            Key: newKey
        }).then(findNewKeyData => {
            if(!!findNewKeyData){
                return true
            } else {
                return false
            }
        })
    )
}



exports.findKey = findKey
exports.send = send
