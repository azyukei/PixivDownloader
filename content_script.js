// 取得 URL 判斷目前位置並加入按鈕
var url = window.location.href;

// 加入收藏按鈕
if (url.search("bookmark.php") > 0) {
    $("nav.column-order-menu").append('<span class="_button ext_download bookmark_download_all">整頁下載</a>');
}

// 加入作品列表按鈕
if (url.search("member_illust.php") > 0 && url.search("mode") < 0) {
    $("ul.column-order-menu").append('<span class="_button ext_download member_illust_download_all">整頁下載</a>');
}

// 加入插圖按鈕
if (url.search("member_illust.php") > 0 && url.search("mode") > 0) {
    $("div.bookmark-container").append('<span class="_button ext_download illust_download">下載</a>');
}

// 加入預覽圖按鈕
$("li.image-item").each(function() {
    $(this).prepend('<div class="extension-button"><input class="_button ext_view thumbnail_view" type="button" value="🔍" /><br><input class="_button ext_download thumbnail_download" type="button" value="⬇︎" /></div>');
});

// 插入瀏覽用的暗背景
$("body").prepend('<div class="view_layer"></div></div>')
$("body").prepend('<div class="shadow_layer"><span class="close_layer" >✖</span></div>');

// 按下預覽按鈕
$(".ext_view").click(function() {
	// 移除舊的 img
    $("img").remove(".view_img");
    $("div.view_layer").show();
    $("div.shadow_layer").show();

    var div_w = $("div.view_layer").width();
    var div_h = $("div.view_layer").height();

    var img_src = "";
    if (div_h > 600) {
        img_src = $(this).parent().parent().find("div._layout-thumbnail").children("img").attr("src").replace("150x150", "1200x1200");
    } else {
        img_src = $(this).parent().parent().find("div._layout-thumbnail").children("img").attr("src").replace("150x150", "600x600");
    }
    var img = new Image();

    // 圖片讀取後再做，否則會拿不到圖片的寬高
    img.onload = function() {

		var view_img = $("img.view_img");
		var naturalWidth = view_img.get(0).naturalWidth;
		var naturalHeight = view_img.get(0).naturalHeight;

        if (naturalHeight > div_h) {
            view_img.height(div_h);
            if (view_img.width() > div_w) {
                view_img.width(div_w);
            }
        } else if (naturalWidth > div_w) {
            view_img.width(div_w);

            if (view_img.height() > div_h) {
                view_img.height(div_h);
            }
        }

        // 調整div位置讓圖片置中
        $("div.view_layer").css("margin-left", -view_img.width()/2);
        $("div.view_layer").css("margin-top", -view_img.height()/2);
        img.style.display = "block";
    };

    // 設定好圖片的類別然後插到 div 中
    img.src = img_src;
    img.className = "view_img";
    img.style.display = "none";
    $("div.view_layer").append(img);

});

// 關閉預覽
$("span.close_layer").click(function() {
    hide_layer();
});
$("div.view_layer").click(function() {
    hide_layer();
});
$("div.shadow_layer").click(function() {
    hide_layer();
});

// 按下下載按鈕
$(".ext_download").click(function() {
    $(this).off("click");               // 暫時停止 click event 避免重複下載
    $(this).prop( "disabled", true );   // 暫時禁止按鈕 避免重複下載
    var works = get_works($(this));
    parse_img_src(works);
    get_manga_link(works);

    // 非同步函式
    for (var i = 0; i < works.length; i++) {
        if (!works[i].ugoku) {
            get_work_pages(works[i], function(work) {

                get_source_link(work);
                get_filename(work);

                check_type(work, function(work, type) {
                    for (var i = 0; i < work.source_links.length; i++) {
                        //sent_to_background();

                        request_source(work.source_links[i] + "." + work.type, work.filename[i] + "." + work.type, type, function(blob, filename) {
                            var download_url = get_download_url(blob);
                            send_download_message(download_url, filename, function() {
                                // TODO - 下載後做些什麼？
                            });
                        });
                    }
                });
            });
        }
    }
});
