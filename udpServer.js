// 创建服务监听数据
const dgram = require('dgram');

const instructionFactory = require('./InstructionFactory/factory')
let { toBuffer, strAddStr, fillTo, timeRun, print } = require('./tools/my')
let udp = dgram.createSocket('udp4');

let RemoteAddress = '192.168.1.30'
let RemotePort = 2000


let data = {
    msgHistorys: [{
            pattern: 0, // 模式,发送或者接收到
            msg: toBuffer('ee 02 01 ed'), //信息的buffer信息
        },
        {

        }
    ],
    /**
     * 控制器列表,通过存储控制器的消息
     */
    controlling: [{
        id: 1
    }]
}

let map = {
        handshake,
        openControlling,
        closeConrolling,
        closeAllControlling,
        searchAllControlling,
    }
    // 开启数据监听服务
udp.on('message', (msg, rinfo) => {
    print('收到了客户端的消息', msg);
    // 解析执行器信息
    parserMsg(msg);
})

/**
 * 发送数据
 */
function sendHandel(msg) {
    msg = strAddStr(msg, ' ', 2)
    msg = toBuffer(msg)
    udp.send(msg, RemotePort, RemoteAddress)
}
/**
 * 与机械臂进行握手
 */
function handshake() {
    let i = instructionFactory.InstructionFactory(0, '44', null, true);
    print(i)
    sendHandel(i);
}

/**
 * 开启指定执行器
 * @param {Number} addr 执行器地址 
 */
function openControlling(addr) {
    let i = instructionFactory.InstructionFactory(addr, '2a', ['01'])
    sendHandel(i)
}

/**
 * 关闭指定执行器
 * @param {*} addr 
 */
function closeConrolling(addr) {
    let i = instructionFactory.InstructionFactory(addr, '2a', ['00']);
    sendHandel(i)
}

/**
 * 
 */


/**
 * 查询所有的控制器
 */
function searchAllControlling() {
    let i = instructionFactory.InstructionFactory(00, '02', null, true);
    sendHandel(i)
}

function parserMsg(msg) {
    let str = msg.toString('hex')
        // ee0502
    print(str)
    let model_instruciton_chunk = (str + '').substring(4, 6);
    print('指令类别:', model_instruciton_chunk);
    switch (model_instruciton_chunk) {
        case '02':
            print('执行器消息返回消息');
            // 解析具体消息
            parserControllingData(str);
            break;
        case '':
            print('kong')
            break;
    }
}

/**
 * 解析控制器数据
 */
function parserControllingData(msg) {
    //获取执行器地址
    let controllingAddress = (msg + '').substring(2, 4);
    let mode_instruction = (msg + '').substring(4, 6);
    let dataNum = (msg + '').substring(6, 10);
    // 数据长度,字节数量,需要进行翻倍操作
    dataNum = parseInt(dataNum, 16);

    let data = (msg + '').substring(10, 10 + (dataNum * 2));
    print(data)
        // 解码数据
    data = parseInt(data, 16)
    print(data)
}

/**
 * 获取控制器的信息
 */
function getControllingMode(addr) {
    let i = instructionFactory.InstructionFactory(addr)
}


/**
 * 关闭所有的控制器
 */
function closeAllControlling() {

}
module.exports = map;