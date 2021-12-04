// 基础模块
const express = require('express');
const mongoose = require('mongoose');
const app = express();
// 中间处理函数
const { time } = require('./middleFunction/time')

// ip配置提取自前端api
const testip = require('../xiao-shuo/src/api/testmodelip.js')

// 使用cors模块解决跨域问题
const cors = require('cors');
app.use(cors());

// api模块化
const { read } = require('./commonfilm/read');
const { write } = require('./commonfilm/write');
const { _delete } = require('./commonfilm/_delete');
const { revise } = require('./commonfilm/revise');
const { userVerify } = require('./commonfilm/userKey')
const { registered } = require('./commonfilm/registered')



// 配置模型
const { datamodel, userModel } = require('./DataModel/dataModel')


// 接收write请求并写入对应用户数据库
write(app, mongoose);


// 接收read请求
read(app, mongoose);

// 接收delete请求
_delete(app, mongoose)

// 接收revise请求
revise(app, mongoose, datamodel)

// 接收用户登录请求
userVerify(app, mongoose, userModel)

// 接收用户注册请求
registered(app, mongoose, time)



//mongoose.createConnection('mongodb://[localhost:27017/userKey][localhost:27017/text]')
// 开启服务
/* mongoose.on('connected', (err) => {
    if (!err) {
        console.log('数据库连接成功');
    } else {
        console.log('数据库连接失败', err);
    }
}); */
app.listen(testip.serveport, testip.ip, () => {
    console.log('正在监听'+testip.serveport, testip.ip);
})
