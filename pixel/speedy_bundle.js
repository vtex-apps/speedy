(()=>{function t(t,n){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"]
if(!r){if(Array.isArray(t)||(r=function(t,n){if(!t){return}if("string"==typeof t){return e(t,n)}
var r=Object.prototype.toString.call(t).slice(8,-1)
"Object"===r&&t.constructor&&(r=t.constructor.name)
if("Map"===r||"Set"===r){return Array.from(t)}
if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)){return e(t,n)}
}(t))||n&&t&&"number"==typeof t.length){r&&(t=r)
var o=0,a=function(){}
return{"s":a,"n":function(){return o>=t.length?{"done":!0}:{"done":!1,"value":t[o++]}},
"e":function(t){throw t},"f":a}}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}var c,i=!0,l=!1
return{"s":function(){r=r.call(t)},"n":function(){var t=r.next()
return i=t.done,t},"e":function(t){l=!0,c=t},"f":function(){try{i||null==r["return"]||r["return"]()
}finally{if(l){throw c}}}}}function e(t,e){(null==e||e>t.length)&&(e=t.length)
for(var n=0,r=Array(e);n<e;n++){r[n]=t[n]}return r}var n={
"timeFromSettings":"{{settings.timeToPush3rdParty}}","block3rdParty":"{{settings.block3rdParty}}",
"customTimeToPush":"{{settings.customTimeToPush}}","blacklist":"{{settings.blacklist}}",
"preconnect":"{{settings.preconnect}}","account":"{{account}}","enableGA":"{{settings.enableGA}}",
"googleAnalyticsID":"{{settings.googleAnalyticsID}}","get":function(t,e){return n[t]?n[t]:e}
},r=n.get("googleAnalyticsID","")
function o(){dataLayer.push(arguments)}!function(){if("true"===n.get("enableGA","false")){
var t=document.createElement("script")
t.src="https://www.googletagmanager.com/gtag/js?id=".concat(r),t.setAttribute("defer",""),
document.head.appendChild(t),window.dataLayer=window.dataLayer||[],o("js",new Date),o("config",r)}
}(),function(){
var e=10,o=n.get("timeToPush3rdParty",""),a=o.length>0?1e3*+o:1e3*e,c=!!n.get("settings","").length,i=n.get("customTimeToPush",""),l=n.get("blacklist",""),s=n.get("preconnect",""),u=new Set(decodeURIComponent(s).split(";")),d=function(){
return l.length?decodeURIComponent(l).split(";"):[]},f=[]
i.length>0&&(f=decodeURIComponent(i).split(";").map((function(t){var e=t.split(",")
return{"domain":e[0],"seconds":e[1]?1e3*e[1]:null}
}))),u.add("https://".concat(n.get("account",""),".vtexassets.com"))
var p,g=t(u)
try{for(g.s();!(p=g.n()).done;){var m=p.value
if(m.length>0){m=m.replace("https://","")
var h=document.createElement("link")
h.rel="preconnect",h.href="https://".concat(m)
var y=document.createElement("link")
y.rel="dns-prefetch",y.href="https://".concat(m),document.head.appendChild(h),document.head.appendChild(y)
}}}catch(t){g.e(t)}finally{g.f()}var v=["*.vtexassets.com","vtex.com","*.myvtex.com"]
function b(e,o,i,l){if("SCRIPT"===e.tagName&&(e.src&&e.src.length>0&&(e.setAttribute("defer",""),
e.removeAttribute("async")),e.src&&!function(e){
var n=e.match(/^(?:https?:\/\/)?(?:www\.)?([^/:?#]+)(?:[/:?#]|$)/i)
if(n&&n[1]){var r,o=t(v.map((function(t){
return RegExp("^".concat(t.replace(/\./g,"\\.").replace(/\*/g,".*"),"$"))})))
try{for(o.s();!(r=o.n()).done;){if(r.value.test(n)){return!0}}}catch(t){o.e(t)}finally{o.f()}
return!1}}(e.src))){var s,u,p=f.length>0&&null!==(s=null===(u=f.find((function(t){
return e.src.includes(t.domain)
})))||void 0===u?void 0:u.seconds)&&void 0!==s?s:a,g="true"===n.get("enableGA","false")&&r.length&&e.src.includes(r),m=d().find((function(t){
return e.src.includes(t)}))&&g
return setTimeout((function(){if(!c&&!m){if(SPEEDY.lcpLoaded){return o.call(i,e,l)}
var t=setInterval((function(){SPEEDY.lcpLoaded&&(clearInterval(t),o.call(i,e,l))}),50)}}),p)}
return o.call(i,e,l)}window.SPEEDY={"DEFAULT_TIME_TO_PUSH":e,"timeToPush":a,"whiteList":v,
"timeFromSettings":o,"block3rdParty":c,"customTimeToPush":f,"blacklist":d(),"preConnectData":s,
"preConnectList":u,"lcpLoaded":!1,"googleAnalyticsID":r}
var E=Element.prototype.appendChild,w=Element.prototype.insertBefore
Element.prototype.appendChild=function(t){return b(t,E,this)
},Element.prototype.insertBefore=function(t,e){return b(t,w,this,e)}
}(),/^((?!chrome|android).)*safari/i.test(navigator.userAgent)?SPEEDY.lcpLoaded=!0:new PerformanceObserver((function(t){
t.getEntries("largest-contentful-paint")&&(SPEEDY.lcpLoaded=!0)})).observe({
"type":"largest-contentful-paint","buffered":!0})})()
