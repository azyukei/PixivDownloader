/**
 * thumbnail 按鈕用，傳入按鈕 selector 回傳 url
 * @param  {object} button	jQuery selected button.
 * @return {string} div._layout-thumbnail > img src
 */
function get_thumbnail_url(button) {
    if (button.attr("class").indexOf("thumbnail-download") > 0) {
        return button.parent().nextAll("a.work").children("div._layout-thumbnail").children("img").attr("src");
    }

    if (button.attr("class").indexOf("illust-download") > 0 ) {
        $()

    }
}

/**
 * 解析 url 拿到需要用的資料
 * @param  {string} url
 * @return {object} Illust data, for  download image.
 */
function parse_thumbnail_url(url) {
    // url = http://i3.pixiv.net/c/150x150/img-master/img/2015/12/16/18/28/45/54069002_p0_master1200.jpg
    var ix = url.substr(url.indexOf("//i") + 3, 1);
    var date = url.substr(url.indexOf("img/") + 4, 10);
    var time = url.substr(url.indexOf("img/") + 15, 8);
    var id = url.substr(url.indexOf("img/") + 24, 8);
    return {
        ix: ix,
        date: date,
        time: time,
        id: id
    };
}

/**
 * 判斷是否為相簿
 * @param  {object} button	jQuery selected button.
 * @return {Boolean} Is target an album or manga.
 */
function is_thumbnail_multiple(button) {
    return (button.parent().nextAll("a.work").attr("class").indexOf("multiple") > 0);
}

/**
 * 判斷是否為動圖
 * @param  {object} button	jQuery selected button.
 * @return {Boolean} Is target a ugoku.
 */
function is_thumbnail_ugoku(button) {
    return (button.parent().nextAll("a.work").attr("class").indexOf("ugoku-illust") > 0);
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

/**
 * 傳送下載連結給 background page 請他下載檔案
 * @param  {string} download_url
 */
function send_download_message(download_url) {
    chrome.runtime.sendMessage({
        download_url: download_url
    }, function(response) {
        //console.log(response.farewell);
    });
}
