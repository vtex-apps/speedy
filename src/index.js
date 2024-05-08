const speedyDebug = !!(
  localStorage?.getItem('speedyDebug') ||
  window.location.search.includes('speedyDebug') ||
  window.location.domain.includes('myvtex')
)

const isLinked = !!(
  localStorage?.getItem('linked') || window.location.search.includes('linked')
)

const isGTMDebugging = window?.location?.search.includes('gtm_debug')

window.partytown = {
  forward: ['dataLayer.push', 'fbq', 'gtag'],
  debug: speedyDebug,
  loadScriptsOnMainThread: [...(isGTMDebugging ? [/googletagmanager/g] : [])],
  lib: !isLinked
    ? `/_v/public/assets/v1/published/vtex.speedy@${window.speedy_version}/public/~partytown/`
    : `/_v/private/assets/v1/linked//vtex.speedy@${window.speedy_version}/public/~partytown/`,
}

if (speedyDebug) {
  localStorage.setItem('speedyDebug', 'true')
}

if (isLinked) {
  localStorage.setItem('linked', 'true')
}

const Settings = {
  timeFromSettings: '{{settings.timeToPush3rdParty}}',
  block3rdParty: '{{settings.block3rdParty}}',
  customTimeToPush: '{{settings.customTimeToPush}}',
  blacklist: '{{settings.blacklist}}',
  preconnect: '{{settings.preconnect}}',
  account: '{{account}}',
  enableGA: '{{settings.enableGA}}',
  googleAnalyticsID: '{{settings.googleAnalyticsID}}',
  queueDelay: '{{settings.queueDelay}}',
  prefetchAnchors: '{{settings.prefetchAnchors}}',
  prefetchRule: '{{settings.prefetchRule}}',
  get: (property, _default) => {
    return Settings[property] ? Settings[property] : _default
  },
  logDebug: msg => {
    // eslint-disable-next-line no-console
    console.debug.apply(console, [
      '%cSpeedy 🏃‍♂️',
      'background: #42b883; color: white; padding: 2px 3px; border-radius: 2px; font-size: 1em;',
      msg,
    ])
  },
  debug: speedyDebug,
}

const googleAnalyticsID = Settings.get('googleAnalyticsID', '')

/**
 * This script is responsible for handling the Google Analytics configuration
 */
