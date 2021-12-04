// 满足删除请求
const { userKey, datamodel } = require('../DataModel/dataModel')
const mongoose = require('mongoose')


function _delete(app) {
    app.post('/delete', (req, res) => {
        req.on('data', data => {
            let _data = JSON.parse(data);
            const text = mongoose.createConnection('mongodb://localhost:27017/text');
            let userKeycollecation = text.model('newKey', userKey)
            userKeycollecation.findOne({ username: _data.username, Key: _data.newKey }, (err, finduserKeyData) => {
                if (!!finduserKeyData) {
                    // newKey查找成功
                    let deletemodel = text.model(_data.username, datamodel);
                    deletemodel.deleteOne({_id: _data._id}, (err, searchData) => {
                        if (!!searchData) {
                            res.send('删除成功')
                        } else {
                            // id查找失败
                            res.send('删除失败，未找到相关数据');
                        }
                    })
                } else {
                    // newKey查找失败
                }
            })

        })

    })
}

exports._delete = _delete;