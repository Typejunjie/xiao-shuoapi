// 处理修改数据请求
const { datamodel, userKey } = require('../DataModel/dataModel')
const { send } = require('../middleFunction/send')

function revise(app, mongoose) {
    app.post('/revise', (req, res) => {
        req.on('data', data => {
            let _data = JSON.parse(data);
            const text = mongoose.createConnection('mongodb://localhost:27017/text');
            let newKeymodel = text.model('newKey', userKey)
            newKeymodel.findOne({ username: _data.username, Key: _data.newKey }, (err, findusernewKeyData) => {
                if (!!findusernewKeyData) {
                    // 查找newKey成功
                    let revisemodel = text.model(_data.username, datamodel);
                    revisemodel.findOne({ _id: _data._id }, (err, searchData) => {
                        if (!!searchData) {
                            searchData.set({ content: _data.content });
                            searchData.save(err => {
                                if (!err) {
                                    send(res, {state: true, content: '修改成功'});
                                } else {
                                    // save失败
                                }
                            })
                        } else {
                            // id查找失败
                        }
                    })
                } else {
                    // 查找newKey失败
                }
            })


        })

    })
}

exports.revise = revise;