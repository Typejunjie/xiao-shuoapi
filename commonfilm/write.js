// 写入数据模块

function write(app, mongoose, datamodel){
    app.post('/write', (req, res) => {
        mongoose.connect('mongodb://localhost:27017/text');
        req.on('data', data => {
            let _data = JSON.parse(data)
            let writemodel = mongoose.model('text', datamodel);
            writemodel.create(_data, (err) => {
                if (!err) {
                    console.log('存入：' + _data);
                } else {
                    console.log(err);
                }
            });
        })
        res.end('收到请求')
    });
}

exports.write = write;