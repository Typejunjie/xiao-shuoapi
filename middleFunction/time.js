/* 
传入当前时间打印函数保证事件为现在
函数只对当前时间的内容进行处理并返回一个Array，['年', '月', '日']

*/

function time() {
    let timeArray = Date().split(" ");
    switch (timeArray[1]) {
        case "Jan":
            timeArray[1] = "1";
          break;
        case "Feb":
            timeArray[1] = "2";
          break;
        case "Mar":
            timeArray[1] = "3";
          break;
        case "Apr":
            timeArray[1] = "4";
          break;
        case "May":
            timeArray[1] = "5";
          break;
        case "Jun":
            timeArray[1] = "6";
          break;
        case "Jul":
            timeArray[1] = "7";
          break;
        case "Aug":
            timeArray[1] = "8";
          break;
        case "Sept":
            timeArray[1] = "9";
          break;
        case "Oct":
            timeArray[1] = "10";
          break;
        case "Nov":
            timeArray[1] = "11";
          break;
        case "Dec":
            timeArray[1] = "12";
          break;
        default:
            timeArray[1] = "未获取";
      }
  return [timeArray[3], timeArray[1], timeArray[2], timeArray[4]]
}

exports.time = time
