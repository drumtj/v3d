
export function $(selector){
  return Array.from(document.querySelectorAll(selector));
}

// let isFullscreen;
export function fullscreen(element?) {
  let promise;
  if(element === null || element === false){
    if ( fullscreen.isFullscreen() ) {
      if (document['exitFullscreen']){
    		promise = document['exitFullscreen']();
    	}else if(document['cancelFullScreen']) {
    		promise = document['cancelFullScreen']();
    	} else if(document['webkitExitFullscreen'] ) {
    		promise = document['webkitExitFullscreen']();
    	} else if(document['mozCancelFullScreen']) {
    		promise = document['mozCancelFullScreen']();
    	} else if (document['msExitFullscreen']) {
        promise = document['msExitFullscreen'](); // IE
    	}
    }
    // console.error(fullscreen);
    // fullscreen.isFullscreen = false;
  }else{
    if(element === true || element === undefined){
      // element = document.documentElement;
      //for ie
      element = document.body;
    }else if(typeof element === "number" || typeof element === "string"){
      throw "wrong param";
    }

  	if(element['requestFullscreen']) {
  		promise = element['requestFullscreen']();
  	} else if(element['webkitRequestFullscreen'] ) {
  		promise = element['webkitRequestFullscreen']();
  	} else if(element['mozRequestFullScreen']) {
  		promise = element['mozRequestFullScreen']();
  	} else if (element['msRequestFullscreen']) {
  		promise = element['msRequestFullscreen'](); // IE
  	}
    // fullscreen.isFullscreen = true;
  }

  return promise || Promise.resolve();
}

fullscreen.elementHistory = [];

fullscreen.history = function(element?){
  if(typeof element === "number" && element<0){
    let n = element, l = fullscreen.elementHistory.length;
    let i = l-n;
    let target = fullscreen.elementHistory[i];
    fullscreen.elementHistory = fullscreen.elementHistory.slice(0, i);
    if(target){
      return fullscreen(element);
    }else{
      return fullscreen(false);
    }
  }else{
    fullscreen.elementHistory.push(element);
    return fullscreen(element);
  }
}

fullscreen.historyToggle = function(element?){
  if(fullscreen.getElement() === element){
    fullscreen.history(-1);
  }else{
    fullscreen.history(element);
  }
}

fullscreen.toggle = function(element?){
  // if(element){
  //   return fullscreen(element);
  // }else{
  //   return fullscreen(!fullscreen.isFullscreen()?element:null);
  // }
  return fullscreen(!fullscreen.isFullscreen()?element:null);
}

fullscreen.getElement = function(){
  return document['fullscreenElement'] ||
       document['webkitFullscreenElement'] ||
       document['mozFullScreenElement'] ||
       document['msFullscreenElement'];
};

var fullscreenEvents = {
  "change": [
    'fullscreenchange',
    'webkitfullscreenchange',
    'mozfullscreenchange',
    'MSFullscreenChange'
  ]
}

var fullscreenEventCbs = {
  "change": []
}

fullscreen.on = function(ev, cb, capture?){
  // console.error(fullscreenEvents, ev);
  if(fullscreenEvents[ev]){
    fullscreenEventCbs[ev].push(cb);
    // console.error(fullscreenEvents[ev](), cb);
    fullscreenEvents[ev].forEach(event=>{
      document.addEventListener(event, cb, capture);
    })
  }
}

fullscreen.off = function(ev, cb?){
  if(fullscreenEvents[ev]){
    if(cb){
      fullscreenEvents[ev].forEach(event=>{
        document.removeEventListener(event, cb);
      })
      let i = fullscreenEventCbs[ev].indexOf(cb);
      if(i > -1){
        fullscreenEventCbs[ev].splice(i, 1);
      }
    }else{
      fullscreenEventCbs[ev].forEach(cb=>{
        fullscreenEvents[ev].forEach(event=>{
          document.removeEventListener(event, cb);
        })
      })
      fullscreenEventCbs[ev] = [];
    }
  }
}

fullscreen.isFullscreen = function(){
  return !!fullscreen.getElement();
};



export function loadCSS(url){
  if(!window['_loadedCss']) window['_loadedCss'] = {};
  if(window['_loadedCss'][url]) return;
  window['_loadedCss'][url] = 1;
  // return new Promise(resolve=>{
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  // })
}

