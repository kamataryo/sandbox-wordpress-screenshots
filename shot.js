const puppeteer = require('puppeteer')
const { promisify } = require('util')
const fs = require('fs')
const mkdir = promisify(fs.mkdir)

const list = require('./list.json')

const viewport = {
  pc: { width: 1440, height: 900 },
  sp: { width: 414, height: 896 }
}

const getNow = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = ('00' + (now.getMonth() + 1)).slice(-2)
  const day = ('00' + now.getDate()).slice(-2)
  const hour = ('00' + now.getHours()).slice(-2)
  const min = ('00' + now.getMinutes()).slice(-2)
  const sec = ('00' + now.getSeconds()).slice(-2)
  const result = year + month + day + hour + min + sec
  return result
}

const main = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const now = getNow()

  for (let url of list) {
    await page.goto(url)

    const dirname = `_out/${now}/${encodeURIComponent(url)}`
    await mkdir(dirname, { recursive: true })

    await page.setViewport(viewport.pc)
    await page.screenshot({
      path: `${dirname}/pc-${viewport.pc.width}x${viewport.pc.height}.png`
    })

    await page.setViewport(viewport.sp)
    await page.screenshot({
      path: `${dirname}/sp-${viewport.sp.width}x${viewport.sp.height}.png`
    })
  }
  await browser.close()
  process.stdout.write(now)
}

// go!
main()
