/**
 * 傳入按鈕 selector ，判斷現在頁面，建立 works 並回傳
 * @param  {object} button	jQuery selected button.
 * @return {[object]} works [work]
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
                var a_work = $(this).children("li.image-item").children("a.work");

                // 將資料塞進 works
                a_work.each(function() {
                    works.push({
                        "title": $(this).parent().find("h1.title").text(),
                        "id": "",
                        "date": "",
                        "time": "",
                        "user_name": $(this).parent().find("a.user").attr("data-user_name"),
                        "user_id": $(this).parent().find("a.user").attr("data-user_id"),
                        "type": "png",
                        "pages": 1,
                        "multiple": is_multiple_work($(this)),
                        "ugoku": is_ugoku_work($(this)),
                        "site": "",
                        "link": $(this).attr("href"),
                        "manga_link": "",
                        "img_src": $(this).children("div._layout-thumbnail").children("img").attr("src"),
                        "source_links": [],
                        "blob_links": []
                    });
                });
            }
        });
    }

    // 作品列表 - 整頁下載
    if (button.attr("class").indexOf("member_illust_download_all") > 0) {
        // 選出 a.work
        var a_work = $("ul._image-items > li.image-item > a.work");

        // 將資料塞進 works
        a_work.each(function() {
            works.push({
                "title": $(this).parent().find("h1.title").text(),
                "id": "",
                "date": "",
                "time": "",
                "user_name": $(this).parent().find("a.user").attr("data-user_name"),
                "user_id": $(this).parent().find("a.user").attr("data-user_id"),
                "type": "png",
                "pages": 1,
                "multiple": is_multiple_work($(this)),
                "ugoku": is_ugoku_work($(this)),
                "site": "",
                "link": $(this).attr("href"),
                "manga_link": "",
                "img_src": $(this).children("div._layout-thumbnail").children("img").attr("src"),
                "source_links": [],
                "blob_links": []
            });
        });
    }

    // 插圖 - 下載
    if (button.attr("class").indexOf("illust_download") > 0) {
        // 選出 div.works_display
        var works_display = $("div.works_display");

        // 建立 work
        var work = {
            "title": $("ui-expander-target > h1.title").text(),
            "id": "",
            "date": "",
            "time": "",
            "user_name": $("div._unit.profile-unit > h1.user").text(),
            "user_id": $('#favorite-preference > form > input[name="user_id"]').attr("value"),
            "type": "png",
            "pages": 1,
            "multiple": false,
            "ugoku": false,
            "site": "",
            "link": window.location.href,
            "manga_link": "",
            "img_src": "",
            "source_links": [],
            "blob_links": []
        }

        // 判斷類型寫入資料
        if (works_display.find("._work").length == 1) {
            // 相簿
            work.multiple = true;
            work.img_src = works_display.find("img").attr("src");
        } else if (works_display.find("canvas").length == 1) {
            // 動圖
            work.ugoku = true;
        } else {
            // 一般作品使用圖片連結
            work.img_src = works_display.find("img").attr("src");
        }

        // 塞進 works
        works.push(work);
    }

    // 預覽圖 - view 或 download
    if (button.attr("class").indexOf("thumbnail_view") > 0 || button.attr("class").indexOf("thumbnail_download") > 0) {
        // 選出 a.work
        var a_work = $(button).parent().parent().find("a.work");

        // 塞進 worksg
        works.push({
            "title": a_work.parent().find("h1.title").text(),
            "id": "",
            "date": "",
            "time": "",
            "user_name": a_work.parent().find("a.user").attr("data-user_name"),
            "user_id": a_work.parent().find("a.user").attr("data-user_id"),
            "type": "png",
            "pages": 1,
            "multiple": is_multiple_work(a_work),
            "ugoku": is_ugoku_work(a_work),
            "site": "",
            "link": a_work.attr("href"),
            "manga_link": "",
            "img_src": a_work.children("div._layout-thumbnail").children("img").attr("src"),
            "source_links": [],
            "blob_links": []
        });
    }

    return works;
}

/**
 * 判斷是否為相簿
 * @param  {object} work	jQuery selected a.work.
 * @return {Boolean} Is target an album or manga.
 */
