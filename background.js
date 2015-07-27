var whitelist =  [
  'gyazo.com',
  'flickr.com',
  'imgur.com',
  'photobucket.com',
  'tinypic.com',
  'dota2lounge.com',
  'csgolounge.com',
  'steamcommunity.com',
  'csgoticket.com',
  'csgojackpot.com',
  'csgoskins.net',
  'mumble.info',
  'teamspeak.com',
  'raidcall.com',
  'ventrilo.com'
]
var brands =  {
  'image_full' : ['gyazo', 'flickr', 'imgur', 'photobucket', 'tinypic'],
  'dota'  : ['dota2lounge'],
  'cs'  : ['csgolounge', 'csgoticket', 'csgojackpot', 'csgoskins'],
  'steam' : ['steamcommunity'],
  'voip'  : ['mumble', 'teamspeak', 'raidcall', 'ventrilo', 'zack']
}
var THRESHOLD = .90;
var COUNT_THRESHOLD = .80;
function shouldRedirect(base,target) {
  if (target.length / base.length >= COUNT_THRESHOLD) {
    return base.jdist(target) >= THRESHOLD;
  }
  return false;
}

function checkUrl(url) {
  var hostname = getHostname(url);
  var ret = {
    cancel  : false,
    brand : '',
    part  : ''
  }
  var partsToCheck = getPartsFromHostname(hostname);
  for (var brandType in brands) {
    brands[brandType].forEach(function(brand) {
      partsToCheck.forEach(function(part) {
        if(shouldRedirect(brand,part)) {
          ret.cancel = true;
          ret.brand = brand;
          ret.part = part;
          return ret   
        }
      });
    });
  }
  return ret;
}

function getPartsFromHostname(hostname) {
  var parts = hostname.split('.');
  parts.pop();
  var partsToCheck = [];
  parts.forEach(function(part) { 
    if (part.indexOf('-') > -1) {
      part.split('-').forEach(function(dashPart) {
        partsToCheck.push(dashPart);
      });
    } else {
      partsToCheck.push(part);
    }
  });
  return partsToCheck;
}

function getHostname(url) {
  var parser = document.createElement('a');
  parser.href = url;
  return parser.hostname;
}

function getPrimaryDomain(domain) {
    var parts = domain.split('.');
    var primaryDomain = parts.slice(parts.length - 2).join('.');
    return primaryDomain; 
}

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    var url = details.url;
/*    if (url.startsWith('chrome-extension')) {
      return {  cancel : false  };
    }*/
    var hostname = getHostname(url);
    var primaryDomain = getPrimaryDomain(hostname); 
    var found = whitelist.indexOf(primaryDomain) > -1;
    if(!found) {
      var intel = checkUrl(url);
      if(intel.cancel) {
        var warning = chrome.extension.getURL('warning.html'+
          '?url=' + url +
          '&brand=' + intel.brand +
          '&part=' + intel.part);
        return {  redirectUrl : warning   };
      } else {
        return { cancel : false };
      }
    } else {
      return { cancel: false };
    }
  },
  { 'urls'  : ['<all_urls>']  },
  ['blocking','requestBody']
)
