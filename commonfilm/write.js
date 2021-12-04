// 写入数据
const { send } = require('../middleFunction/send')
const { datamodel, userModel, userKey } = require('../DataModel/dataModel')
const mongoose = require('mongoose')

function write(app) {
    app.post('/write', (req, res) => {
        req.on('data', data => {
            const text = mongoose.createConnection('mongodb://localhost:27017/text');
            const userconnect = mongoose.createConnection('mongodb://localhost:27017/userKey')
            let _data = JSON.parse(data)
            let userKeymodel = text.model('newKey', userKey)
            userKeymodel.findOne({ username: _data.username, Key: _data.newKey }, (err, FINDKey) => {
                if (!!FINDKey) {
                    // 写入数据
                    let writemodel = text.model(_data.username, datamodel);
                    writemodel.create(_data, (err, searchData) => {
                        if (!!searchData) {
                            send(res, { state: true })
                            // 存入成功后修改用户数据表
                            let user = userconnect.model('data', userModel)
                            user.findOne({ username: _data.username }, (err, userdata) => {
                                if (!!userdata) {
                                    // 查找所有数据
                                    writemodel.find((err, findUserAllData) => {
                                        if (!!findUserAllData) {
                                            userdata.set({ dataCorrent: findUserAllData.length })
                                            userdata.save((err) => {
                                                if(!err){
                                                    // 存入成功
                                                } else {
                                                    // 存入失败
                                                }
                                            })
                                        }
                                    })

                                } else {
                                }
                            })
                        } else {
                            send(res, { state: false })
                        }
                    });
                } else {
                }
            })
        })
    });
}

exports.write = write;