!(function() {
  const e = new Set(decodeURIComponent('{{settings.preconnect}}').split(';'))
  e.add('https://{{account}}.vtexassets.com')
  for (let t of e)
    if (t.length > 0) {
      t = t.replace('https://', '')
      const e = document.createElement('link')
      ;(e.rel = 'preconnect'), (e.href = `https://${t}`)
      const n = document.createElement('link')
      ;(n.rel = 'dns-prefetch'),
        (n.href = `https://${t}`),
        document.head.appendChild(e),
        document.head.appendChild(n)
    }
})(),
  (function() {
    const e = '{{settings.timeToPush3rdParty}}',
      t = 1e3 * parseInt(e, 10),
      n = decodeURIComponent('{{settings.blacklist}}').split(';')
    let o = []
    o = decodeURIComponent('{{settings.customTimeToPush}}')
      .split(';')
      .map(e => {
        const t = e.split(',')
        return { domain: t[0], seconds: t[1] ? 1e3 * t[1] : null }
      })
    const s = ['*.vtexassets.com', 'vtex.com', '*.myvtex.com']
    function r(e, r, i, c) {
      if (
        'SCRIPT' === e.tagName &&
        (e.src &&
          e.src.length > 0 &&
          (e.setAttribute('defer', ''), e.removeAttribute('async')),
        e.src &&
          !(function(e) {
            const t = e.match(
              /^(?:https?:\/\/)?(?:www\.)?([^/:?#]+)(?:[/:?#]|$)/i
            )
            if (t && t[1]) {
              const e = s.map(
                e =>
                  new RegExp(
                    `^${e.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`
                  )
              )
              for (const n of e) if (n.test(t)) return !0
              return !1
            }
          })(e.src))
      ) {
        const s =
          o.length > 0 ? o.find(t => e.src.includes(t.domain))?.seconds ?? t : t
        return n.find(t => e.src.includes(t)), setTimeout(() => {}, s)
      }
      return r.call(i, e, c)
    }
    window.SPEEDY = {
      DEFAULT_TIME_TO_PUSH: 10,
      timeToPush: t,
      whiteList: s,
      timeFromSettings: e,
      block3rdParty: !0,
      customTimeToPush: o,
      blacklist: n,
      lcpLoaded: !1,
      init: () => {
        !(function() {
          const e = navigator.userAgent.includes('WebKit'),
            t =
              navigator.userAgent.includes('Safari') &&
              !navigator.userAgent.includes('Chrome') &&
              !navigator.userAgent.includes('CriOS') &&
              !navigator.userAgent.includes('FxiOS')
          return e && t
        })()
          ? new PerformanceObserver(e => {
              e.getEntries('largest-contentful-paint') &&
                (SPEEDY.lcpLoaded = !0)
            }).observe({ type: 'largest-contentful-paint', buffered: !0 })
          : (SPEEDY.lcpLoaded = !0)
      },
    }
    const i = Element.prototype.appendChild,
      c = Element.prototype.insertBefore
    ;(Element.prototype.appendChild = function(e) {
      return r(e, i, this)
    }),
      (Element.prototype.insertBefore = function(e, t) {
        return r(e, c, this, t)
      }),
      window.SPEEDY.init()
  })()
