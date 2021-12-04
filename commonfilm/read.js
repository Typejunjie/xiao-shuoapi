// 提取主页面数据
const { send } = require('../middleFunction/send')
const { userKey, datamodel } = require('../DataModel/dataModel')
const mongoose = require('mongoose')

function read(app) {
    app.post('/read', (req, res) => {
        // 对请求内容校正
        req.on('data', data => {
            let _data = JSON.parse(data);
            if (!_data.type) {
                send(res, {state: false, content: '请发送类型数据'})
                return;
            } if (!_data.skip) {
                _data.skip = 0;
            } if (!_data.corrent) {
                _data.corrent = 10
            }
            // 执行查询操作
            const text = mongoose.createConnection('mongodb://localhost:27017/text');
            let newKeymodel = text.model('newKey', userKey)
            newKeymodel.findOne({ username: _data.username, Key: _data.newKey }, (err, newKey) => {
                if (!!newKey) {
                    let readmodel = text.model(_data.username, datamodel);
                    // newKey查找正确
                    readmodel.find({ type: _data.type }, {}, { skip: _data.skip, limit: _data.corrent }, (err, finddata) => {
                        if (!!finddata) {
                            send(res, { state: true, finddata: finddata, content: '' })
                        } else {
                            console.log(err);
                        }
                    });
                } else {
                    send(res, { state: false, content: 'KEY或者用户名错误' })
                }
            })
        });
    });
}

exports.read = read;
