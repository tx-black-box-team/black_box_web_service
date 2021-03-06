const _ = require('loadsh')
const fs = require('fs')
const $ = require('jquery')

export default class Util {

  public static word: string[] = []

  public static ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
  }

  public static decodeXML = (str: string): string  => {
    if (!str || !str.length) {
        return ''
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return Util.ALPHA_INDEX[s] || s;
    });
  };

  public static response_manage (
    promise: Promise<any>,
    success: Function,
    error: Function = () => {}
  ): Promise<any> {
    return new Promise((resolve: any) => {
      promise.then((result: any) => {
        const data = success(result)
        resolve({
          status: 0,
          msg: 'OK',
          data: data
        })
      }, (error: any) => {
        error()
        resolve({
          status: 1,
          msg: 'ERROR',
          data: error
        })
      }).catch((error: any) => {
        resolve({
          status: 1,
          msg: 'ERROR',
          data: error
        })
      })
    })
  }

  public static getDate() {
    const now = new Date()
    const year = now.getFullYear().toString()
    const old_month = now.getMonth() + 1
    const old_day = now.getDate()
    const month = ((old_month < 10)?('0' + old_month):(old_month)).toString()
    const day = ((old_day < 10)?('0' + old_day):(old_day)).toString()
    return year + month + day
  }

  public static getCode(str: string) {
    let res = ''
    if(str) {
      res = str.substring(19, 25)
    }
    return res
  }

  public static GetDomainName (str: string | string[]) {
    let url: string = str.toString()
    if (url.indexOf('http://') > -1) {
      url = url.replace(/http:\/\//g, '')
    } else if (url.indexOf('https://') > -1) {
      url = url.replace(/https:\/\//g, '')
    }
    if (url.indexOf('/')) {
      url = url.replace(/\//g, '')
    }
    if (url.indexOf(':')) {
      let tmp = url.split(':')
      url = tmp[0]
    }
    return url
  }

  public static getDicWord (): string[] {
    if (!this.word || this.word.length === 0) {
      const data: any = fs.readFileSync(`src/lib/simple-cn`,'utf-8')
      this.word = _.uniq(data.split('\n'))
    }
    return this.word
  }

  public static async asyncForEach(array, callback) {
    for (let index in array) {
      await callback(array[index], index, array)
    }
  }

  public static html_etc (html: string): any {
    return html.replace(/\/body/g, '').split('<body>')[1].replace(/\/script/g, 'script').split('<script')[0]
  }

  public static hero_data_etc (): any {
    const hero_info: any = {}
    try {
      const $d_info = $('.dMain .dInfo')
      hero_info.name = $d_info.find('.sTitle').html()
      hero_info.level = parseInt($d_info.find('.sLev em')[1].innerHTML)
      hero_info.img = $d_info.find('.sImg img').attr('src')
      hero_info.school = $d_info.find('.sExp').children()[0].innerHTML
      hero_info.fwq = $d_info.find('.sExp').children()[1].innerHTML.replace(/&nbsp/g, ' ')
      hero_info.shili = $d_info.find('.sExp').children()[2].innerHTML

      const $d_box = $('.dBox_2 .dBox_2-1 .dBox_2-2 .TableListItem')
      hero_info.zbpj = parseInt($d_box.find('.dEquip_1 .ulList_3 li').children()[1].innerHTML)
      hero_info.rwxw = parseInt($d_box.find('.dEquip_2 .ulList_3 li').children()[1].innerHTML)
      hero_info.qhdj = parseInt($d_box.find('.dEquip_2 .ulList_3 li').children()[13].innerHTML)
      hero_info.tlds = parseInt($d_box.find('.dEquip_2 .ulList_3 li').children()[15].innerHTML)

      hero_info.hp = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_4 li').children().prevObject[1].innerHTML)
      hero_info.mp = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_4 li').children().prevObject[3].innerHTML)
      hero_info.li = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_4 li').children().prevObject[5].innerHTML)
      hero_info.ti = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_4 li').children().prevObject[7].innerHTML)
      hero_info.ming = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_4 li').children().prevObject[9].innerHTML)
      hero_info.ji = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_4 li').children().prevObject[11].innerHTML)
      hero_info.hun = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_4 li').children().prevObject[13].innerHTML)
      hero_info.nian = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_4 li').children().prevObject[15].innerHTML)

      hero_info.min_wg = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_5').children()[1].innerHTML.split('-')[0].replace(/<span>攻力<\/span>/g, ''))
      hero_info.max_wg = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_5').children()[1].innerHTML.split('-')[1])
      hero_info.mingzhong = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_5').children()[2].innerHTML.replace(/<span>命中<\/span>/g, ''))
      hero_info.min_fg = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_5').children()[3].innerHTML.split('-')[0].replace(/<span>法力<\/span>/g, ''))
      hero_info.max_fg = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_5').children()[3].innerHTML.split('-')[1])
      hero_info.zhongji = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_5').children()[4].innerHTML.replace(/<span>重击<\/span>/g, ''))
      hero_info.huixin = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_5').children()[5].innerHTML.replace(/<span>会心一击<\/span>/g, ''))
      hero_info.fushang = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_5').children()[6].innerHTML.replace(/<span>附加伤害<\/span>/g, ''))
      hero_info.shenfa = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_5').children()[8].innerHTML.replace(/<span>身法<\/span>/g, ''))
      hero_info.jianren = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_5').children()[9].innerHTML.replace(/<span>坚韧<\/span>/g, ''))
      hero_info.dingli = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_5').children()[10].innerHTML.replace(/<span>定力<\/span>/g, ''))
      hero_info.zhuxin = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_5').children()[11].innerHTML.replace(/<span>诛心<\/span>/g, ''))
      hero_info.yuxin = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_5').children()[12].innerHTML.replace(/<span>御心<\/span>/g, ''))
      hero_info.wanjun = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_5').children()[13].innerHTML.replace(/<span>万钧<\/span>/g, ''))
      hero_info.tiebi = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_5').children()[14].innerHTML.replace(/<span>铁壁<\/span>/g, ''))
      hero_info.fangyu = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_6').children()[1].innerHTML.replace(/<span>防御<\/span>/g, ''))
      hero_info.huibi = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_6').children()[2].innerHTML.replace(/<span>回避<\/span>/g, ''))
      hero_info.fafang = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_6').children()[3].innerHTML.replace(/<span>法防<\/span>/g, ''))
      hero_info.shenming = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_6').children()[4].innerHTML.replace(/<span>神明<\/span>/g, ''))
      hero_info.huajie = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_6').children()[5].innerHTML.replace(/<span>化解<\/span>/g, ''))
      hero_info.zhibi = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_6').children()[6].innerHTML.replace(/<span>知彼<\/span>/g, ''))
      hero_info.zhuidian = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_6').children()[8].innerHTML.replace(/<span>追电<\/span>/g, ''))
      hero_info.zhouyu = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_6').children()[9].innerHTML.replace(/<span>骤雨<\/span>/g, ''))
      hero_info.jiyu = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_6').children()[10].innerHTML.replace(/<span>疾语<\/span>/g, ''))
      hero_info.mingsi = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_6').children()[11].innerHTML.replace(/<span>明思<\/span>/g, ''))
      hero_info.raoxin = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_6').children()[12].innerHTML.replace(/<span>扰心<\/span>/g, ''))
      hero_info.renhuo = parseInt($d_box.find('.dEquip_2 .dEquips_1 .ulList_6').children()[13].innerHTML.replace(/<span>人祸<\/span>/g, ''))

      const $zb_info = $('.dBox_tc_equip')
      const jhz_list = []
      const lhz_list = []
      hero_info.jhz = 0
      hero_info.lhz = 0

      $zb_info.find('.jhz-box p').children().each((index, item) => {
        jhz_list.push(parseInt(item.style.width) / 8)
      })

      $zb_info.find('.lhz-box p').children().each((index, item) => {
        lhz_list.push(parseInt(item.style.width) / 8)
      })

      for (let i in jhz_list) {
        hero_info.jhz = hero_info.jhz + jhz_list[i]
      }

      for (let i in lhz_list) {
        hero_info.lhz = hero_info.lhz + jhz_list[i]
      }

      hero_info.update_time = $('.dMain .pTab span').html().replace(/数据更新时间：\n\t\t\n\t\t/g, '').replace(/\n\t\t\n\t/g, '')

    } catch(e) {}

    return hero_info
  }
}