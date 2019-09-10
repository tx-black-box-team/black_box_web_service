
import * as $ from 'cheerio'
import { JSDOM } from 'jsdom'
const { document } = (new JSDOM()).window

function shallow_copy(obj){
  let new_obj = {};
  for (let p in obj){
      new_obj[p] = obj[p];
  }
  return new_obj;
}


function split_with_capture(s, pattern){
  // for ie6 compatibility
  let segs = [];
  while (1){
      let m = pattern.exec(s);
      if (!m){
          segs.push(s);
          break;
      }
      segs.push(s.substr(0, m.index));
      for (let i=1;i<m.length;i++){
          segs.push(m[i]);
      }
      s = s.substr(m.index + m[0].length);
  }
  return segs;
}

export function text2html(text, cfg, ROOT = undefined): string{
	let $root = ROOT
	if (!$root) {
		$root = $(document.createElement('div').outerHTML)
	}
	
  cfg = cfg || {};
  // translating tx3 texts to html
  let p = /#([RGBYPWsbuhnr]|c[0-9A-Za-z]{6}|[0-9]{1,3}|wing[0-9]{1,3})/;
	//let segs = text.split(p);
	let segs = split_with_capture(text, p);
  let colors = {
      "R": "red",
      "G": "green",
      "B": "blue",
      "Y": "yellow",
      "P": "pink",
      "W": "white",
      "K": "black"
  };
  let seg_config = {};
  let data = [];
  for (let i=0;i<segs.length;i++){
      if ((i&1) == 0){
          // no matched, i.e. text
          //alert(segs[i]);
          if (segs[i].indexOf('加护值')!=-1){
              if (segs[i].indexOf('^')!=-1){
                  seg_config['jiahuzhi']=segs[i];
                  data.push([shallow_copy(seg_config), '']);
                  delete seg_config['jiahuzhi'];
                  //alert(segs[i]);
              }
          }else if (segs[i].indexOf('^83')!=-1){
              continue;
          }else if (segs[i].indexOf('临时加护')!=-1){
              if (segs[i].indexOf('^')!=-1){
                  seg_config['linshijiahu']=segs[i];
                  data.push([shallow_copy(seg_config), '']);
                  delete seg_config['linshijiahu'];
              }

          }else if (segs[i].indexOf('炼护值')!=-1){
              if (segs[i].indexOf('^')!=-1){
                  seg_config['lianhuzhi']=segs[i];
                  data.push([shallow_copy(seg_config), '']);
                  delete seg_config['lianhuzhi'];
                  //alert(segs[i]);
              }else{
                  segs[i]=segs[i].replace('#w(7)','');
                  segs[i]=segs[i].replace('#w(0)','');
                  data.push([shallow_copy(seg_config), segs[i]]);
              }
          }
          else{
              data.push([shallow_copy(seg_config), segs[i]]);
          }
          continue;
			}

      // matches
      if (segs[i] in colors){
          seg_config["color"] = segs[i];
      }else if (segs[i].charAt(0) == "c"){
          seg_config["color"] = "#" + segs[i].substr(1);
      }else if (segs[i] == "s"){
          seg_config["shake"] = true;
      }else if (segs[i] == "b"){
          seg_config["blink"] = true;
      }else if (segs[i] == "u"){
          seg_config["underline"] = true;
      }else if (segs[i] == "h"){
          seg_config["hide"] = true;
      }else if (segs[i] == "n"){
          seg_config = {};
      }else if (segs[i] == "r"){
          seg_config["br"] = true;
          data.push([shallow_copy(seg_config), ""]);
          delete seg_config['br'];
      }else if (segs[i].match(/^\d+$/)){
          seg_config["img"] = true;
          data.push([shallow_copy(seg_config), "http://res.tx3.netease.com/qt/12/bang/images/baozi/" + parseInt(segs[i], 10) + ".gif"]);
          delete seg_config['img'];
      }else if (segs[i].match(/^wing\d+$/)){
          //console.log(segs[i])
          seg_config["img"] = true;
          data.push([shallow_copy(seg_config), "http://res.tx3.netease.com/qt/12/bang/images/child/" + parseInt(segs[i].replace('wing',''), 10) + ".png"]);
          delete seg_config['img'];
      }
	}

  let previous_contains_new_line = true; // whether previous newline-and-empty block contains new line?
  for (let i=0;i<data.length;i++){
		let seg_config = data[i][0];
		let seg = data[i][1];
		if (seg_config["br"]) {
				if (cfg["compact"] && previous_contains_new_line){
						continue;
				}
				$root.append('<br/>');
				previous_contains_new_line = true;
		} else if (seg_config["img"]) {
				let img = document.createElement("img");
				// better images?
				img.src = seg;
				if(seg.match('res.tx3.netease.com/qt/12/bang/images/child/')){
						img.className = 'wing-img';
				}
				$root.append(img.outerHTML);
				previous_contains_new_line = false;
		} else if (seg_config["linshijiahu"]) {
				seg = seg_config["linshijiahu"];
				let linshijiahu_div = document.createElement("div");
				let show_text = '<span class="jiaHuZhi">临时加护:</span>'+
										'<span class="percentFornt2" style="width:'+3*8+'px"></span></p>'+
										'<br/>';
				const $tag = $(linshijiahu_div.outerHTML)
				$tag.html(show_text);
				$tag.attr('class','jhz-box');
				$root.append($.html($tag));

		} else if (seg_config["jiahuzhi"]) {
				seg = seg_config["jiahuzhi"];
				let all_tag = seg.split("^").length-1;
				let last_tag = seg.split("^84").length-1;
				let show_tag = all_tag-last_tag;

				let jiahu_div = document.createElement("div");
				let show_text = '<span class="jiaHuZhi">加护值:</span>'+
										'<p class="percentBg" style="width:'+all_tag*8+'px">'+
										'<span class="percentFornt" style="width:'+show_tag*8+'px"></span></p>'+
										'<br/>';
				const $tag = $(jiahu_div.outerHTML)
				$tag.html(show_text);
				$tag.attr('class','jhz-box');
				$root.append($.html($tag));

		} else if (seg_config["lianhuzhi"]) {
				seg = seg_config["lianhuzhi"];
				let all_tag = seg.split("^").length-1;
				let last1_tag = seg.split("^92").length-1;
				let last2_tag = seg.split("^93").length-1;
				let last_tag = last1_tag+last2_tag;
				let show_tag = all_tag-last_tag;

				let lianhu_div = document.createElement("div");
				let show_text = '<span class="jiaHuZhi">炼护值:</span>'+
										'<p class="percentBg" style="width:'+all_tag*8+'px">'+
										'<span class="percentFornt" style="width:'+show_tag*8+'px"></span></p>'+
										'<br/>';
				const $tag = $(lianhu_div.outerHTML)
				$tag.html(show_text);
				$tag.attr('class','lhz-box');
				$root.append($.html($tag));
		} else {
			// texts only
			if (!seg.replace(/ +/g, "")){
					if (cfg["compact"] && previous_contains_new_line) {
							continue;
					}
			}else{
					previous_contains_new_line = false;
			}
			
			let $span = $(document.createElement('span').outerHTML)
			$span.text(seg);
			for (let n in seg_config){
				if (n == "color"){
						if (!seg_config["hide"]){
								// hide will overwrite the color
								if (seg_config[n].charAt(0) != "#"){
										//$(span).css({"color": colors[n]});
									$span.addClass(colors[seg_config[n]]);
								}else{
									$span.css({"color": seg_config[n]});
								}
						}
				}else{
					$span.addClass(n);
				}
			}
			$root.append($.html($span));
		}
	}
	return $root.html()
}
