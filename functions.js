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
                var a_work = $(this).children("li.image-item").children("a.work");

                // 將資料塞進 works
                a_work.each(function() {
                    works.push({
                        "link": $(this).attr("href"),
                        "img_src": $(this).children("div._layout-thumbnail").children("img").attr("src"),
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
        var a_work = $("ul._image-items > li.image-item > a.work");

        // 將資料塞進 works
        a_work.each(function() {
            works.push({
                "link": $(this).attr("href"),
                "img_src": $(this).children("div._layout-thumbnail").children("img").attr("src"),
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
            "link": window.location.href,
            "img_src": "",
            "multiple": false,
            "ugoku": false
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
            "link": a_work.attr("href"),
            "img_src": a_work.children("div._layout-thumbnail").children("img").attr("src"),
            "multiple": is_multiple_work(a_work),
            "ugoku": is_ugoku_work(a_work)
        });
    }

    return works;
}

/**
 * 解析 works 中的 url 取得其他要用的資料
 * @param  {object} works {"link": a.work.href, "multiple": boolean, "ugoku":boolean}
 * @param  {Function} callback
 * @return {[type]}
 */
function parse_works(works, callback) {

    var source_links = [];

    for (i in works) {

        if (works[i].multiple) {
            // 相簿
            // 取得 ix, date, time, id
            var ill_data = parse_img_src(works[i].img_src);
            // 取得 manga link
            var manga_link = get_manga_link(works[i].link);
            // 取得作品頁數
            var p_max = get_work_pages(manga_link, function(p_max) {
                for (var i = 0; i < p_max; i++) {
                    var source_link = "http://i" + ill_data.ix + ".pixiv.net/img-original/img/" + ill_data.date + "/" + ill_data.time + "/" + ill_data.id + "_p" + i;
                    source_links.push(source_link);
                }
                callback(source_links);
            });

        } else if (works[i].ugoku) {
            // 動圖
            // TODO - 未決定如何使用
        } else {
            // 一般
            // 取得 ix, date, time, id
            var ill_data = parse_img_src(works[i].img_src);
            source_links.push("http://i" + ill_data.ix + ".pixiv.net/img-original/img/" + ill_data.date + "/" + ill_data.time + "/" + ill_data.id + "_p0");
            callback(source_links);
        }
    }
}

/** 
 * 將相簿作品連結變成漫畫連結
 * @param  {string} link
 * @return {string} manga_link
 */
function get_manga_link(link) {
    var manga_link = link.replace("medium", "manga");
    return manga_link;
}

/**
 * 分析漫畫連結來取得作品頁數
 * @param  {string} manga_link
 * @return {string} p_max
 */
function get_work_pages(manga_link, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", manga_link, true);
    xhr.onload = function() {
        // 200 成功
        if (this.status == 200) {
            var html = $.parseHTML(this.response);
            var p_max = $(html).find("span.total").text();
            callback(p_max);
        } else {
            console.log(this.status);
        }
    }
    xhr.send();
}

/**
 * 解析 url 拿到需要用的資料
 * @param  {string} url
 * @return {object} Illust data, for  download image.
 */
function parse_img_src(link) {
    var ix = link.substr(link.indexOf("//i") + 3, 1);
    var date = link.substr(link.indexOf("img/") + 4, 10);
    var time = link.substr(link.indexOf("img/") + 15, 8);
    var id = link.substr(link.indexOf("img/") + 24, 8);
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

function check_source_type(source_links, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.open("GET", source_links[0] + ".png");
    xhr.send();
    xhr.onload = function() {
        if (this.status == 404) {
            callback(".jpg");
        } else if (this.status == 200) {
            callback(".png");
        } else {
            console.log(this.status);
        }
    };
}

function request_source(source_links, type, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.open("GET", source_links[0] + type);
    xhr.onload = function(e) {
        if (this.status == 200) {
            var blob
            if (type == "png") {
                blob = new Blob([this.response], {
                    type: 'image/png'
                });
            } else {
                blob = new Blob([this.response], {
                    type: 'image/jpeg'
                });
            }
            callback(blob);
        } else {
            console.log(this.status);
        }
    }
    xhr.send();
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
