import { equipment_reg } from '../../reg_utils'

export default class Equipment​ {
  public static reg_base1: RegExp = /#W#G(.*?)#W/g
  public static reg_base2: RegExp = /#G(.*?)#W/g
  public static reg_base3: RegExp = /#W(.*?)/g
  public static reg_base4: RegExp = /#W#w(.*?)/g


  public static field_parse_block (res: string[]) {
    let result: string[] = []

    result = res.reduce((acc, item) => {
      return [...acc, ...item.toString().trim().split(' ')]
    }, []).filter(item => item)

    return result
  }

  public static reg_field (res: string[]) {
    return res.reduce((acc: any, cur: string) => {
      let filed: any
      filed = {}
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

  public static field_parse_colon (res: string[]) {
    
  }
}​