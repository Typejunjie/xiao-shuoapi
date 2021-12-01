// 写入数据

function write(app, mongoose, datamodel) {
    app.post('/write', (req, res) => {
        req.on('data', data => {
            const text = mongoose.createConnection('mongodb://localhost:27017/text');
            let _data = JSON.parse(data)
            let writemodel = text.model('text', datamodel);
            writemodel.create(_data, (err, searchData) => {
                if (!!searchData) {
                    res.send(JSON.stringify({status: true}))
                    console.log('存入：' + _data);
                } else {
                    res.send(JSON.stringify({status: false}))
                }
            });
        })
    });
}

exports.write = write;