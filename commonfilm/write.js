// 写入数据
const { send } = require('../middleFunction/send')
const { datamodel,userModel } = require('../DataModel/dataModel')

function write(app, mongoose) {
    app.post('/write', (req, res) => {
        req.on('data', data => {
            const text = mongoose.createConnection('mongodb://localhost:27017/text');
            const userconnect = mongoose.createConnection('mongodb://localhost:27017/userKey')
            let _data = JSON.parse(data)
            let userKey = text.model('newKey', require('../DataModel/dataModel').userKey)
            userKey.findOne({ username: _data.username, Key: _data.newKey }, (err, FINDKey) => {
                if (!!FINDKey) {
                    let writemodel = text.model(_data.username, datamodel);
                    writemodel.create(_data, (err, searchData) => {
                        if (!!searchData) {
                            send(res, { state: true })
                            // 存入成功后修改用户数据表
                            let user = userconnect.model('data', userModel)
                            user.findOne({ username: _data.username }, (err, userdata) => {
                                if (!!userdata) {
                                    userdata.set({ dataCorrent: userdata.dataCorrent++ })
                                    userdata.save((err) => {
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