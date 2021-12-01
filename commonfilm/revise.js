// 处理修改数据请求

function revise(app, mongoose, datamodel) {
    app.post('/revise', (req, res) => {
        req.on('data', data => {
            let _data = JSON.parse(data);
            const text = mongoose.createConnection('mongodb://localhost:27017/text');
            let revisemodel = text.model('text', datamodel);
            revisemodel.findOne({ _id: _data._id }, (err, searchData) => {
                if (!!searchData) {
                    searchData.set({ content: _data.content });
                    searchData.save(err => {
                        if (!err) {
                            res.send('修改成功');
                            console.log('修改了一条数据');
                        } else {
                            res.send('修改失败')
                        }
                    })
                } else {
                    res.send('修改失败')
                }
            })
        })

    })
}

exports.revise = revise;