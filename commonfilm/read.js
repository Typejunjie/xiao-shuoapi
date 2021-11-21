// 提取主页面数据

function read(app, mongoose, datamodel){
    app.post('/read', (req, res) => {

        // 对请求内容校正
        req.on('data', data => {
            let _data = JSON.parse(data);
            if(!_data.type){
                res.end('请发送类型数据')
                return;
            } if(!_data.skip){
                _data.skip = 0;
            } if(!_data.corrent){
                _data.corrent = 10
            }
            
            // 执行查询操作
            mongoose.connect('mongodb://localhost:27017/text');
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
