const dgram = require('dgram');
require('events').EventEmitter.prototype._maxListeners = 50;
const { resolve } = require('path');

// udp连接测试
function print(msg) {
    console.log(...arguments)
    return msg
}
// 使用秒来进行控制
function sleep(s) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, s * 1000)
    })
}




print('--------END--------')


let a = InstructionFactory(6, '2a', [01, 0, 0, 0])
print(a)
print('--------普通的数据生成检测--------')





/**
 * 创建send函数
 * @param {*} address ip地址
 * @param {*} port 端口
 * @returns {Promise} promise文件
 * @returns {} 
 */
function factorySend(address, port) {
    let udp = dgram.createSocket('udp4');
    // 10s后没有消息自动断开连接

    /**
     * 发送消息的函数,必须有返回数据
     * @params {String|Buffer} msg 要发送的数据
     * @params {Number} resultnum 返回的数量
     * @params {Number} timeout 超时时间
     */
    let send = (msg, resultnum = 1, timeout = 10) => {
        timeout *= 1000
        results = []; //返回数据的数组
        return new Promise(async(resolve, reject) => {
            let results = [];
            udp.send(msg, port, address);
            let index = 0; //接收到的数据数量
            let _$tmp_tag;
            //创建定时器任务
            udp.on('message', (msg, rinfo) => {
                print('message');
                index++
                results.push(msg);
                if (index == resultnum) {
                    _$tmp_tag.cancel();
                    resolve(results);
                } else {
                    // 如果没达到指定数量的回复就自动重置任务
                    _$tmp_tag.reset();
                }
            });
            _$tmp_tag = timeRun(timeout, resolve, results)
        });
    }
    return {
        send,
        close: () => {
            return new Promise((resolve, reject) => {
                //关闭连接
                udp.close(() => {
                    resolve()
                })
            });
        }
    }
}










// locationControl(06, 3.57697);

// 任务字典

/**
 * 指令工厂,专门用来生成指令,可以用来直接发送的指令
 */
function InstructionFactory(addr, instruction_chunk, dataArr, read) {
    /** 帧头 */
    let o_i_c = 'ee';
    /** 设备地址 */
    let a_i_c = fillTo(addr, 2, '0');
    /** 指令符 */
    let s_i_c = instruction_chunk;
    if (read) {
        return `${o_i_c}${a_i_c}${s_i_c}0000ed`
    }
    /** 数据长度,参数内容 */
    let n_i_c = fillTo(dataArr.length.toString(16), 4, '0');
    /** 参数内容 */
    let d_i_c;
    print(dataArr);
    dataArr = dataArr.map(item => {
        return fillTo(item, 2, '0');
    });

    let dic_crc = crc16_2(dataArr);
    // print('开始计算crc');
    d_i_c = dataArr.join('');
    // print(d_i_c);
    // print(dic_crc);
    // print('crc计算完毕');
    let c_i_c = `${dic_crc.h.toString('hex')}${dic_crc.l.toString('hex')}`;
    let e_i_c = 'ed';
    let a = strAddStr(`${o_i_c}${a_i_c}${s_i_c}${n_i_c}${d_i_c}${c_i_c}${e_i_c}`, ' ', 2);
    print(a);
    return a;
}

/**
 * 按照顺序依次执行任务,用来简化一些操作
 * @params {any} 
 */
function autoRun() {
    // let arg = task
}



/**
 * 设置电机的具体位置
 * @param {*} addr 
 * @param {*} p 
 * @param {Number} t 总运行时间,毫秒数
 */
function toPosition(handel_fn, addr, p, t = 3000) {
    return new Promise(async(resolve, reject) => {
        //设置位置
        let command_identifier = '07'
        let dataArr = locationControl(p);
        // 设置位置的模式
        //首先获取地址数据
        let gCom = '06'
        let readCom = strAddStr(InstructionFactory(addr, '06', null, true), ' ', 2)
        let r = await handel_fn(
            toBuffer(readCom),
            3,
            4
        )
        if (!r[0]) {
            print('错误的事项');
            resolve(false);
            r = ['EE060A00040100 00 00 01 D8 ED']
                // return
        }
        r = r[0].toString('hex');
        r = (r + '').substring(10, 18);
        r = parseInt(r, 16);
        // 逆解数据得到当前的r值
        r = r / (Math.pow(2, 24));
        // 计算到目标值需要的,分解运动 一定的时间内到达目标值
        let speed = 0.2;
        // 计算函数
        let operatorHandel = r < p ? (a, b) => { return a + b } : (a, b) => { return a - b };
        // 临时位置值,用来记录位置
        tmpr = r;
        print(r)
            // 检测函数
        let checkHandel = r < p ? (ttmmpp) => { return ttmmpp >= p } : (ttmmpp) => { return ttmmpp <= p };

        // 设置梯形模式
        await handel_fn(toBuffer(InstructionFactory(addr, '07', [6])), 1, 2);
        let b = await handel_fn(toBuffer('EE 05 07 00 01 06 3F 42 ED'), 1, 1);
        let a = InstructionFactory(addr, '0a', locationControl(p))

        await handel_fn(toBuffer(a), 1, 0.2);

        // await sleep(20)
        // return resolve()

        print(checkHandel.toString())
        print(operatorHandel)
        return
        while (true) {
            if (checkHandel(tmpr)) {
                break;
            }
            tmpr = operatorHandel(tmpr, speed)
            print('要设置到的位置', tmpr)
            let Tmp_command = InstructionFactory(addr, '0a', locationControl(tmpr))
            print(Tmp_command)
                // await handel_fn(
                //         toBuffer(Tmp_command),
                //         1,
                //         1
                //     )
                // print('指令发送完毕');
        }
        // 计算位置指令

        resolve();
    });
}


let innfos = {
    Instruction: {
        /** 获取指令 */
        setPosition(addr, p) {
            let return_result = 'ee ' + '0' + addr + '0a0004'
            let a = locationControl()
        }
    }
}

// 采用事件注册机制来进行数据获取，即需要获取到多少条数据才行

async function main() {
    let { send, close } = factorySend('192.168.1.30', 2000);
    let a = 'EE 00 44 00 00 ED'
        // 与执行器握手
    let handel = await send(toBuffer(a), 1);
    print(handel);
    await send(toBuffer(InstructionFactory(0, 'fe', [0])), 1, 2);
    //查询执行器
    let result = await send(toBuffer('ee 00 02 00 00 ed', 6, 6));
    print(result);
    //启动执行器
    await send(toBuffer('ee 05 2a 00 01 01 7e 80 ed'), 2, 1);
    print('开始执行任务')
        //设置位置
    let x = 0;
    await toPosition(send, 5, 10);
    print('12222')
        //关闭执行器
    await send(toBuffer(InstructionFactory(5, '2a', [0])), 2, 1)

    close()
    return 0
}

main()