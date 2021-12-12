// 基础模块
const express = require('express');
const app = express();

// ip配置提取自前端api
const testip = require('./runIpPort')

// 使用cors模块解决跨域问题
const cors = require('cors');
app.use(cors());

// api模块化
const { read } = require('./flimPromis/_read');
const { write } = require('./flimPromis/_write');
const { _delete } = require('./flimPromis/_delete');
const { revise } = require('./flimPromis/_revise');
const { userOnLine } = require('./flimPromis/_userKey')
const { registered } = require('./commonfilm/registered')

// 接收write请求并写入对应用户数据库
write(app);

// 接收read请求
read(app);

// 接收delete请求
_delete(app)

// 接收revise请求
revise(app)

// 接收用户登录请求
userOnLine(app)

// 接收用户注册请求
registered(app)



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
