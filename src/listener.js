'use strict'

const pull = require('pull-stream')
const lp = require('pull-length-prefixed')

const msg = require('./message')

module.exports = (conn, pInfoSelf) => {
  // send what I see from the other + my Info
  conn.getObservedAddrs((err, observedAddrs) => {
    if (err) { return }
    observedAddrs = observedAddrs[0]

    let publicKey = new Buffer(0)
    if (pInfoSelf.id.pubKey) {
      publicKey = pInfoSelf.id.pubKey.bytes
    }

    const msgSend = msg.encode({
      protocolVersion: 'ipfs/0.1.0',
      agentVersion: 'na',
      publicKey: publicKey,
      listenAddrs: pInfoSelf.multiaddrs.map((ma) => ma.buffer),
      observedAddr: observedAddrs ? observedAddrs.buffer : new Buffer('')
    })

    pull(
      pull.values([msgSend]),
      lp.encode(),
      conn
    )
  })
}
