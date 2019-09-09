import {NextFunction, Request, Response} from 'express'
import { Controller, Get, Post, Delete} from '../decorators'
import ParserService from '../services/parser'
import * as cheerio from 'cheerio'
import { Character } from '../services/parser/entity'
import { XmlEntities } from 'html-entities'

@Controller('/local/parse')
export class ParserController {
  private parserService: ParserService
  private decoder: XmlEntities

  constructor () {
    this.parserService = new ParserService()
    this.decoder = new XmlEntities()
  }

  @Get('/base')
  public async getBackground (request: Request, response: Response, next: NextFunction) {
    const role_id = request.query.role_id
    const ret: string = <string> await this.parserService.parse(role_id)
    const filter_str = ret.replace(/\t/g, '')
      .replace(/\n/g, '')
      .replace(/<script(.*)>.*<\/script>/g,'')
      .replace(/>\s+</g, "><")
    const $ = cheerio.load(filter_str)
    return new Character().character($, this.decoder)
  }
}
