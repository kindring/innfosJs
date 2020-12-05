let crc = require('./crc');
let { fillTo, strAddStr } = require('../tools/my');
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
    dataArr = dataArr.map(item => {
        return fillTo(item, 2, '0');
    });

    let dic_crc = crc(dataArr);
    // print('开始计算crc');
    d_i_c = dataArr.join('');
    // print(d_i_c);
    // print(dic_crc)
    // print('crc计算完毕')
    let c_i_c = `${dic_crc.h.toString('hex')}${dic_crc.l.toString('hex')}`;
    let e_i_c = 'ed';
    let a = strAddStr(`${o_i_c}${a_i_c}${s_i_c}${n_i_c}${d_i_c}${c_i_c}${e_i_c}`, ' ', 2);
    return a;
}
// 位置值转换,转换成16进制的值,返回数组
function locationControl(p) {
    p = p * (Math.pow(2, 24));
    p = parseInt(p);
    let a = p.toString(16);
    a = fillTo(a, 8, 0);
    // 分割字符串
    a = strAddStr(a, '*', 2)
    return a.split('*')
}


module.exports.InstructionFactory = InstructionFactory;
module.exports.locationControl = locationControl;