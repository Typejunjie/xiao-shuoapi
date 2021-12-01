// 满足删除请求

function _delete(app, mongoose, datamodel) {
    app.post('/delete', (req, res) => {
        req.on('data', data => {
            let _data = JSON.parse(data);
            const text = mongoose.createConnection('mongodb://localhost:27017/text');
            let deletemodel = text.model('text', datamodel);
            deletemodel.deleteOne(_data, (err, searchData) => {
                if (!!searchData) {
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