import * as cheerio from 'cheerio'

export default class Base {
  public person_info: Person_Info
  public equipment_info: Equipment_Info

  constructor () {
    this.person_info = new Person_Info()
    this.equipment_info = new Equipment_Info()
  }

  public parseAttr (html: any) {
    const $ = cheerio.load(html)
    this.person_info = this.get_person_info($)
    this.equipment_info = this.get_equipment_info($)
  }

  public get_person_info ($: any): Person_Info {
    const $attr = $('.dInfo .dInfo_1')
    return new Person_Info(
      $attr.find('.sTitle').text(),
      $attr.find('.simg img').attr('src'),
      $attr.find('.sExp').eq(1).find('a').eq(0).text(),
      $attr.find('.sExp').eq(1).find('a').eq(1).text(),
      Number($attr.find('.sLev em').eq(1).text()) || 0,
      $attr.find('.sExp').eq(0).find('a').text()
    )
  }

  public get_equipment_info ($:any): Equipment_Info {
    const $attr_eq = $('#equipments .dEquip_1 .ulList_3')
    const $attr_xw = $('#equipments .dEquip_2 .ulList_3')
    return new Equipment_Info(
      Number($attr_eq.find('li').eq(0).find('.ulList_3_v').text()),
      Number($attr_eq.find('li').eq(1).find('.ulList_3_v').text()) || '没有上榜',
      Number($attr_eq.find('li').eq(2).find('.ulList_3_v').text()) || '没有上榜',
      Number($attr_eq.find('li').eq(3).find('.ulList_3_v').text()) || '没有上榜',
      Number($attr_xw.find('li').eq(0).find('.ulList_3_v').text()),
      Number($attr_xw.find('li').eq(1).find('.ulList_3_v').text()) || '没有上榜',
      Number($attr_xw.find('li').eq(2).find('.ulList_3_v').text()) || '没有上榜',
      Number($attr_xw.find('li').eq(3).find('.ulList_3_v').text()) || '没有上榜',
      $attr_xw.find('li').eq(4).find('.ulList_3_v').text() || '无',
      $attr_xw.find('li').eq(5).find('.ulList_3_v').text() || '无',
      Number($attr_xw.find('li').eq(6).find('.ulList_3_v').text()) || 0,
      Number($attr_xw.find('li').eq(7).find('.ulList_3_v').text()) || 0,
    )
  }
} 

class Person_Info {
  public name :string
  public mp_img: string
  public fwq: string
  public shili: string
  public level: string | number
  public menpai: string

  constructor (
    name: string = '',
    mp_img: string = '',
    fwq: string = '',
    shili: string = '',
    level: string | number = '',
    menpai: string = ''
  ) {
    [
      this.name,
      this.mp_img,
      this.fwq,
      this.shili,
      this.level,
      this.menpai
    ] = [
      name,
      mp_img,
      fwq,
      shili,
      level,
      menpai
    ]
  }
}

class Equipment_Info {
  public zp: string | number
  public zp_qf_ranking: string | number
  public zp_bf_ranking: string | number
  public zp_mp_ranking: string | number
  public xw: string | number
  public xw_qf_ranking: string | number
  public xw_bf_ranking: string | number
  public xw_mp_ranking: string | number
  public sq_jd: string
  public sq_jj: string
  public qh_level: string | number
  public tl_ds: string | number

  constructor (
    zp: string | number = '',
    zp_qf_ranking: string | number = '',
    zp_bf_ranking: string | number = '',
    zp_mp_ranking: string | number = '',
    xw: string | number = '',
    xw_qf_ranking: string | number = '',
    xw_bf_ranking: string | number = '',
    xw_mp_ranking: string | number = '',
    sq_jd: string = '',
    sq_jj: string = '',
    qh_level: string | number = '',
    tl_ds: string | number = ''
  ) {
    [
      this.zp,
      this.zp_qf_ranking,
      this.zp_bf_ranking,
      this.zp_mp_ranking,
      this.xw,
      this.xw_qf_ranking,
      this.xw_bf_ranking,
      this.xw_mp_ranking,
      this.sq_jd,
      this.sq_jj,
      this.qh_level,
      this.tl_ds
    ] = [
      zp,
      zp_qf_ranking,
      zp_bf_ranking,
      zp_mp_ranking,
      xw,
      xw_qf_ranking,
      xw_bf_ranking,
      xw_mp_ranking,
      sq_jd,
      sq_jj,
      qh_level,
      tl_ds
    ]
  }
}