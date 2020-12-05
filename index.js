let udp = require('./udpServer')

let { print, sleep, timeRun } = require('./tools/my')
let map = require('./udpServer')

main()

function main() {
    map.handshake()
    map.searchAllControlling()
    map.openControlling(1)
    map.openControlling(2)
    map.openControlling(3)
    map.openControlling(4)
    map.openControlling(5)
    map.openControlling(6)
}