const axios = require('axios')
// const jsdom = require("jsdom")
// const jquery = require('jquery')
// const { JSDOM } = jsdom
const sendNotify = require('./send-msg').sendNotify

async function checkStatus() {
    const baseURL = `https://www.apple.com.cn`
    const URL = `${baseURL}/shop/refurbished/mac`

    const result = await axios.get(URL)

    if (result.status === 200 ) {
        // var $ = jquery(new JSDOM(result.data).window)
        // const window = {}
        // eval($('#refurbished-category-grid').prev().text().trim())

        const htmlData = result.data
        const dataJson = JSON.parse(
                            htmlData.match(/window.REFURB_GRID_BOOTSTRAP = (.+)/g)[0]
                                .replace('window.REFURB_GRID_BOOTSTRAP = ', '')
                                .replace(';', '')
                            )

        // const tiles = window.REFURB_GRID_BOOTSTRAP.tiles
        const tiles = dataJson.tiles


        // 筛选条件，可参考 ./test.json 的格式进行筛选
        const allResult = tiles.filter( t => 
            t.omnitureModel.customerCommitString === "有现货" // 存在库存
            && t.filters.dimensions.tsMemorySize === "16gb" // 内存为 16bg
            && t.filters.dimensions.dimensionRelYear === "2020" // 2020 年发布
            && t.filters.dimensions.refurbClearModel === "macbookair" // 品类为 MacBook Air
            && t.price.seoPrice < 10000  // 10000 元以内
            && t.title.includes('M1') // 是 M1 芯片
            && !t.title.includes('金') // 不是金色
            )

        if (allResult.length > 0) {

            let desp = ''

            allResult.forEach(p => {
                const productType = p.filters.dimensions.refurbClearModel
                const productURL = `https://www.apple.com.cn/shop/product/` + p.omnitureModel.partNumber
                const color = p.title.split(" - ")[1]

                desp += `[${productType} - ${p.omnitureModel.partNumber} - ${color}](${productURL}) \n\n`
            })
            console.log('有货了 \n+' + desp)
            sendNotify('有货了', desp)
            return true
        }
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