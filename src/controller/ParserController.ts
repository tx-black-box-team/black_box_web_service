import {NextFunction, Request, Response} from 'express'
import { Controller, Get, Post, Delete} from '../decorators'
import ParserService from '../services/parser'
import * as cheerio from 'cheerio'

@Controller('/parse')
export class ParserController {
  private parserService: ParserService

  constructor () {
    this.parserService = new ParserService()
  }

  @Get('/base')
  public async getBackground (request: Request, response: Response, next: NextFunction) {
    const ret: string = <string> await this.parserService.parse()
    const filter_str = ret.replace(/\t/g, '')
      .replace(/\n/g, '')
      .replace(/<script(.*)>.*<\/script>/g,'')
      .replace(/>\s+</g, "><")
    const $ = cheerio.load(filter_str)
    return $('body').html()
  }
}