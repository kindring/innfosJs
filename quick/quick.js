// 发送一些指令


// 开启数据监听服务
udp.on('message', (msg, rinfo) => {
    print(msg);
});