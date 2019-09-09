export const equipment_reg = {
  '可重铸/可重铸': /^.*#G(.*?)#W$/,
  '基础属性': /#W耐久度：(.*?)   品相：#cFFFFFF(.*?)/,
  '使用门派': /#W使用门派：(.*?)/,
  '外观耐久度': /#W#R外观耐久度：(.*?)/,
  '物理攻击力': /#W#cFFFF00物理攻击力：(.*?)(#G\([0-9]*\))*#W#cFFFF00～(.*?)(#G\([0-9]*\))*#W/,
  '法术攻击力': /#W#cFFFF00法术攻击力：(.*?)(#G\([0-9]*\))*#W#cFFFF00～(.*?)(#G\([0-9]*\))*#W/,
  '命中': /#c00AAEE命中+(.*?)(#G\([0-9]*\))*#n/,
  '攻速': /#W攻速：(.*?)/,
  '必要等级': /^.*必要等级：(\d*?)$|^.*必要等级：[#a-zA-Z0-9]+(.+)\s[#a-zA-Z0-9]+(.+)$/,
  '贵重等级': /#W贵重等级：(.*?)/,
  '禁交易': /#R(.*?){ #R(.*?) }*/,
  '蓝属性': /#c00AAEE·*(.*?)/,
  '橙属性': /#cFF8800(.*?)/,
  '紫属性': /#cBB44BB(.*?)/,
  '玄武属性': /#W#cFFFF00(.*?)/,
  '太初特技': /#c02DCDC(.*?)/,
  '特技': /#c00FFFF(.*?)/,
  '鉴定属性': /#c8A00FF(.*?)/,
  '加护值': /#W加护值(.*?)/,
  '炼化': /^.*#G(.*?)#W$/,
  '炼化金属性': /#cffe326(.*)/,
  '炼护值': /#W#w\(7\)炼护值(.*?)/,
  '签名': /#G(.*?)：$/,
  '签名内容': /#cCFB53B#*W*(.*?)/,
  '签名时间': /#c888888(.*?)/,
  '套装部位': /　　(#cFF9966(.*?))+/g,
  '套装属性': /　　#ceeec2b(.*?)/,
  '天魄等级': /#G天魄等级 Lv.(.*?)/,
  '天魄属性': /#c7ecef4·(.*?)/,
  '天魄组合': /#c7ecef4\(#c7ecef4(.*?)#c7ecef4(.*?)\)#c7ecef4(.*?)/
}​