;(function GoogleAnalytics() {
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments)
  }

  if (Settings.get('enableGA', 'false') !== 'true') {
    return
  }

  const script = document.createElement('script')

  Settings.logDebug('Google Analytics enabled')

  script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsID}`
  script.setAttribute('defer', '')
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []

  gtag('js', new Date())

  gtag('config', googleAnalyticsID)
})()

/**
 * This script is responsible for handling the Speedy configuration and
 */
;(function MainSpeedyThread() {
  function clearString(str) {
    return str.replace('https://', '')
  }

  const DEFAULT_TIME_TO_PUSH = 10
  const timeFromSettings = Settings.get('timeToPush3rdParty', '')

  const timeToPush =
    timeFromSettings.length > 0
      ? +timeFromSettings * 1000
      : DEFAULT_TIME_TO_PUSH * 1000

  const block3rdParty = !!Settings.get('block3rdParty', '').length

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

  Settings.logDebug(['Pre Connect', preConnectList])

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
    fcpLoaded: false,
    googleAnalyticsID,
  }
  /**
   * This function checks if the URL is in the whitelist
   *
   * @param {*} url
   * @returns
   */
  function checkWhiteList(url) {
    const regexPattern = /^(?:https?:\/\/)?(?:www\.)?([^/:?#]+)(?:[/:?#]|$)/i
    const domain = url.match(regexPattern)

    if (!domain || !domain[1]) {
      return
    }

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

  /**
   *
   * This function is responsible for handling the insertion of children in the DOM
   *
   * @param {*} child
   * @param {*} fct
   * @param {*} scope
   * @param {*} referenceNode
   * @returns
   */
  // eslint-disable-next-line max-params
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

        const isAnalytics =
          Settings.get('enableGA', 'false') === 'true' &&
          googleAnalyticsID.length &&
          child.src.includes(googleAnalyticsID)

        const isBlackListed =
          blacklist().find(item => child.src.includes(item)) && isAnalytics

        return setTimeout(() => {
          if (!block3rdParty && !isBlackListed) {
            if (SPEEDY.lcpLoaded) {
              return fct.call(scope, child, referenceNode)
            }

            const intervalID = setInterval(() => {
              if (!SPEEDY.lcpLoaded) {
                return
              }

              Settings.logDebug(`3rd party postponed ${child.src}`)
              clearInterval(intervalID)
              fct.call(scope, child, referenceNode)
            }, 50)
          }
        }, execTimeToPush)
      }
    }

    return fct.call(scope, child, referenceNode)
  }

  const originalAppendChild = Element.prototype.appendChild
  const originalInsertBefore = Element.prototype.insertBefore

  Element.prototype.appendChild = function appendChild(child) {
    return insertChildrenHandler(child, originalAppendChild, this)
  }

  Element.prototype.insertBefore = function insertBefore(child, referenceNode) {
    return insertChildrenHandler(
      child,
      originalInsertBefore,
      this,
      referenceNode
    )
  }
})()

/**
 * This script is responsible for handling the Largest Contentful Paint and First Contentful Paint
 */
;(function CheckSafariLCP() {
  // Check if the browser is Safari
  if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
    SPEEDY.lcpLoaded = true
    SPEEDY.fcpLoaded = true

    return
  }

  const observer = new PerformanceObserver(list => {
    const lcpEntries = list.getEntries('largest-contentful-paint')
    const fcpEntries = list.getEntries('first-contentful-paint')

    if (lcpEntries) {
      SPEEDY.lcpLoaded = true
    }

    if (fcpEntries) {
      SPEEDY.fcpLoaded = true
    }
  })

  // observer.observe({ type: 'largest-contentful-paint', buffered: true })
  observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] })
})()

// function DebugBar() {
//   const debugBar = document.createElement('div')

//   debugBar.style.position = 'fixed'
//   debugBar.style.bottom = '0'
//   debugBar.style.left = '0'
//   debugBar.style.width = '100%'
//   debugBar.style.backgroundColor = '#242424'
//   debugBar.style.color = 'white'
//   debugBar.style.padding = '10px'
//   debugBar.style.zIndex = '9999'
//   debugBar.style.display = 'flex'
//   debugBar.style.justifyContent = 'space-between'

//   const debugBarTitle = document.createElement('span')

//   debugBarTitle.innerText = 'Speedy Debug'

//   const debugBarClose = document.createElement('a')

//   debugBarClose.innerText = 'Close'
//   debugBarClose.style.cursor = 'pointer'
//   debugBarClose.style.backgroundColor = 'white'
//   debugBarClose.style.color = 'black'
//   debugBarClose.style.border = 'none'
//   debugBarClose.style.padding = '5px 10px'
//   debugBarClose.style.borderRadius = '5px'

//   debugBarClose.addEventListener('click', () => {
//     debugBar.style.display = 'none'
//   })

//   debugBar.appendChild(debugBarTitle)
//   debugBar.appendChild(debugBarClose)

//   document.body.appendChild(debugBar)
// }
;(function HandleAnchorsPrefetch() {
  const QUEUE_INTERVAL = parseFloat(Settings.get('queueDelay', '1.5')) * 1000

  class CallbackQueue {
    constructor() {
      this.queue = []
      this.running = false
    }

    add(callback) {
      this.queue.push(callback)
      this.start()
    }

    start() {
      if (!this.running && this.queue.length > 0) {
        this.running = true
        this.process()
      }
    }

    process() {
      if (this.queue.length === 0) {
        this.running = false

        return
      }

      const callback = this.queue.shift()

      callback()

      setTimeout(() => {
        this.process()
      }, QUEUE_INTERVAL)
    }
  }

  const queue = new CallbackQueue()

  const runtimeFields = [
    'appsEtag',
    'blocks',
    'blocksTree',
    'components',
    'contentMap',
    'extensions',
    'messages',
    'page',
    'pages',
    'query',
    'queryData',
    'route',
    'runtimeMeta',
    'settings',
  ].join(',')

  function detectDevice() {
    const userAgent = navigator.userAgent.toLowerCase()
    const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
      userAgent
    )

    const maxMobileWidth = 767 // Maximum screen width typical for mobile devices

    // Check for mobile user agent or screen width less than or equal to maxMobileWidth
    if (isMobileUserAgent || window.innerWidth <= maxMobileWidth) {
      return 'phone'
    }

    return 'desktop'
  }

  function getParam(paramName) {
    const urlParams = new URLSearchParams(window.location.search)

    return urlParams.get(paramName)
  }

  function getRelativeURLWithQuery({ path, query }) {
    // we don't need to have the rootPath here because only
    // the relative path matters
    const baseUrl = window.location.origin
    const urlObj = new URL(path, baseUrl)

    urlObj.search = ''

    Object.entries(query).forEach(([key, value]) => {
      if (typeof value === 'undefined') {
        return
      }

      urlObj.searchParams.set(key, value)
    })

    return urlObj.href.slice(baseUrl.length)
  }

  /**
   * Checks if an anchor element meets the specified rules and performs prefetching.
   * @param {HTMLAnchorElement} anchor - The anchor element to check.
   */
  function checkAnchor(anchor) {
    const anchorRules = decodeURIComponent(
      Settings.get('prefetchRule', 'product-summary')
    ).split(',')

    if (
      !Array.from(anchor.classList).find(
        className =>
          anchorRules.some(rule => className.includes(rule)) ||
          className.includes('speedy')
      )
    ) {
      return
    }

    queue.add(() => {
      const preFetchAnchor = document.createElement('link')

      preFetchAnchor.rel = 'prefetch'
      preFetchAnchor.href = anchor.href

      const preFetchAnchorSPA = document.createElement('link')

      preFetchAnchorSPA.rel = 'preload'
      preFetchAnchorSPA.as = 'fetch'

      const workspace = getParam('workspace')

      preFetchAnchorSPA.href = getRelativeURLWithQuery({
        path: anchor.href,
        query: {
          ...(workspace ? { workspace } : {}),
          __pickRuntime: runtimeFields,
          __device: detectDevice(),
        },
      })

      document.head.appendChild(preFetchAnchor)
      document.head.appendChild(preFetchAnchorSPA)

      Settings.logDebug(`Prefetching ${anchor.href}`)
    })
  }

  /**
   * Watches for mutations and performs actions based on the added nodes.
   *
   * @param {MutationRecord[]} mutations - An array of MutationRecord objects representing the mutations.
   */
  function watch(mutations) {
    mutations.forEach(mutation => {
      // Check if there are added nodes in this mutation
      mutation.addedNodes.forEach(node => {
        // Check if the node is an anchor element
        if (node.nodeType === 1 && node.tagName === 'A') {
          checkAnchor(node)
        }

        // Also check inside node if it's an element that might contain anchors
        if (node.nodeType === 1 && node.querySelectorAll) {
          node.querySelectorAll('a').forEach(anchor => {
            checkAnchor(anchor)
          })
        }
      })
    })
  }

  // Create a new observer instance
  const observer = new MutationObserver(watch)

  // Configuration of the observer:
  const config = {
    childList: true,
    subtree: true, // To observe all descendants (not just children)
  }

  document.addEventListener('DOMContentLoaded', function DOMContentLoaded() {
    // Start observing the document body
    observer.observe(document.body, config)
    document.body.querySelectorAll('a').forEach(anchor => {
      checkAnchor(anchor)
    })

    if (speedyDebug) {
      // DebugBar()
    }
  })
})()
