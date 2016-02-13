// 取得 URL 判斷目前位置並加入按鈕
var url = window.location.href;

// 加入收藏按鈕
if (url.search("bookmark.php") > 0) {
    $("nav.column-order-menu").append('<span class="_button ext_button bookmark_download_all">整頁下載</a>');
}

// 加入作品列表按鈕
if (url.search("member_illust.php") > 0 && url.search("mode") < 0) {
    $("ul.column-order-menu").append('<span class="_button ext_button member_illust_download_all">整頁下載</a>');
}

// 加入插圖按鈕
if (url.search("member_illust.php") > 0 && url.search("mode") > 0) {
    $("div.bookmark-container").append('<span class="_button ext_button illust_download">下載</a>');
}

// 加入預覽圖按鈕
$("li.image-item").each(function() {
    $(this).prepend('<div class="extension-button"><input class="_button ext_button thumbnail_view" type="button" value="🔍" /><br><input class="_button ext_button thumbnail_download" type="button" value="⬇︎" /></div>');
});

// 按下擴充功能按鈕
$(".ext_button").click(function(){
	var works = get_works($(this));
	console.log(works);
});


// 點擊預覽圖下載按鈕
$("._button.thumbnail-download").click(function() {
    var url = get_thumbnail_url($(this));
    var urlData = parse_thumbnail_url(url);
    if (is_thumbnail_multiple($(this))) {
        // 相簿

    } else if (is_thumbnail_ugoku($(this))) {
        // 動圖

    } else {
        // 一般下載
        // 建立原圖連結
        var png_original_url = "http://i" + urlData.ix + ".pixiv.net/img-original/img/" + urlData.date + "/" + urlData.time + "/" + urlData.id + "_p0.png";
        var jpg_original_url = "http://i" + urlData.ix + ".pixiv.net/img-original/img/" + urlData.date + "/" + urlData.time + "/" + urlData.id + "_p0.jpg";

        // 用 XMLHttpRequest 來請求原圖
        var downloadRequest = new XMLHttpRequest();
        downloadRequest.responseType = "blob";
        downloadRequest.open("GET", png_original_url, true);

        // 請求完成後
        downloadRequest.onload = function(e) {
            // 200 成功
            if (this.status == 200) {
                // 將請求的回應建立成 blob
                var blob = new Blob([this.response], {
                    type: 'image/png'
                });
                var download_url = get_download_url(blob); // 用 blob 建立影像的連結
                send_download_message(download_url); // 傳給 background page 來下載影像

            } else if (this.status == 404) {
                // 404 png 不存在 改傳送 jpg 請求
                downloadRequest.open("GET", jpg_original_url, true);
                downloadRequest.onload = function(e) {
                    // 200 成功
                    if (this.status == 200) {
                        // 將請求的回應建立成 blob
                        var blob = new Blob([this.response], {
                            type: 'image/jpeg'
                        });
                        var download_url = get_download_url(blob); // 用 blob 建立影像的連結
                        send_download_message(download_url); // 傳給 background page 來下載影像
                    }
                };
                downloadRequest.send(); // 第二次傳送請求
            }
        };
        downloadRequest.send(); // 傳送請求
    }
});