export const clipboard = {
  // warning: Firefox needs a proper event to work
  //          such click or mousedown or similar.
  copy(text)
  {
    const selection = document.getSelection();
    const selected = selection.rangeCount > 0 ?
                      selection.getRangeAt(0) : null;
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.cssText = "position:fixed;top:-999px";
    document.body.appendChild(el).select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected)
    {
      selection.removeAllRanges();
      // simply putting back selected doesn't work anymore
      const range = document.createRange();
      range.setStart(selected.startContainer, selected.startOffset);
      range.setEnd(selected.endContainer, selected.endOffset);
      selection.addRange(range);
    }
  },
  // optionally accepts a `paste` DOM event
  // it uses global clipboardData, if available, otherwise.
  // i.e. input.onpaste = event => console.log(dom.clipboard.paste(event));
  paste(event?)
  {
    if (!event)
      event = window;
    const clipboardData = event.clipboardData || window['clipboardData'];
    return clipboardData ? clipboardData.getData("text") : "";
  }
}


// export function perfectClone(el){
//   return new DomScreenshot().node;
// }

export function domParse(html){
  return new DOMParser().parseFromString(html, "text/html");
}
// const domParser = new DOMParser();
// const renderHtml = (html):any =>{
//   let body = domParser.parseFromString(html, "text/html").body;
//   let child = body.firstChild;
//   body.innerHTML = '';
//   return child;
// }

export function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

}

export function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}



export function blobToDataURL(blob) {
  return new Promise(resolve=>{
    var a = new FileReader();
    a.onload = function(e) {
      resolve(e.target.result);
    }
    a.readAsDataURL(blob);
  })
}

export function arrayBufferToBlob(buffer, type) {
  return new Blob([buffer], {type: type});
}

export function blobToArrayBuffer(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      resolve(reader.result);
    });
    reader.addEventListener('error', reject);
    reader.readAsArrayBuffer(blob);
  });
}

export namespace math {
  export function getDeg(x1, y1, x2, y2){
    return Math.atan2(x2 - x1, y2 - y1) * 180 / Math.PI;
  }
  export function getRad(x1, y1, x2, y2){
    return Math.atan2(x2 - x1, y2 - y1);
  }
  export function getCoord(angle:number, distance:number):{x:number, y:number}{
    angle = Math.PI * angle / 180;   //    각도를 라디안으로 바꾼다.
    return {x: distance * Math.cos(angle), y: distance * Math.sin(angle)};
  }
  export function degToRad(degree:number):number{
     return degree*Math.PI/180;
  }
  export function radToDeg(radian:number):number{
     return radian*180/Math.PI;
  }
  export function distance(x1:number, y1:number, x2:number, y2:number):number{
    return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
  }
  export function normalRad(rad){
    return Math.atan2(Math.sin(rad), Math.cos(rad));
  }
  export function randInt(low, high){
    return Math.floor(Math.random() * (high-low) + low);
  }
  export function randFloat(low, high){
    return Math.random() * (high-low) + low;
  }
}

// export function getDistanceContentMaxRender(){
//   if(isMobile()){
//     return CONTAINER_MAX_RENDER_DISTANCE_MOBILE-2000;
//   }else{
//     return CONTAINER_MAX_RENDER_DISTANCE-2000;
//   }
// }




export function getStringNumber(n, count){
  let t = n.toString();
  if(count - t.length > 0){
    return '0'.repeat(count-t.length) + t;
  }else{
    return t;
  }
}

export function getDateString(d){
  return d.getFullYear() + "-" + getStringNumber(d.getMonth()+1, 2) + "-" + getStringNumber(d.getDate(), 2);
}



export function getParamString(obj){
  return Object.keys(obj).map(k=>k+'='+(obj[k]!==undefined?obj[k]:'')).join('&');
}


