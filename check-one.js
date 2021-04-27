const axios = require('axios')
const sendNotify = require('./send-msg').sendNotify

async function checkStatus() {
    const name = `G1274CH/A` // 型号，这里默认 G1274CH/A Air 星空灰 16+256
    const appleUrl = `https://www.apple.com.cn/shop/buyability-message?parts.0=${name}`

    const result = await axios.get(appleUrl)
    if (result.status === 200 
        && result.data.head.status === "200" 
        && result.data.body.content.buyabilityMessage.sth[name].isBuyable) {
            let desp = `[${productType}](https://www.apple.com.cn/shop/product/${name})`
            sendNotify('有货了', desp)
            return true
    }
    
    return false
}

let isFinish = false
let sum = 0
const delayTime = 1000 * 60 // 每隔 60 秒查询一次

var interval = setInterval(async function(){
    sum += 1
    isFinish = await checkStatus()
    console.log(`查询次数 ${sum}，${new Date().toLocaleString()}`)

    if(isFinish){
        clearInterval(interval)
    }
}, delayTime);