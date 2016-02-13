/**
 * 傳入按鈕 selector ，判斷現在頁面，取得 works {"link": a.work.href, "multiple": boolean, "ugoku":boolean} 並回傳
 * @param  {object} button	jQuery selected button.
 * @return {object} works {"link": a.work.href, "multiple": boolean, "ugoku":boolean}
 */
function get_works(button) {

    var works = [];

    // 收藏 - 整頁下載
    if (button.attr("class").indexOf("bookmark_download_all") > 0) {
        // 找出每個 _image-items
        $("ul._image-items").each(function() {
            // 排除推薦的作品
            if ($(this).attr("class").indexOf("no-response") < 0) {
                // 選出 a.work
                var work = $(this).children("li.image-item").children("a.work");

                // 將資料塞進 works
                work.each(function() {
                    // 取得 img src
                    var img_src = $(this).children("div._layout-thumbnail").children("img").attr("src");
                    works.push({
                        "link": img_src,
                        "multiple": is_multiple_work($(this)),
                        "ugoku": is_ugoku_work($(this))
                    });
                });
            }
        });
    }

    // 作品列表 - 整頁下載
    if (button.attr("class").indexOf("member_illust_download_all") > 0) {
        // 選出 a.work
        var work = $("ul._image-items > li.image-item > a.work");

        // 將資料塞進 works
        work.each(function() {
            // 取得 img src
            var img_src = $(this).children("div._layout-thumbnail").children("img").attr("src");
            works.push({
                "link": img_src,
                "multiple": is_multiple_work($(this)),
                "ugoku": is_ugoku_work($(this))
            });
        });

    }

    // 插圖 - 下載
    if (button.attr("class").indexOf("illust_download") > 0) {
        // 選出 div.works_display
        var works_display = $("div.works_display");

        // 建立 work
        var work = {
            "link": "",
            "multiple": false,
            "ugoku": false
        }

        // 判斷類型寫入資料
        if (works_display.find("._work").length == 1) {
            // 相簿
            work.link = works_display.find("img").attr("src");
            work.multiple = true;
        } else if (works_display.find("canvas").length == 1) {
            // 動圖
            work.link = window.location.href;
            work.ugoku = true;
        } else {
            // 一般
            work.link = works_display.find("img").attr("src");
        }

        // 塞進 works
        works.push(work);
    }

    // 預覽圖 - view 或 download
    if (button.attr("class").indexOf("thumbnail_view") > 0 || button.attr("class").indexOf("thumbnail_download") > 0) {
        // 選出 a.work
        var work = $(button).parent().parent().find("a.work");

        // 取得 img src
        var img_src = work.children("div._layout-thumbnail").children("img").attr("src");

        // 塞進 works
        works.push({
            "link": img_src,
            "multiple": is_multiple_work(work),
            "ugoku": is_ugoku_work(work)
        });
    }

    return works;
}

/**
 * 解析 url 拿到需要用的資料
 * @param  {string} url
 * @return {object} Illust data, for  download image.
 */
function parse_work_url(url) {
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
 * @param  {object} work	jQuery selected a.work.
 * @return {Boolean} Is target an album or manga.
 */
function is_multiple_work(work) {
    return (work.attr("class").indexOf("multiple") > 0);
}

/**
 * 判斷是否為動圖
 * @param  {object} work	jQuery selected a.work.
 * @return {Boolean} Is target a ugoku.
 */
function is_ugoku_work(work) {
    return (work.attr("class").indexOf("ugoku-illust") > 0);
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
