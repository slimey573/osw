/*  
MIT License

Copyright (c) 2020 Austin Michaud

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var Wave=function(){"use strict";var t,e={fromStream:function(t,e,r={}){let i,n,o;this.current_stream.id=e,this.current_stream.options=r,this.sources[t.toString()]?(cancelAnimationFrame(this.sources[t.toString()].animation),i=this.sources[t.toString()].audioCtx,n=this.sources[t.toString()].analyser,o=this.sources[t.toString()].source):(i=new AudioContext,n=i.createAnalyser(),(o=i.createMediaStreamSource(t)).connect(n),o.connect(i.destination),this.sources[t.toString()]={audioCtx:i,analyser:n,source:o}),n.fftsize=32768;let a=n.frequencyBinCount;this.current_stream.data=new Uint8Array(a);let s=this;function l(){s.current_stream.animation=requestAnimationFrame(s.current_stream.loop),s.sources[t.toString()].animation=s.current_stream.animation,n.getByteFrequencyData(s.current_stream.data),s.visualize(s.current_stream.data,s.current_stream.id,s.current_stream.options)}this.current_stream.loop=l,l()},stopStream:function(){cancelAnimationFrame(this.current_stream.animation)},playStream:function(){this.current_stream.loop()}},r=t=>{let{data:e,options:r,ctx:i,h:n,w:o}=t,a=n/4,s=a/2,l=o/2,c=n/2,h=(a-s)/2**24.6,p=2.8125*Math.PI/180,u=Math.floor(128/r.colors.length);for(let t=1;t<=128;t++){let n=(e[t]+100)**3*h,o=t*p,d=l+(a-(n+s))*Math.cos(o),f=c+(a-(n+s))*Math.sin(o);i.moveTo(d,f);let g=l+(a+n)*Math.cos(o),x=c+(a+n)*Math.sin(o);if(i.lineTo(g,x),t%u==0){let e=t/u-1;i.strokeStyle=r.colors[e],i.stroke(),i.beginPath()}}i.stroke()},i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(function(t,e){!function(r){var n={paper:null},o={documentStyles:[],virtualStyles:{},contexts:[],defaults:{arc:{background:"rgba(0, 0, 0, 0)",strokeStyle:"rgba(0, 0, 0, 0)",lineWidth:null},rect:{background:"rgba(0, 0, 0, 0)",strokeStyle:"rgba(0, 0, 0, 0)",lineWidth:null},polygon:{background:"rgba(0, 0, 0, 0)",strokeStyle:"rgba(0, 0, 0, 0)",lineWidth:null},line:{strokeStyle:"rgba(0, 0, 0, 0)",lineWidth:null},text:{font:"14px Helvetica",strokeStyle:"rgba(0, 0, 0, 0)",color:"#000",lineWidth:null}}};n.warning=function(t,e){console&&console.warn&&console.warn("[origami.js]",t,e)},n.error=function(t){throw new Error("[origami.js]".concat(" "+t))},n.init=function(t){(t=t.canvas?t.canvas:document.querySelector(t))||this.error("Please use a valid selector or canvas context");var e=function(t,e){for(var r=0;r<e.length;r++)if(e[r].element.isEqualNode(t))return e[r];return!1}(t,o.contexts);if(e)return this.paper=e,this;t.getContext||this.error("Please verify if it's a valid canvas element"),t.width=t.clientWidth,t.height=t.clientHeight;var r=t.getContext("2d"),i={element:t,queue:[],index:o.contexts.length,flip:!1,frame:null,ctx:r,width:t.width,height:t.height};return o.contexts.push(i),this.paper=i,this},n.styles=function(){o.virtualStyles.length||function(){for(var t=0;t<document.styleSheets.length;t++){var e=document.styleSheets[t],r=e.cssRules?e.cssRules:e.rules;o.documentStyles.push(r)}}();var t=arguments;if(!t.length)return o.virtualStyles.empty=!0,this;for(var e=0;e<t.length;e++){var r=u(t[e],o.documentStyles[0]||[]);o.virtualStyles[t[e]]=r}return this},n.getPaper=function(){return this.paper},n.canvasCtx=function(){return this.paper.ctx},n.getContexts=function(){return o.contexts},n.cleanContexts=function(){o.contexts=[]},n.createComponent=function(t,e){n[t]=function(t){return e.bind(this,this,t)(),this}},n.fn={},n.draw=function(t){var e=!1,r=this.paper.ctx;"string"==typeof t&&(e=new origami.fn[t](this.paper),this.paper.ctx=e);for(var i=new d(this.paper),o=this.paper.queue,a=0;a<o.length;a++)(!1===o[a].loaded||o[a].failed)&&n.warning("couldn't able to load:",o[a].params),i[o[a].assign](o[a].params);this.paper.queue=[],e&&(e.draw(),this.paper.ctx=r),"function"==typeof t&&t()},n.load=function(t){var e=function(t){if(null==t||"object"!=typeof t)return t;var e=t.constructor();for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return e}(this);e.paper=this.paper;var r=setInterval(function(){e.paper.queue.filter(function(t){return!1===t.loaded&&!t.failed}).length||(clearInterval(r),t.bind(e,e)())},1)};var a=function(t,e,r){this.paper.queue.push({assign:t,params:e,loaded:r})}.bind(n),s=Object.prototype.hasOwnProperty;function l(t,e){for(var r=e||["x","y","width","height"],i={},n=0;n<t.length;n++)"object"==typeof t[n]?i.style=t[n]:r.length&&(i[r.shift()]=t[n]);return i.style=c(i.style),"string"==typeof i.x&&"string"==typeof i.y&&(i=h(i)),i}function c(t){t||(t={});var e=t.borderSize||null,r=t.borderColor||null,i=t.borderStyle||[];if(t.border){var n=[],o=t.border;n=n.concat(t.border.match(/[0-9]*\.?[0-9]px?/i)),o=o.replace(/[0-9]*\.?[0-9]px?/i,""),n=n.concat(o.match(/solid|dashed|dotted/i)),o=o.replace(/solid|dashed|dotted/i,""),n=n.concat(o.match(/[^\s]+/i)),e||(e=n[0]),r||(r=n[2]),i=n[1]}return e&&(e=e.replace(/[^0-9]/g,"")),"string"==typeof i&&(i="dashed"===i?[12]:"dotted"===i?[3]:[]),t.borderSize=e,t.borderStyle=i,t.borderColor=r,t}function h(t){var e=t.x,r=t.y,i=n.getPaper(),o=i.element.width,a=i.element.height,s=t.r||0,l=t.width||s,c=t.height||l,h={x:["right","center","left"],y:["top","center","bottom"]};return-1!==h.x.indexOf(e)?"right"===e?e=Math.floor(o-l):"center"===e?e=s?Math.floor(o/2):Math.floor(o/2-l/2):"left"===e&&(e=s):e="%"===(e+"").substr(-1)?o*parseInt(e,10)/100:0,-1!==h.y.indexOf(r)?"top"===r?r=s:"center"===r?r=s?Math.floor(a/2):Math.floor(a/2-c/2):"bottom"===r&&(r=Math.floor(a-c)):r="%"===(r+"").substr(-1)?a*parseInt(r,10)/100:0,t.y=r,t.x=e,t}function p(t,e,r){for(var n in e)s.call(e,n)&&("constructor"===n&&t===i||(void 0===e[n]?delete t[n]:r&&void 0!==t[n]||(t[n]=e[n])));return t}function u(t,e){for(var r=0;r<e.length;r++)if(e[r].selectorText&&e[r].selectorText.toLowerCase()===t)return e[r].style}function d(t){this.paper=t}d.prototype.translate=function(t){this.paper.ctx.translate(t.x,t.y)},d.prototype.background=function(t){this.paper.element.style.backgroundColor=t.color},d.prototype.restore=function(){this.paper.ctx.restore()},d.prototype.save=function(){this.paper.ctx.save()},d.prototype.composition=function(t){this.paper.ctx.globalCompositeOperation=t.globalComposite},d.prototype.rotate=function(t){this.paper.ctx.rotate(t.degrees)},d.prototype.scale=function(t){this.paper.ctx.scale(t.width,t.height)},d.prototype.flip=function(t){this.paper.flip="horizontal",t.type&&"string"==typeof t.type&&(this.paper.flip=t.type)},d.prototype.flipEnd=function(){this.paper.flip=!1},d.prototype.clear=function(){this.paper.ctx.clearRect(0,0,this.paper.width,this.paper.height)},d.prototype.arc=function(t){var e=t.args,r=e.style,i=o.defaults.arc;this.paper.ctx.beginPath(),this.paper.ctx.setLineDash(r.borderStyle),this.paper.ctx.arc(e.x,e.y,e.r||i.radius,e.sAngle||0,e.eAngle||2*Math.PI),this.paper.ctx.fillStyle=r.background||r.bg?r.background||r.bg:i.background,this.paper.ctx.fill(),this.paper.ctx.lineWidth=r.borderSize?r.borderSize:i.lineWidth,this.paper.ctx.strokeStyle=r.borderColor?r.borderColor:i.strokeStyle,this.paper.ctx.stroke(),this.paper.ctx.setLineDash([]),this.paper.ctx.closePath()},n.arc=function(){var t=[].slice.call(arguments);return t=l(t,["x","y","r","sAngle","eAngle"]),a("arc",{args:t}),this},d.prototype.image=function(t){var e=t.image,r=t.x,i=t.y,n=t.width,o=t.height;this.paper.ctx.save(),this.paper.flip&&("horizontal"===this.paper.flip&&(this.paper.ctx.scale(-1,1),n*=-1,r*=-1),"vertical"===this.paper.flip&&(this.paper.ctx.scale(1,-1),o*=-1,i*=-1)),this.paper.ctx.beginPath(),this.paper.ctx.drawImage(e,Math.floor(r||0),Math.floor(i||0),n,o),this.paper.ctx.closePath(),this.paper.ctx.restore()},n.image=function(t,e,r,i,n){if(!t)return this;if("string"==typeof t){var s=new Image;s.src=t,t=s}var l={image:t,x:e,y:r,width:i,height:n};if("string"==typeof l.x&&"string"==typeof l.y&&(l=h(l)),t.complete)return l.width=i||t.naturalWidth,l.height=n||t.naturalHeight,a("image",l),this;a("image",l,!1);var c=this.paper.queue.length-1,p=o.contexts[this.paper.index].queue[c];return t.addEventListener("load",function(){if(!p)return!1;p.params.width=l.width||t.naturalWidth,p.params.height=l.height||t.naturalHeight,p.loaded=!0}),t.addEventListener("error",function(){if(!p)return!1;p.failed=!0}),this},d.prototype.line=function(t){var e=o.defaults.line,r=t.style,i=t.pointA,n=t.pointB;this.paper.ctx.beginPath(),this.paper.ctx.setLineDash(r.borderStyle),this.paper.ctx.moveTo(i.x||0,i.y||0),this.paper.ctx.lineTo(n.x||0,n.y||0),this.paper.ctx.lineWidth=r.borderSize?r.borderSize:e.lineWidth,this.paper.ctx.strokeStyle=r.borderColor?r.borderColor:e.strokeStyle,this.paper.ctx.stroke(),this.paper.ctx.setLineDash([]),this.paper.ctx.closePath()},n.line=function(t,e,r){return r=c(r),a("line",{pointA:t,pointB:e,style:r}),this},d.prototype.polygon=function(t){var e=t.args,r=t.style,i=o.defaults.polygon;this.paper.ctx.beginPath(),this.paper.ctx.setLineDash(r.borderStyle),this.paper.ctx.fillStyle=r.background?r.background:i.background,this.paper.ctx.lineWidth=r.borderSize?r.borderSize:i.lineWidth,this.paper.ctx.strokeStyle=r.borderColor?r.borderColor:i.strokeStyle;for(var n=0;n<e.length;n++)e[n].x&&(n?this.paper.ctx.lineTo(e[n].x,e[n].y):this.paper.ctx.moveTo(e[n].x,e[n].y));this.paper.ctx.fill(),this.paper.ctx.stroke(),this.paper.ctx.setLineDash([]),this.paper.ctx.closePath()},n.polygon=function(){var t=[].slice.call(arguments),e=l(t);return a("polygon",{style:e.style,args:t}),this},d.prototype.rect=function(t){var e=o.defaults.rect,r=t.style,i=t.args;this.paper.ctx.beginPath(),this.paper.ctx.setLineDash(r.borderStyle),this.paper.ctx.fillStyle=r.background?r.background:e.background,this.paper.ctx.fillRect(i.x,i.y,i.width,i.height||i.width),this.paper.ctx.lineWidth=r.borderSize?r.borderSize:e.lineWidth,this.paper.ctx.strokeStyle=r.borderColor?r.borderColor:e.strokeStyle,this.paper.ctx.strokeRect(i.x,i.y,i.width,i.height||i.width),this.paper.ctx.setLineDash([]),this.paper.ctx.closePath()},n.rect=function(){var t=[].slice.call(arguments);return t=l(t),a("rect",{style:t.style,args:t}),this},n.border=function(){var t=[].slice.call(arguments);return t=l(t),a("rect",{style:t.style,args:{x:0,y:0,width:this.paper.width,height:this.paper.height}}),this},d.prototype.CSSShape=function(t){var e=this;if(!(t=o.virtualStyles[t]))return e;var i='<svg xmlns="http://www.w3.org/2000/svg" width="'+e.paper.width+'px" height="'+e.paper.height+'px"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml"><div style="'+t.cssText+'"></div></div></foreignObject></svg>',n=r.URL||r.webkitURL||r,a=new Image,s=new Blob([i],{type:"image/svg+xml;charset=utf-8"}),l=n.createObjectURL(s);return a.src=l,a.addEventListener("load",function(){e.paper.ctx.beginPath(),e.paper.ctx.drawImage(a,0,0),n.revokeObjectURL(l),e.paper.ctx.closePath()}),e},n.shape=function(t){return a("CSSShape",t),this},d.prototype.sprite=function(t){var e=t.properties,i=t.width/e.frames;(function t(e){var i=this;if(e.posX===e.widthTotal){if(!1===e.loop)return void r.cancelAnimationFrame(e.animation);e.posX=0}i.paper.ctx.clearRect(e.dx,e.dy,e.width,e.height),i.paper.ctx.beginPath(),i.paper.ctx.drawImage(e.image,e.posX,e.posY,e.width,e.height,e.dx,e.dy,e.width,e.height),i.paper.ctx.closePath(),e.posX=e.posX+e.width,setTimeout(function(){e.animation=r.requestAnimationFrame(t.bind(i,e))},e.speed)}).call(this,{image:t.image,posX:0,posY:0,frame:e.frames,loop:e.loop,width:i,widthTotal:t.width,height:t.height,dx:t.x,dy:t.y,speed:e.speed,animation:null})},n.sprite=function(t,e,r){if(!r||!r.src)return this;var i=new Image;r.frames,r.loop,r.speed,i.src=r.src;var n={x:t,y:e,image:i,properties:r,width:0,height:0};if(i.complete)return n.width=i.naturalWidth,n.height=i.naturalHeight,a("sprite",n),this;a("sprite",n,!1);var s=this.paper.queue.length-1,l=o.contexts[this.paper.index].queue[s];return i.addEventListener("load",function(){if(!l)return!1;l.params.width=i.naturalWidth,l.params.height=i.naturalHeight,l.loaded=!0}),i.addEventListener("error",function(){if(!l)return!1;l.failed=!0}),this},d.prototype.text=function(t){var e=o.defaults.text,r=t.text,i=t.x,n=t.y,a=t.style;this.paper.ctx.beginPath(),this.paper.ctx.setLineDash(a.borderStyle),this.paper.ctx.lineWidth=a.borderSize?a.borderSize:e.lineWidth,this.paper.ctx.strokeStyle=a.borderColor?a.borderColor:e.strokeStyle,this.paper.ctx.font=a.font||e.font,this.paper.ctx.fillStyle=a.color||e.color,this.paper.ctx.textAlign=a.align||e.align,this.paper.ctx.fillText(r,i,n),this.paper.ctx.strokeText(r,i,n),this.paper.ctx.fill(),this.paper.ctx.stroke(),this.paper.ctx.setLineDash([]),this.paper.ctx.closePath()},n.text=function(t,e,r,i){var n={text:t,x:e,y:r,style:i=c(i)};return"string"==typeof n.x&&"string"==typeof n.y&&(n=h(n)),a("text",n),this},d.prototype.chartLine=function(t){var e=this.paper.ctx,r=this.paper.width,i=this.paper.height,n=c({border:t.line||"1px solid #000"}),o=40,a=40,s=[],l={vertical:!0,horizontal:!0};t.gridLines&&(!1===t.gridLines.vertical&&(l.vertical=!1),!1===t.gridLines.horizontal&&(l.horizontal=!1));for(var h=0;h<t.labels.length;h++)s.push({X:t.labels[h],Y:t.data[h]});function p(){for(var t=0,e=0;e<s.length;e++)s[e].Y>t&&(t=s[e].Y);return t+(10-t%10)}function u(t){return(r-o)/s.length*t+o}function d(t){return i-(i-a)/p()*t-a}for(e.lineWidth=.8,e.strokeStyle="#999",e.font="normal 12px Helvetica",e.fillStyle="#5e5e5e",e.textAlign="center",e.beginPath(),e.moveTo(o,a/2),e.lineTo(o,i-a),e.lineTo(r-o/2,i-a),e.stroke(),e.textAlign="right",e.textBaseline="middle",h=0;h<p();h+=10)l.horizontal&&(e.beginPath(),e.lineWidth=.8,e.strokeStyle="#e7e7e7",e.moveTo(o-5,d(h)),e.lineTo(r-o/2,d(h)),e.stroke()),e.fillText(h,o-10,d(h));for(e.textAlign="left",h=0;h<s.length;h++)l.vertical&&(e.beginPath(),e.lineWidth=.8,e.strokeStyle="#e7e7e7",e.moveTo(u(h),i-a+10),e.lineTo(u(h),a/2),e.stroke()),e.fillText(s[h].X,u(h),i-a+20);for(e.beginPath(),e.lineWidth=n.borderSize,e.setLineDash(n.borderStyle),e.strokeStyle=n.borderColor,e.moveTo(u(0),d(s[0].Y)),h=1;h<s.length;h++)e.lineTo(u(h),d(s[h].Y));if(e.stroke(),e.setLineDash([]),t.points)for(e.fillStyle=t.pointsColor?t.pointsColor:"rgb(75,75,75)",h=0;h<s.length;h++)e.beginPath(),e.arc(u(h),d(s[h].Y),3,0,2*Math.PI,!0),e.fill()},n.chartLine=function(t){return a("chartLine",t),this},n.background=function(t){return a("background",{color:t}),this},n.restore=function(){return a("restore"),this},n.save=function(){return a("save"),this},n.composition=function(t){return a("composition",{globalComposite:t}),this},n.translate=function(t,e){return null==t&&(t="reset"),"string"==typeof t&&("center"===t&&(t=context.width/2,e=context.height/2),"reset"===t&&(t=-context.width/2,e=-context.height/2)),a("translate",{x:t,y:e}),this},n.rotate=function(t){return void 0===t&&(t="slow"),"string"==typeof t&&("slow"===t?t=2*Math.PI/60*(new Date).getSeconds()+2*Math.PI/6e4*(new Date).getMilliseconds():"normal"===t?t=2*Math.PI/30*(new Date).getSeconds()+2*Math.PI/3e4*(new Date).getMilliseconds():"fast"===t&&(t=2*Math.PI/6*(new Date).getSeconds()+2*Math.PI/6e3*(new Date).getMilliseconds())),a("rotate",{degrees:t}),this},n.stopRender=function(){r.cancelAnimationFrame(this.paper.frame),this.paper.frame=!1},n.play=function(){return this.paper.frame=1,this},n.startRender=function(t){var e=this;!1!==e.paper.frame&&e.draw(function(){e.paper.frame=r.requestAnimationFrame(t.bind(this))})},n.scale=function(t,e){return a("scale",{width:t,height:e}),this},n.flip=function(t){return a("flip",{type:t}),this},n.flipEnd=function(){return a("flipEnd"),this},n.clear=function(){return a("clear"),this},n.on=function(t,e){return this.paper.element.addEventListener(t,e),this};var f=p(n.init.bind(this),n);t&&t.exports?t.exports=f:e?e.origami=f:"object"==typeof r&&(r.origami=p(n.init.bind(n),n))}(function(){return this}())}(t={exports:{}},t.exports),t.exports);n.origami;function o(t){this.ctx=t,this.mainColor="black"}function a(){this.current_stream={},this.sources={},this.onFileLoad=null,this.activeElements={},this.activated=!1,window.AudioContext=window.AudioContext||window.webkitAudioContext}return o.prototype={__toRadians__:t=>t*Math.PI/180,__rotatePoint__([t,e],[r,i],n){let o=this.__toRadians__(n);return[Math.cos(o)*(t-r)-Math.sin(o)*(e-i)+r,Math.sin(o)*(t-r)+Math.cos(o)*(e-i)+i]},mutateData(t,e,r=null){if("mirror"===e){let e=[];for(let r=0;r<t.length;r+=2)e.push(t[r]);return e=[...e,...e.reverse()]}if("shrink"===e){r<1&&(r=t.length*r);let e=[],i=Math.floor(t.length/r);for(let n=1;n<=r;n++){let r=t.slice(n*i,n*i+i),o=r[Math.floor(r.length/2)];e.push(o)}return e}if("split"===e){let e=Math.floor(t.length/r),i=[],n=[],o=0;for(let a=0;a<=e*r;a++)o===e&&(i.push(n),n=[],o=0),n.push(t[a]),o++;return i}if("scale"===e){let e=r/255;return r<=3&&r>=0&&(e=r),t.map(t=>t*e)}if("organize"===e){let e={};return e.base=t.slice(60,120),e.vocals=t.slice(120,255),e.mids=t.slice(255,2e3),e}if("reverb"===e){let e=[];return t.forEach((r,i)=>{e.push(r-(t[i+1]||0))}),e}if("amp"===e){let e=[];return t.forEach(t=>{e.push(t*(r+1))}),e}if("min"===e){let e=[];return t.forEach(t=>{t<r&&(t=r),e.push(t)}),e}},getPoints(t,e,[r,i],n,o,a={}){let{offset:s=0,rotate:l=0,customOrigin:c=[]}=a,h={start:[],end:[]};if("circle"===t){let t=360/n,a=this.__toRadians__(t),c=e/2;for(let t=1;t<=n;t++){let e=a*t,n=o[t-1],p=o[t-1]*(s/100),u=r+(c-p)*Math.cos(e),d=i+(c-p)*Math.sin(e),f=this.__rotatePoint__([u,d],[r,i],l);h.start.push(f),u=r+(c-p+n)*Math.cos(e),d=i+(c-p+n)*Math.sin(e);let g=this.__rotatePoint__([u,d],[r,i],l);h.end.push(g)}return h}if("line"===t){let t=e/n;r=c[0]||r,i=c[1]||i;for(let e=0;e<=n;e++){let n=l,a=o[e]*(s/100),c=this.__rotatePoint__([r+e*t,i-a],[r,i],n);h.start.push(c);let p=this.__rotatePoint__([r+e*t,i+o[e]-a],[r,i],n);h.end.push(p)}return h}},drawCircle([t,e],r,i={}){let{color:n,lineColor:o=this.ctx.strokeStyle}=i;this.ctx.beginPath(),this.ctx.arc(t,e,r/2,0,2*Math.PI),this.ctx.strokeStyle=o,this.ctx.stroke(),this.ctx.fillStyle=n,n&&this.ctx.fill()},drawOval([t,e],r,i,n={}){let{rotation:o=0,color:a,lineColor:s=this.ctx.strokeStyle}=n;o&&(o=this.__toRadians__(o)),this.ctx.beginPath(),this.ctx.ellipse(t,e,i,r,o,0,2*Math.PI),this.ctx.strokeStyle=s,this.ctx.stroke(),this.ctx.fillStyle=a,a&&this.ctx.fill()},drawSquare([t,e],r,i={}){this.drawRectangle([t,e],r,r,i)},drawRectangle([t,e],r,i,n={}){let{color:o,lineColor:a=this.ctx.strokeStyle,radius:s=0,rotate:l=0}=n;this.ctx.beginPath(),this.ctx.moveTo(t+s,e);let c=this.__rotatePoint__([t+i,e],[t,e],l),h=this.__rotatePoint__([t+i,e+r],[t,e],l);this.ctx.arcTo(c[0],c[1],h[0],h[1],s);let p=this.__rotatePoint__([t+i,e+r],[t,e],l),u=this.__rotatePoint__([t,e+r],[t,e],l);this.ctx.arcTo(p[0],p[1],u[0],u[1],s);let d=this.__rotatePoint__([t,e+r],[t,e],l),f=this.__rotatePoint__([t,e],[t,e],l);this.ctx.arcTo(d[0],d[1],f[0],f[1],s);let g=this.__rotatePoint__([t,e],[t,e],l),x=this.__rotatePoint__([t+i,e],[t,e],l);this.ctx.arcTo(g[0],g[1],x[0],x[1],s),this.ctx.closePath(),this.ctx.strokeStyle=a,this.ctx.stroke(),this.ctx.fillStyle=o,o&&this.ctx.fill()},drawLine([t,e],[r,i],n={}){let{lineColor:o=this.ctx.strokeStyle}=n;this.ctx.beginPath(),this.ctx.moveTo(t,e),this.ctx.lineTo(r,i),this.ctx.strokeStyle=o,this.ctx.stroke()},drawPolygon(t,e={}){let{color:r,lineColor:i=this.ctx.strokeStyle,radius:n=0,close:o=!1}=e;function a(t,e,r,i,n,o){let a=Math.sqrt((r-t)**2+(i-e)**2),s=o?n/a:(a-n)/a;return[t+s*(r-t),e+s*(i-e)]}n>0&&(t=function(t,e){let r=t.length,i=new Array(r);for(let n=0;n<r;n++){let o=n-1,s=n+1;o<0&&(o=r-1),s==r&&(s=0);let l=t[o],c=t[n],h=t[s],p=a(l[0],l[1],c[0],c[1],e,!1),u=a(c[0],c[1],h[0],h[1],e,!0);i[n]=[p[0],p[1],c[0],c[1],u[0],u[1]]}return i}(t,n));let s,l,c=t.length;for(s=0;s<c;s++)l=t[s],0==s?(this.ctx.beginPath(),this.ctx.moveTo(l[0],l[1])):this.ctx.lineTo(l[0],l[1]),n>0&&this.ctx.quadraticCurveTo(l[2],l[3],l[4],l[5]);o&&this.ctx.closePath(),this.ctx.strokeStyle=i,this.ctx.stroke(),this.ctx.fillStyle=r,r&&this.ctx.fill()}},a.prototype={fromElement:function(t,e,r){const i=[r.globalAccessKey||"$wave"],n=r.getGlobal||function(t,e){return(t=>{window[i]=window[i]||{},window[i][t]=window[i][t]||{}})(t),window[i][t][e]},o=r.setGlobal||function(t,e,r){let o=n(t);return o||(window[i][t][e]=window[i][t][e]||r,o=window[i][t][e]),o},a=this;let s=document.getElementById(t);if(!s)return;function l(){this.activated=!0,this.activeCanvas=this.activeCanvas||{},this.activeCanvas[e]=JSON.stringify(r),this.activeElements[t]=this.activeElements[t]||{},this.activeElements[t].count?this.activeElements[t].count+=1:this.activeElements[t].count=1;const i=this.activeElements[t].count,a=o(s.id,"audioCtx",new AudioContext),l=o(s.id,"analyser",a.createAnalyser());let c=n(s.id,"source");c?c.mediaElement!==s&&(c=a.createMediaElementSource(s)):c=a.createMediaElementSource(s),o(s.id,"source",c);const h=a.createOscillator();h.frequency.value=1,h.connect(a.destination),h.start(0),h.stop(0),c.connect(l),c.connect(a.destination),l.fftsize=32768;const p=l.frequencyBinCount,u=new Uint8Array(p);let d=1;function f(){JSON.stringify(r)===this.activeCanvas[e]&&document.getElementById(t)&&document.getElementById(e)&&(requestAnimationFrame(f),d++,i<this.activeElements[t].count||(l.getByteFrequencyData(u),this.activeElements[t].data=u),this.visualize(this.activeElements[t].data,e,r,d))}(f=f.bind(this))()}s.crossOrigin="anonymous";const c=()=>{["touchstart","touchmove","touchend","mouseup","click","play"].forEach(t=>{s.removeEventListener(t,c,{once:!0})}),l.call(a)};this.activated||r.skipUserEventsWatcher?l.call(a):(document.body.addEventListener("touchstart",c,{once:!0}),document.body.addEventListener("touchmove",c,{once:!0}),document.body.addEventListener("touchend",c,{once:!0}),document.body.addEventListener("mouseup",c,{once:!0}),document.body.addEventListener("click",c,{once:!0}),s.addEventListener("play",c,{once:!0}))},fromFile:function(t,e={}){e.stroke||(e.stroke=10);let r=new Audio;r.src=t;let i=new AudioContext,n=i.createAnalyser();i.createMediaElementSource(r).connect(n),n.fftSize=64;let o,a,s=n.frequencyBinCount,l=new Uint8Array(s),c=0,h=this;r.addEventListener("loadedmetadata",async function(){for(;r.duration===1/0;)await new Promise(t=>setTimeout(t,1e3)),r.currentTime=1e7*Math.random();r.currentTime=0,r.play()}),r.onplay=function(){let t=r.duration;r.playbackRate=16;let e=(t/=r.playbackRate)/.02*(n.fftSize/2);e=(t=>{for(let e=1;e<=40;e++){let r=2**e;if(t<=r)return r}})(e),o=new Uint8Array(e),a=setInterval(function(){n.getByteFrequencyData(l);for(let t in l)t=l[t],o[c]=t,c++},20)},r.onended=function(){if(r.currentTime===r.duration&&void 0!==o){clearInterval(a);let t=document.createElement("canvas");t.height=window.innerHeight,t.width=window.innerWidth,h.visualize(o,t,e);let r=t.toDataURL("image/jpg");h.onFileLoad(r),t.remove()}}},...e,visualize:function(t,e,i={},n){(i={...i}).stroke||(i.stroke=1),i.colors||(i.colors=["#d92027","#ff9234","#ffcd3c","#35d0ba"]);let o=document.getElementById(e);if(!o)return;let a=o.getContext("2d"),s=o.height,l=o.width;a.strokeStyle=i.colors[0],a.lineWidth=i.stroke;let c={flower:r},h={flower:1};const p={data:t,options:i,ctx:a,h:s,w:l,Helper:this.Helper,canvasId:e};"string"==typeof i.type&&(i.type=[i.type]),i.type.forEach(t=>{n%h[t]==0&&(a.clearRect(0,0,l,s),a.beginPath(),c[t](p))})},Helper:o},a}();