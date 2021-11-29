// 基础模块
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// ip配置集中控制
const testip = require('../xiao-shuo/src/api/testmodelip.js')

// 使用cors模块解决跨域问题
const cors = require('cors');
app.use(cors());

// api模块化
const read = require('./commonfilm/read');
const write = require('./commonfilm/write');
const _delete = require('./commonfilm/_delete');
const revise = require('./commonfilm/revise');



// 配置模型
let datamodel = new mongoose.Schema({
    writeday: Array,
    type: String,
    content: String,
});


// 接收write请求并写入对应用户数据库
write.write(app, mongoose, datamodel);


// 接收read请求
read.read(app, mongoose, datamodel);

// 接收delete请求
_delete._delete(app, mongoose, datamodel)

// 接收revise请求
revise.revise(app, mongoose, datamodel)


// 开启服务
mongoose.connection.once('open', (err) => {
    if (!err) {
        console.log('数据库连接成功');
    } else {
        console.log('数据库连接失败', err);
    }
});
app.listen(testip.serveport, testip.ip, () => {
    console.log(testip.serveport, testip.ip);
})
