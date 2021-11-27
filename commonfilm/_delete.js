// 满足删除请求

function _delete(app, mongoose, datamodel) {
    app.post('/delete', (req, res) => {
        req.on('data', data => {
            let _data = JSON.parse(data);
            mongoose.connect('mongodb://localhost:27017/text');
            let deletemodel = mongoose.model('text', datamodel);
            deletemodel.deleteOne(_data, (err, data) => {
                if (!err) {
                    res.send('删除成功')
                    console.log('删除一条数据');
                } else {
                    res.send('删除失败，未找到相关数据');
                }
            })
        })

    })
}

exports._delete = _delete;