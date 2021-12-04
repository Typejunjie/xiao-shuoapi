// 发送数据操作的封装

function send (res,obj)  {
    res.send(JSON.stringify(obj))
}
exports.send = send
