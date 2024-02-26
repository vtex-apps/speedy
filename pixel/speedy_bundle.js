(()=>{function t(t,n){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"]
if(!r){if(Array.isArray(t)||(r=function(t,n){if(!t){return}if("string"==typeof t){return e(t,n)}
var r=Object.prototype.toString.call(t).slice(8,-1)
"Object"===r&&t.constructor&&(r=t.constructor.name)
if("Map"===r||"Set"===r){return Array.from(t)}
if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)){return e(t,n)}
}(t))||n&&t&&"number"==typeof t.length){r&&(t=r)
var o=0,c=function(){}
return{"s":c,"n":function(){return o>=t.length?{"done":!0}:{"done":!1,"value":t[o++]}},
"e":function(t){throw t},"f":c}}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}var i,a=!0,l=!1
return{"s":function(){r=r.call(t)},"n":function(){var t=r.next()
return a=t.done,t},"e":function(t){l=!0,i=t},"f":function(){try{a||null==r["return"]||r["return"]()
}finally{if(l){throw i}}}}}function e(t,e){(null==e||e>t.length)&&(e=t.length)
for(var n=0,r=Array(e);n<e;n++){r[n]=t[n]}return r}var n={
"timeFromSettings":"{{settings.timeToPush3rdParty}}","block3rdParty":"{{settings.block3rdParty}}",
"customTimeToPush":"{{settings.customTimeToPush}}","blacklist":"{{settings.blacklist}}",
"preconnect":"{{settings.preconnect}}","account":"{{account}}","get":function(t,e){
return n[t]?n[t]:e}}
!function(){
var e=10,r=n.get("timeToPush3rdParty",""),o=r.length>0?1e3*+r:1e3*e,c=!!n.get("settings","").length,i=n.get("customTimeToPush",""),a=n.get("blacklist",""),l=n.get("preconnect",""),s=new Set(decodeURIComponent(l).split(";")),u=function(){
return a.length?decodeURIComponent(a).split(";"):[]},f=[]
i.length>0&&(f=decodeURIComponent(i).split(";").map((function(t){var e=t.split(",")
return{"domain":e[0],"seconds":e[1]?1e3*e[1]:null}
}))),s.add("https://".concat(n.get("account",""),".vtexassets.com"))
var d,p=t(s)
try{for(p.s();!(d=p.n()).done;){var m=d.value
if(m.length>0){m=m.replace("https://","")
var h=document.createElement("link")
h.rel="preconnect",h.href="https://".concat(m)
var g=document.createElement("link")
g.rel="dns-prefetch",g.href="https://".concat(m),document.head.appendChild(h),document.head.appendChild(g)
}}}catch(t){p.e(t)}finally{p.f()}var v=["*.vtexassets.com","vtex.com","*.myvtex.com"]
function y(e,n,r,i){if("SCRIPT"===e.tagName&&(e.src&&e.src.length>0&&(e.setAttribute("defer",""),
e.removeAttribute("async")),e.src&&!function(e){
var n=e.match(/^(?:https?:\/\/)?(?:www\.)?([^/:?#]+)(?:[/:?#]|$)/i)
if(n&&n[1]){var r,o=t(v.map((function(t){
return RegExp("^".concat(t.replace(/\./g,"\\.").replace(/\*/g,".*"),"$"))})))
try{for(o.s();!(r=o.n()).done;){if(r.value.test(n)){return!0}}}catch(t){o.e(t)}finally{o.f()}
return!1}}(e.src))){var a,l,s=f.length>0&&null!==(a=null===(l=f.find((function(t){
return e.src.includes(t.domain)
})))||void 0===l?void 0:l.seconds)&&void 0!==a?a:o,d=u().find((function(t){return e.src.includes(t)
}))
return setTimeout((function(){if(!c&&!d){if(SPEEDY.lcpLoaded){return n.call(r,e,i)}
var t=setInterval((function(){SPEEDY.lcpLoaded&&(clearInterval(t),n.call(r,e,i))}),50)}}),s)}
return n.call(r,e,i)}window.SPEEDY={"DEFAULT_TIME_TO_PUSH":e,"timeToPush":o,"whiteList":v,
"timeFromSettings":r,"block3rdParty":c,"customTimeToPush":f,"blacklist":u(),"preConnectData":l,
"preConnectList":s,"lcpLoaded":!1}
var b=Element.prototype.appendChild,E=Element.prototype.insertBefore
Element.prototype.appendChild=function(t){return y(t,b,this)
},Element.prototype.insertBefore=function(t,e){return y(t,E,this,e)}
}(),/^((?!chrome|android).)*safari/i.test(navigator.userAgent)?SPEEDY.lcpLoaded=!0:new PerformanceObserver((function(t){
t.getEntries("largest-contentful-paint")&&(SPEEDY.lcpLoaded=!0)})).observe({
"type":"largest-contentful-paint","buffered":!0})})()
