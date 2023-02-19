const ua = navigator.userAgent.toLowerCase()

const getOs = (ua) => {
  if(ua.includes('android')) {
    return 'android'
  } else if(ua.includes('like mac os x')) {
    return 'ios'
  } else if(ua.includes('mac os')) {
    return 'mac'
  } else if(ua.match(new RegExp(".*(bb10|rim|blackberry).*"))) {
    return 'blackberry'
  } else if(ua.match(new RegExp(".*(?:polaris|natebrowser|(01[016789]\\d{3,4}\\d{4}$)).*"))) {
    return 'polaris'
  } else if(ua.includes('windows')) {
    return 'windows'
  } else if(ua.includes('linux')) {
    return 'linux'
  } else if(ua.includes('bada')) {
    return 'bada'
  } else if(ua.includes('webos')) {
    return 'webos'
  } else {
    return 'unknown'
  }
}

const getBrowser = (ua) => {
  const browserPatterns = [
    "(polaris|natedata|(01[0|1|6|7|8|9]\\d{3,4}\\d{4}$))",
    "(chrome)[ /]([\\w.]+)",
    "(opera)(?:.*version)?[ /]([\\w.]+)",
    "(dolfin)[ /]([\\w.]+)",
    "(webkit)(?:.*version)?[ /]([\\w.]+)",
    "(msie) ([\\w.]+)", // (ie)
    "(trident).*rv:([\\w.]+)", // (ie11)
    "(firefox)/(([0-9]+)\\.?([\\w]+)?(\\.[\\w]+)?(\\.[\\w]+)?)",
  ]

  const browser = {}

  for(let i=0; i<browserPatterns.length; i++) {
    let matches = ua.match(new RegExp(browserPatterns[i]))

    if(matches) {
      browser.name = matches[1]

      if(browser.name === 'trident') {
        browser.name = 'msie'
      }

      if(browser.name === 'webkit') {
        const ios = new RegExp("(iphone|ipad|ipod)[\\S\\s]*os ([\\w._\\-]+) like")
        const android = new RegExp("(android)[ /]([\\w._\\-]+);")

        if(ua.match(ios)) {
          matches = ua.match(ios)
          browser.name = matches[1]
        } else if(ua.match(android)) {
          matches = ua.match(android)
          browser.name = matches[1]
        } else {
          browser.name = 'safari'
        }
      }

      if(matches[2]) {
        browser.version = matches[2]
      }

      break
    }
  }

  return browser
}

const getPlatform = (ua) => {
  const isPC = ua.match(new RegExp(".*(?:linux|windows (nt|98)|macintosh).*")) && !ua.match(new RegExp(".*(?:android|mobile|polaris|lgtelecom|uzard|natebrowser|ktf;|skt;).*"));
  const isTablet = ua.includes("ipad") || ua.includes("rim tablet os") || ua.includes("android") && !ua.match(new RegExp(".*(?:mobi|mini|fennec).*"));
  const isMobile = ua.match(new RegExp(".*(?:ip(hone|od)|android.+mobile|windows (ce|phone)|blackberry|bb10|symbian|webos|firefox.+fennec|opera m(ob|in)i|polaris|iemobile|lgtelecom|nokia|sonyericsson|dolfin|uzard|natebrowser|ktf;|skt;).*"))
  if(isPC) {
    return 'pc'
  } else if(isTablet) {
    return 'tablet'
  } else if(isMobile) {
    return 'mobile'
  } else {
    return 'unknown'
  }
}


module.exports = {
  os: `os_${getOs(ua)}`,
  // browser: getBrowser(ua).name,
  // platform: getPlatform(ua),
  // version: `version_${getBrowser(ua).version.replace(/\./gi, '_')}`
}