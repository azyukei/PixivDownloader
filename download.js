// 接收下載訊息
// Set on Message event listener
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    chrome.downloads.download({
        url: request.download_url
    }, function(downloadId) {
        sendResponse({
            downloadId: downloadId
        });
    });
});
