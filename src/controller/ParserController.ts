import {NextFunction, Request, Response} from 'express'
import { Controller, Get, Post, Delete} from '../decorators'
import ParserService from '../services/parser'
import * as cheerio from 'cheerio'
import { XmlEntities } from 'html-entities'

@Controller('/parse')
export class ParserController {
  private parserService: ParserService
  private decoder: XmlEntities

  constructor () {
    this.parserService = new ParserService()
    this.decoder = new XmlEntities()
  }

  @Get('/base')
  public async getBackground (request: Request, response: Response, next: NextFunction) {
    const ret: string = <string> await this.parserService.parse()
    const filter_str = ret.replace(/\t/g, '')
      .replace(/\n/g, '')
      .replace(/<script(.*)>.*<\/script>/g,'')
      .replace(/>\s+</g, "><")
    const $ = cheerio.load(filter_str)
    return this.character($)
  }

  // 角色信息
  private character ($: any): any {
    const entity: any = {
      equipment : {
        equips: []
      }
    }
    const $character = $('#equipments .equip-box')
    // 装备信息
    $character
      .find('.dEquip_1 .dEquips>div')
      .not('style[visibility=hidden]')
      .each((ind: number, ele: any) => {
        const $ele = $(ele)

        // 装备详情抽取
        const detail = {
          name: '',
          type: '',
          attr: ''
        }
        const $detail = $ele.find('.dBox_tc_equip div')
        detail.name = $detail.find('h3').text()
        detail.type = $detail.find('.eq_type').text()
        detail.attr = this.decoder.decode(
          $detail.find('[name=equip_desc]').attr('tx3text')
        )
        

        entity.equipment.equips.push(
          {
            img: $ele.find('img').attr('src'),
            detail: detail
          }
        )
        // 属性信息
        // $character('.dEquip_2 .dEquips')
    })
    return entity
  }
}