import Equipment from './equipment'
import Attribute from './attribute'
import { XmlEntities } from 'html-entities'

export default class Character {
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

  public character ($: any, decoder: XmlEntities): any {
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
        if ($detail.find('h3').text().trim() === '' ) return 

        const detail = new Equipment(
          $detail.find('h3').text(),
          $detail.find('.eq_type').text(),
          $ele.find('img').attr('src'),
          decoder.decode(
            $detail.find('[name=equip_desc]').attr('tx3text')
          )
        )
        detail.parseAttr()

        entity.equipments.push(
          detail
        )
        // 属性信息
        // $character('.dEquip_2 .dEquips')
    })
    return entity
  }
}

class CharacterSummary {}