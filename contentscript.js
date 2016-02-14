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
$(".ext_button").click(function() {
    var works = get_works($(this));
    parse_img_src(works);
    get_manga_link(works);

    // 非同步函式
    for (var i = 0; i < works.length; i++) {

        get_work_pages(works[i], function(work) {

            get_source_link(work);
            get_filename(work);

            check_type(work, function(work, type) {
                for (var i = 0; i < work.source_links.length; i++) {
                    request_source(work.source_links[i] + "." + work.type, work.filename[i] + "." + work.type, type, function(blob, filename) {
                    	console.log(filename);
                        var download_url = get_download_url(blob);
                        send_download_message(download_url, filename, function() {
                        	// TODO - 下載後做些什麼？
                        });
                    });
                }
            });
        });
    }
});
