function print() {
    for (var i = 0; i < arguments.length; i++) {
        console.log(arguments[i])
    }
    return arguments[0]
}


/**
 * 创建定时任务,将会在一定时间后自行运行
 * @param {*} t 延迟的时间,秒
 * @param {*} cb 要执行的任务
 * @param {Array} arg 需要传递给要运行的函数的参数
 */
function timeRun(t, cb, arg) {
    return new TimeRunClass(t, cb, arg)
}

/**
 * 创建定时任务,将会在一定时间后自行运行
 * @param {*} t 延迟的时间,秒
 * @param {*} cb 要执行的任务
 * @param {Array} arg 需要传递给要运行的函数的参数
 */
class TimeRunClass {
    constructor(t, cb, arg) {
        this.t = t;
        this.cb = cb;
        this.arg = arg;
        this.resolve = null;
        this.reject = null;
        this.timer = setTimeout(
            () => {
                //到时间后自动执行任务,触发一个事件告知任务完成
                this.resolve(this.cb(arg))
            },
            t
        )
        this.promise = new Promise((resolve, reject) => {
            // 任务注册到本机
            // 挂载任务
            this.resolve = resolve;
            this.reject = reject;
        });
        this.cancel = () => {
            clearTimeout(this.timer);
            this.timer = null;
            // 告知成功并且释放内存
            this.resolve();
        }
        this.reset = () => {
            clearTimeout(this.timer);
            this.timer = null;
            this.timer = setTimeout(
                () => {
                    //到时间后自动执行任务,触发一个事件告知任务完成
                    this.resolve(this.cb(arg))
                },
                t
            )
        }
    }
}

/**
 * 字符串添加字符串,在指定的间隔面前
 * @param {String} str 要操作的字符串
 * @param {String} addStr 需要添加的字符串
 * @param {Number} interval 间隔的数量,程序运行间隔
 * @param {Number} startVal 开始记录的下标,便利的起始位置
 * @param {Boolean} executeNow 立即进行添加
 * @param {Boolean} exclude 最后也进行添加
 */
function strAddStr(str, addStr, interval = 1, start, executeNow = false, exclude) {
    start = start || 0
    let resultStr = executeNow ? addStr : ''
    let loopNumber = 0; //从
    let runNumber = 0; //程序一共运行了多少次
    for (var i = start; i < str.length; i++) {
        let tmpStr = str[i];
        loopNumber++;
        runNumber++;
        if (loopNumber == interval) {
            if (runNumber == str.length) {
                tmpStr = exclude ? tmpStr + addStr : tmpStr
                loopNumber = 0
            } else {
                tmpStr += addStr
                loopNumber = 0
            }
        }
        resultStr += tmpStr
    }
    loopNumber = runNumber = null;
    return resultStr
}


/**
 * 将字符串填充至指定长度,前置添加
 * @param {String} str 要被填充的字符串
 * @param {Number} len 字符串长度
 * @param {Number} fillStr 填充的字符串
 */
function fillTo(str, targetLen, fillStr) {
    let strLength = str.length;
    while (true) {
        if (targetLen - str.length <= 0) {
            return str
        } else {
            str = fillStr + '' + str
        }
    }
}

/**
 * 转成buffer数据
 * @param {*} str 
 * @param {*} splitStr 
 */
function toBuffer(str, splitStr = ' ') {
    let _strs = str.split(splitStr);
    for (let i = 0; i < _strs.length; i++) {
        _strs[i] = "0x" + _strs[i];
    } //每个字符加上0x
    return Buffer.from(_strs)
}

function sleep(t) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, t * 1000)
    });
}

module.exports = {
    fillTo,
    strAddStr,
    timeRun,
    print,
    sleep,
    toBuffer
}