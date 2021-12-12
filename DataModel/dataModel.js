/* 
对数据模型的定于，用于对集合中的数据的约束对象
*/
const mongoose = require('mongoose');

// 测试数据模型
let datamodel = new mongoose.Schema({
    writeday: Array,
    type: String,
    content: String,
    contentHead: String,
    username: String,
    contentLength: Number,
});
// 用户注册数据模型
let userModel = new mongoose.Schema({
    UID: Number,
    username: String,
    password: String,
    createDay: Array,
    power: Number,
    newOnLine: Array,
    dataCorrent: Number,
    historySearch: Array,
})
// 用户临时密钥
let userKey = new mongoose.Schema({
    username: String,
    password: String,
    Key: Number,
});


exports.datamodel = datamodel
exports.userModel = userModel
exports.userKey = userKey