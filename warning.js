document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.getBackgroundPage(function(page) {
        var params = getUrlVars()
        var badurl = params.url; 
        var part = params.part;
        var brand = params.brand;
        document.getElementById('badurl').innerHTML = badurl; 
        document.getElementById('part').innerHTML = part; 
        document.getElementById('brand').innerHTML = brand; 
        document.getElementById('continueWhitelist').onclick=function() {
            page.processNewUserWhitelistURL(badurl); 
            window.location = badurl;
        }
        document.getElementById('continueOnce').onclick=function() {
            page.processNewOnceURL(badurl); 
            window.location = badurl;
        }
        document.getElementById('abort').onclick=function() {
            window.location = 'http://google.com'
        }
    })
});
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
}
