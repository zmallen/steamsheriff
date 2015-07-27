console.log('started')
document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.getBackgroundPage(function(page) {
        var params = getUrlVars()
        var badurl = params.url; 
        document.getElementById("continue").onclick=function() {
            window.location = badurl;
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
