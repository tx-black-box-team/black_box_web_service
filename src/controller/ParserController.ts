import {NextFunction, Request, Response} from 'express'
import { Controller, Get, Post, Delete} from '../decorators'
import ParserService from '../services/parser'
import * as cheerio  from 'cheerio'

@Controller('/parse')
export class ParserController {
  private parserService: ParserService
cheerio
  constructor () {
    this.parserService = new ParserService()
  }

  @Get('/base')
  public async getBackground (request: Request, response: Response, next: NextFunction) {
    // const ret = await this.parserService.ping()
    const $ = cheerio.load('<div class="main">test</div>')
    return {
      content: cheerio.html($('.main'))
    }
  }
}