// Background page
var download_queue = [];








// 設定 on Message event listener 接收下載任務
chrome.runtime.onMessage.addListener(function(download_task, sender, sendResponse) {
    download_queue.push(download_task);

});


/**
 * @param  {string} source_link 含副檔名
 * @param  {string} filename
 * @param  {string} type blob type
 * @param  {Function}
 */
function request_source(source_link, filename, type, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.open("GET", source_link);
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var blob = new Blob([xhr.response], {
                type: type
            });
            callback(blob, filename);
        }
    }
    xhr.send(null);
}

/**
 * 用 Blob 建立下載連結
 * @param  {Blob} blob
 * @return {string} download_url
 */
function get_download_url(blob) {
    var urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
}

function download_image(download_url, filename, callback) {
    chrome.downloads.download({
        url: download_url,
        filename: filename
    },
    function(downloadId) {
        callback(downloadId);
    });
}
