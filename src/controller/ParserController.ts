import {NextFunction, Request, Response} from 'express'
import { Controller, Get, Post, Delete} from '../decorators'
import ParserService from '../services/parser'
import * as cheerio from 'cheerio'
import equipment from '../services/parser/equipment'
import { XmlEntities } from 'html-entities'

@Controller('/local/parse')
export class ParserController {
  private parserService: ParserService
  private decoder: XmlEntities
  private reg: RegExp = /#[a-zA-Z0-9]+/g

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
    return this.character($)
  }

  // 角色信息
  private character ($: any): any {
    const entity: Character = new Character()
    const $character = $('#equipments .equip-box')
    // 装备信息
    $character
      .find('.dEquip_1 .dEquips>div')
      .not('style[visibility=hidden]')
      .each((ind: number, ele: any) => {
        const $ele = $(ele)

        // 装备详情抽取
        const $detail = $ele.find('.dBox_tc_equip div')
        const detail = new Equipment(
          $detail.find('h3').text(),
          $detail.find('.eq_type').text(),
          $ele.find('img').attr('src'),
          this.decoder.decode(
            $detail.find('[name=equip_desc]').attr('tx3text')
          )
        )

        let attrs: any = detail.attr.split('#r')

        if (attrs.length > 1) {
          attrs = equipment.reg_field(attrs)
          // attrs = equipment.field_parse_block(attrs)
          // attrs = equipment.field_parse_colon(attrs)
        }
        
        detail.attr = attrs

        entity.equipments.push(
          detail
        )
        // 属性信息
        // $character('.dEquip_2 .dEquips')
    })
    return entity
  }
}

class Character {
  public equipments: Equipment[]
  public attributes: Attribute[]
  public summary: CharacterSummary

  constructor (equipments: Equipment[] = [], attributes: Attribute[] = [], summary: CharacterSummary = null ) {
    [
      this.equipments,
      this.attributes,
      this.summary
    ] = [
      equipments,
      attributes,
      summary
    ]
  }
}

class Equipment {
  public name: string
  public type: string
  public img: string
  public attr: string

  constructor (name: string = '', type: string = '', img: string = '', attr: any = '') {
    [
      this.name,
      this.type,
      this.img,
      this.attr
    ] = [
      name,
      type,
      img,
      attr
    ]
  }
}

class Attribute {}
class CharacterSummary {}
