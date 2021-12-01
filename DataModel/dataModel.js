/* 
对数据模型的定于，用于对集合中的数据的约束对象
*/
const mongoose = require('mongoose');

// 测试数据模型
let datamodel = new mongoose.Schema({
    writeday: Array,
    type: String,
    content: String,
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

exports.datamodel = datamodel
exports.userModel = userModel