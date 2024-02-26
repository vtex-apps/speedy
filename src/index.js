const Settings = {
  timeFromSettings: '{{settings.timeToPush3rdParty}}',
  block3rdParty: '{{settings.block3rdParty}}',
  customTimeToPush: '{{settings.customTimeToPush}}',
  blacklist: '{{settings.blacklist}}',
  preconnect: '{{settings.preconnect}}',
  account: '{{account}}',
  get: (property, _default) => {
    return Settings[property] ? Settings[property] : _default
  },
}

;(function() {
  function clearString(str) {
    return str.replace('https://', '')
  }

  const DEFAULT_TIME_TO_PUSH = 10
  const timeFromSettings = Settings.get('timeToPush3rdParty', '')

  const timeToPush =
    timeFromSettings.length > 0
      ? +timeFromSettings * 1000
      : DEFAULT_TIME_TO_PUSH * 1000

  const block3rdParty = !!Settings.get('settings', '').length
  const customTimeToPushFromSettings = Settings.get('customTimeToPush', '')

  const blacklistFromSettings = Settings.get('blacklist', '')

  const preConnectData = Settings.get('preconnect', '')

  const preConnectList = new Set(decodeURIComponent(preConnectData).split(';'))

  const blacklist = () => {
    return blacklistFromSettings.length
      ? decodeURIComponent(blacklistFromSettings).split(';')
      : []
  }

  let customTimeToPush = []

  if (customTimeToPushFromSettings.length > 0) {
    customTimeToPush = decodeURIComponent(customTimeToPushFromSettings)
      .split(';')
      .map(row => {
        const items = row.split(',')

        return {
          domain: items[0],
          seconds: items[1] ? items[1] * 1000 : null,
        }
      })
  }

  preConnectList.add(`https://${Settings.get('account', '')}.vtexassets.com`)

  for (let domain of preConnectList) {
    if (domain.length > 0) {
      domain = clearString(domain)
      const linkPreConnect = document.createElement('link')

      linkPreConnect.rel = 'preconnect'
      linkPreConnect.href = `https://${domain}`

      const linkDNSFetch = document.createElement('link')

      linkDNSFetch.rel = 'dns-prefetch'
      linkDNSFetch.href = `https://${domain}`

      document.head.appendChild(linkPreConnect)
      document.head.appendChild(linkDNSFetch)
    }
  }

  const whiteList = ['*.vtexassets.com', 'vtex.com', '*.myvtex.com']

  window.SPEEDY = {
    DEFAULT_TIME_TO_PUSH,
    timeToPush,
    whiteList,
    timeFromSettings,
    block3rdParty,
    customTimeToPush,
    blacklist: blacklist(),
    preConnectData,
    preConnectList,
    lcpLoaded: false,
  }

  function checkWhiteList(url) {
    const regexPattern = /^(?:https?:\/\/)?(?:www\.)?([^/:?#]+)(?:[/:?#]|$)/i
    const domain = url.match(regexPattern)

    if (domain && domain[1]) {
      const regexWhitelist = whiteList.map(
        d => new RegExp(`^${d.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`)
      )

      // Test the domain against each regex in the whitelist
      for (const regex of regexWhitelist) {
        if (regex.test(domain)) {
          return true // Domain is in the whitelist
        }
      }

      return false // Domain is not in the whitelist
    }
  }

  function insertChildrenHandler(child, fct, scope, referenceNode) {
    if (child.tagName === 'SCRIPT') {
      if (child.src && child.src.length > 0) {
        child.setAttribute('defer', '')
        child.removeAttribute('async')
      }

      if (child.src && !checkWhiteList(child.src)) {
        const execTimeToPush =
          customTimeToPush.length > 0
            ? customTimeToPush.find(value => {
                return child.src.includes(value.domain)
              })?.seconds ?? timeToPush
            : timeToPush

        const isBlackListed = blacklist().find(item => child.src.includes(item))

        return setTimeout(() => {
          if (!block3rdParty && !isBlackListed) {
            if (SPEEDY.lcpLoaded) {
              return fct.call(scope, child, referenceNode)
            }

            const intervalID = setInterval(() => {
              if (SPEEDY.lcpLoaded) {
                clearInterval(intervalID)
                fct.call(scope, child, referenceNode)
              }
            }, 50)
          }
        }, execTimeToPush)
      }
    }

    return fct.call(scope, child, referenceNode)
  }

  const originalAppendChild = Element.prototype.appendChild
  const originalInsertBefore = Element.prototype.insertBefore

  Element.prototype.appendChild = function(child) {
    return insertChildrenHandler(child, originalAppendChild, this)
  }

  Element.prototype.insertBefore = function(child, referenceNode) {
    return insertChildrenHandler(
      child,
      originalInsertBefore,
      this,
      referenceNode
    )
  }
})()
;(function() {
  if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
    SPEEDY.lcpLoaded = true

    return
  }

  const observer = new PerformanceObserver(list => {
    const entries = list.getEntries('largest-contentful-paint')

    if (entries) {
      SPEEDY.lcpLoaded = true
    }
  })

  observer.observe({ type: 'largest-contentful-paint', buffered: true })
})()
