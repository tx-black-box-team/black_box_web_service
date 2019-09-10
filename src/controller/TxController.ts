import {NextFunction, Request, Response} from 'express'
import { Controller, Get, Post, Delete} from '../decorators'
const puppeteer = require('puppeteer')
const $ = require('jquery')

@Controller('/local/tx')
export class TxController​​ {
  @Get('/role')
  public async roleAnalysis (request: Request, response: Response, next: NextFunction) {
    const roleId: string = request.query.roleId
    const browser = await (puppeteer.launch())
    const page = await browser.newPage()
    await page.goto(`http://bang.tx3.163.com/bang/role/${roleId}`)
    const dimensions = await page.evaluate((a) => {
      console.log(a)
      return $('body').html()
    })
    browser.close()
    return dimensions
  }
}
