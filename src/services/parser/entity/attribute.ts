import * as cheerio from 'cheerio'

export default class Attribute {
  public attr: Map<string, any> | object
  public rank: Map<string, any> | object

  constructor () {
    this.attr = {}
    this.rank = {}
  }

  public parseAttr (html: any) {
    const $ = cheerio.load(html)
    this.attr = this.getAtt($)
  }

  public getAtt ($: any) {
    const $attrs = $('.dEquips_1')

    // 基本属性
    const attrs = []
    $attrs.find('.ulList_4 li').each((ind: number, ele: any) => {
      if (ind % 2 === 0 ) {
        attrs.push({key: $(ele).text()})
      } else {
        attrs[attrs.length - 1].value = $(ele).text()  
      }
    })

    // console.log(...attrs.map((item) => ({[item.key]: item.value})))
    // 攻击属性
    const $attack = $attrs.find('.ulList_5.ulList_h li')
    const attack = this._extractAttr($, $attack)

    // // 防御属性
    const $defend = $attrs.find('.ulList_6.ulList_h li')
    const defend = this._extractAttr($, $defend)

    // 抗性与特殊属性
    const $special = $attrs.find('.ulList-box .ulList_5 li')
    const special = this._extractAttr($, $special)

    // 高级属性
    const $advance = $attrs.find('.ulList-box .ulList_6 li')
    const advance = this._extractAttr($, $advance)

    const ret = {
      ...attack,
      ...defend,
      ...special,
      ...advance,
      ...attrs.reduce((acc, cur) => {
        acc[`${cur['key']}`] = cur['value']
        return acc
      }, {})
    }

    return ret
  }

  private _extractAttr ($:any, $html: any) {
    const dict: any = {}
    const key = $html.eq(0).text()
    dict[key] = {}

    $html.slice(1).each((ind: number, ele: any) => {
      let $eles = $(ele).contents()
      dict[key][$eles.eq(0).text()] = $eles.eq(1).text()
    })
    return dict
  }

  public getRank ($: any) {

  }
}