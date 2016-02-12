// 取得 URL 判斷目前位置並加入按鈕
var url = window.location.href;
// 搜尋頁
if (url.search("search.php") > 0) {
    $("div.pager-container").append('<span class="_button search-download_all">整頁下載</a>');
}

// 收藏
if (url.search("bookmark.php") > 0) {
    $("div.pager-container").append('<span class="_button bookmark-download_all">整頁下載</a>');
}

// 作品列表
if (url.search("member_illust.php") > 0 && url.search("mode") < 0) {
    $("div.pager-container").append('<span class="_button member_illust-download_all">整頁下載</a>');
}

// 插圖
if (url.search("member_illust.php") > 0 && url.search("mode") > 0) {
    $("div.bookmark-container").append('<span class="_button illust-download">下載</a>');
}

// 幫預覽圖加入按鈕
$("li.image-item").each(function() {
    $(this).prepend('<div class="extension-button"><input class="_button thumbnail-view" type="button" value="🔍" /><br><input class="_button thumbnail-download" type="button" value="⬇︎" /></div>');
});

// 點擊預覽圖檢視按鈕
$("._button.thumbnail-view").click(function() {
    var url = get_thumbnail_url($(this));
    var urlData = parse_thumbnail_url(url);
    if (is_thumbnail_multiple($(this))) {
        // 相簿

    } else if (is_thumbnail_ugoku($(this))) {
        // 動圖

    } else {
        // 一般

    }


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
        // 原圖建立連結
        var img_original_url = "http://i" + urlData.ix + ".pixiv.net/img-original/img/" + urlData.date + "/" + urlData.time + "/" + urlData.id + "_p0.png";

        // 用 XMLHttpRequest 來請求原圖
        var downloadRequest = new XMLHttpRequest();
        downloadRequest.responseType = "blob";
        downloadRequest.open("GET", img_original_url, true);

        // 請求完成後
        downloadRequest.onload = function(e) {
            // 判斷是否成功
            if (this.status == 200) {

                // 將請求的回應建立成 blob
                var blob = new Blob([this.response], {
                    type: 'image/png'
                });

                // 用 blob 建立影像的連結
                var urlCreator = window.URL || window.webkitURL;
                var imageUrl = urlCreator.createObjectURL(blob);

                //傳給 background page 來下載影像
                chrome.runtime.sendMessage({
                    download_url: imageUrl
                }, function(response) {
                    console.log(response.farewell);
                });
            }
        };

        // 傳送請求
        downloadRequest.send();



        //chrome.downloads.download({url: img_original_url});
        //http://i3.pixiv.net/img-original/img/2014/01/19/11/17/26/41050386_p0.jpg	
    }
});

// 點擊插圖下載按鈕
$("._button.illust-download").click(function() {
    check_multipul();
});

// 點擊搜尋頁整頁下載按鈕
$("._button.search-download_all").click(function() {
    // 取得整頁 id 陣列
    // 檢查是否為相簿

    alert("整頁下載");
});

// 點擊插圖下載按鈕
$("._button.bookmark-download_all").click(function() {
    alert("整頁下載");
});
