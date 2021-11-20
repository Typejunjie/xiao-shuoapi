// 提取主页面数据

function read(app, mongoose, datamodel){
    app.post('/read', (req, res) => {
        mongoose.connect('mongodb://localhost:27017/text');
        req.on('data', data => {
            let _data = JSON.parse(data);
            let readmodel = mongoose.model('text', datamodel);
            readmodel.find({ type: _data.type }, { _id: 0 }, {skip: _data.skip,limit: _data.corrent}, (err, finddata) => {
                if (!err) {
                    res.send(finddata);
                    console.log('读出：' + finddata.length + '条数据');
                } else {
                    console.log(err);
                }
            });
        });
    
    });
}

exports.read = read;
