import { equipment_reg } from '../../../reg_utils'
import { text2html } from '../../../reg_utils/text2html'
import utils  from '../../../util'

export default class Equipment {
  public name: string
  public type: string
  public img: string
  public attr: string
  public html: string
  public id: string
  public level_str: string
  private isParsed: boolean


  constructor (name: string = '', type: string = '', img: string = '', attr: any = '', id: string= '', level_str: string = '') {
    [
      this.name,
      this.type,
      this.img,
      this.attr,
      this.isParsed,
      this.id,
      this.level_str
    ] = [
      name,
      type,
      img,
      attr,
      false,
      id,
      level_str
    ]
  }

  public parseAttr () {
    if (!this.isParsed) {
      // html
      this.html = utils.decodeXML(text2html(this.attr, { "compact": true }))

      let attrs: any =  this.attr.split('#r')
      attrs.length > 1 &&
      (
        (attrs = this.reg_field(attrs))
      )
      this.attr = attrs
    }

    this.isParsed = true
    return this.attr

  }

  public field_parse_block (res: string[]) {
    let result: string[] = []

    result = res.reduce((acc, item) => {
      return [...acc, ...item.toString().trim().split(' ')]
    }, []).filter(item => item)

    return result
  }

  public reg_field (res: string[]) {
    return res.reduce((acc: any, cur: string) => {
      let filed: any = {}
      Object.keys(equipment_reg).map((item: string) => {
        const reg: RegExp = equipment_reg[item]
        if (reg.test(cur)) {
          let value: string | boolean = cur.replace(reg, '$1^/^$2^/^$3')
          value.indexOf('^/^') > -1 && (value = value.replace(/\^\/\^/g, ''))
          value.indexOf('$3') > -1 && (value = value.replace(/\$3/g, ''))
          value.indexOf('$2') > -1 && (value = value.replace(/\$2/g, ''))
          value.indexOf('$1') > -1 && (value = true)
          if (!acc[item]) {
            filed[item] = value
          } else if (typeof acc[item] === 'string' || typeof acc[item] === 'boolean') {
            filed[item] = [acc[item], value]
          } else if (typeof acc[item] === 'object') {
            filed[item] = [...acc[item], value]
          }
        }
      })
      return {
        ...acc,
        ...filed
      }
    }, [])
  }

  private  field_parse_colon (res: string[]) {}
}