export function cloneWithCrop(node, h){
  // console.error("cloneWithCrop", h, node.innerHTML);
  let list = node.childNodes;
  let el, l = list.length, elList = [];

  /// textNode는 offset을 계산할 수 없으니 textNode을 가진 tag면 deep clone
  for(let i=0; i<l; i++){
    if(list.item(i) instanceof Text){
      return node.cloneNode(true);
    }
  }


  let con = node.cloneNode();
  // console.error(this.el_container.lastElementChild.offsetTop + this.el_container.lastElementChild.offsetHeight);
  // console.error("-----------")
  let hList = [];
  //높이측정 부정확함 일단 200으로 떼움
  // let margin_h = 0;
  for(let i=0; i<l; i++){
    el = list.item(i);
    // console.error("top", el, el.offsetTop);
    if(el.offsetTop < h){
      // console.error("push", el, el.offsetTop, el.offsetHeight);
      if(h < el.offsetTop + el.offsetHeight){
        // console.error("nextCrop");
        hList[elList.length] = true;
        //hList[elList.length] = h - el.offsetTop;
        // el.dataset.cropH = h - el.offsetTop + 0;
      }
      // console.error(el, el.offsetTop, el.offsetHeight);
      elList.push(el);
    }else{
      break;
    }
    // if(el.offsetTop > h * 2){
    //   break;
    // }
    // addHLine(node.parentElement, el.offsetTop);
    // addHLine(node.parentElement, el.offsetTop + el.offsetHeight);
  }
  l = elList.length;
  for(let i=0; i<l; i++){
    if(typeof hList[i] !== "undefined"){
      // console.error(h, "==", hList[i]);
      con.appendChild(cloneWithCrop(elList[i], h));//hList[i]));
    }else{
      con.appendChild(elList[i].cloneNode(true));
    }
    // el = elList[i].cloneNode(true);
    // con.appendChild(el);
    // if(elList[i].tagName == "IMG"){
    //   el.originTag = elList[i];
    // }
  }

  return con;
}

export function hasScroll(el){
  if(el){
    // console.error(el.scrollHeight, el.clientHeight);
    return el.scrollHeight > el.clientHeight;
  }
  return null;
}

export function getCumputedProperty(el, cssName){
  return window.getComputedStyle(el, null).getPropertyValue(cssName);
}


export function isDataUrl(url: string): Boolean {
  return url.search(/^(data:)/) !== -1
}

export function toDataURL(content: string, mimeType: string): string {
  return `data:${mimeType};base64,${content}`
}

export function getDataURLContent(dataURL: string): string {
  return dataURL.split(/,/)[1]
}

export function delay(n){
  return new Promise(resolve=>setTimeout(resolve, n));
}

export function getDataURLFromBlobURL(url){
  return window.fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    }))
    .then(getDataURLContent)
    .catch(() => Promise.reject())
}

export function loadBlob(url){
  return window.fetch(url).then(response => response.blob());
  // return new Promise(resolve=>{
  //   var xhr = new XMLHttpRequest();
  //   xhr.open('GET', url, true);
  //   xhr.responseType = 'blob';
  //   xhr.onload = function(e) {
  //     if (this.status == 200) {
  //       resolve(this.response);
  //     }
  //   };
  //   xhr.send();
  // })
}

// 퍼포먼스상 안쓸것같아서 지움
// export async function convertWebfontImage(node){
//   return html2canvas(node, {
//     backgroundColor: null,
//     //img tag를 node에서 지워줬지만 중복로딩이 발생. 이것을 해야 발생하지 않음
//     ignoreElements:el=>el.tagName==="IMG"
//   }).then(canvas=>{
//     return canvas;
//   })
// }



export function getAbsolutePosition(el, rel?){
  let tRect, iRect = el.getBoundingClientRect();
  if(rel){
    if(rel.getBoundingClientRect){
      tRect = rel.getBoundingClientRect();
    }else{
      tRect = rel;
    }
  }else{
    tRect = {left:0, top:0};
  }
  // let r = {x:window.pageXOffset + iRect.left - tRect.left, y:window.pageYOffset + iRect.top - tRect.top};
  // console.error("el.top",iRect.top,"parent.top",tRect.top, r);
  return {x:window.pageXOffset + iRect.left - tRect.left, y:window.pageYOffset + iRect.top - tRect.top};
}

// innerHTML에 html string을 넣었을때 랜더링완료됨을 체크
// ex) await renderEnd(element);
export function renderEnd(tag, cb?){
  return new Promise(resolve=>{
    let list:any = tag.children;
    let last = list[list.length-1];
    let fn = ()=>{
      //tag.offsetParent &&
      if( ((!last && tag.childNodes.length) || (last && typeof last.offsetTop === "number")) && (typeof cb === "function" ? cb() : true)){
        // console.error("tag rendering complete!")
        resolve();
      }else{
        // console.error(1);
        window['requestIdleCallback'](fn);
      }
    }
    window['requestIdleCallback'](fn);
  })
}
