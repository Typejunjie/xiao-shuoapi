// 写入数据

function write(app, mongoose, datamodel){
    app.post('/write', (req, res) => {
        mongoose.connect('mongodb://localhost:27017/text');
        req.on('data', data => {
            let _data = JSON.parse(data)
            let writemodel = mongoose.model('text', datamodel);
            writemodel.create(_data, (err) => {
                if (!err) {
                    res.end({status: true})
                    console.log('存入：' + _data);
                } else {
                    res.send({status: false})
                    throw err
                }
            });
        })
    });
}

exports.write = write;