function is_multiple_work(a_work) {
    return (a_work.attr("class").indexOf("multiple") > 0);
}

/**
 * 判斷是否為動圖
 * @param  {object} work	jQuery selected a.work.
 * @return {Boolean} Is target a ugoku.
 */
function is_ugoku_work(a_work) {
    return (a_work.attr("class").indexOf("ugoku-illust") > 0);
}

/**
 * 解析 url 拿到需要用的資料
 * @param  {[object]} url
 */
function parse_img_src(works) {
    for (var i = 0; i < works.length; i++) {
        works[i].site = works[i].img_src.substr(works[i].img_src.indexOf("//i") + 3, 1);
        works[i].date = works[i].img_src.substr(works[i].img_src.indexOf("img/") + 4, 10);
        works[i].time = works[i].img_src.substr(works[i].img_src.indexOf("img/") + 15, 8);
        works[i].id = works[i].img_src.substr(works[i].img_src.indexOf("img/") + 24, 8);
    }
}

/** 
 * 將相簿作品連結變成漫畫連結
 * @param  {[object]} works
 * @return {string} manga_link
 */
function get_manga_link(works) {
    for (var i = 0; i < works.length; i++) {
        if (works[i].multiple) {
            var link = works[i].link;
            works[i].manga_link = link.replace("medium", "manga");
        }
    }
}

/**
 * 分析漫畫連結來取得作品頁數
 * @param  {object} work
 * @return {string} pages
 */
function get_work_pages(work, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", work.manga_link, true);
    xhr.send();

    xhr.onload = function() {
        // 200 成功
        if (this.status == 200) {
            var html = $.parseHTML(this.response);
            work.pages = $(html).find("span.total").text();
            
            callback(work);
        } else {
            console.log(this.status);
        }
    }
}

/**
 * 組成原圖連結
 * @param  {object} work
 */
function get_source_link(work) {
    for (var i = 0; i < work.pages; i++) {
        work.source_links[i] = "http://i" + work.site + ".pixiv.net/img-original/img/" + work.date + "/" + work.time + "/" + work.id;
    }
}

/**
 * 用 XMLHttpRequest 取得 blob
 * @param  {object} work
 * @param  {Function} callback(Blob)
 */
function request_source_png(work, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";

    // 請求完成
    xhr.onload = function(e) {
        if (this.status == 200) {
            var blob = new Blob([this.response], {
                type: 'image/png'
            });

            callback(blob);
        } else if (this.status == 404) {
            status.push("jpg");
        } else {
            console.log(this.status);
        }
    }

    // 送出請求
    for (var i = 0; i < work.source_links.length; i++) {
        xhr.open("GET", work.source_links[i] + "." + type);
        xhr.send();
    }
}

/**
 * 完成剩下的 jpg 請求取得 blob
 * @param  {object} work
 * @param  {Function} callback(Blob)
 */
function request_source_jpg(work, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";

    // 請求完成
    xhr.onload = function(e) {
        if (this.status == 200) {
            var blob = new Blob([this.response], {
                type: 'image/jpeg'
            });

            callback(blob);
        } else {
            console.log(this.status);
        }
    }

    // 送出請求
    for (var i = 0; i < work.source_links.length; i++) {
        if (work.type == "jpg") {
            xhr.open("GET", work.source_links[i] + "." + type);
            xhr.send();
        }
    }
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
 * @param  {Function} callback
 */
function send_download_message(download_url, callback) {
    chrome.runtime.sendMessage({
        download_url: download_url
    }, function(response) {
        //console.log(response.farewell);
    });
}
