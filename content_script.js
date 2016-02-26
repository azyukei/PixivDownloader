// 取得 URL 判斷目前位置並加入按鈕
var url = window.location.href;

// 加入收藏按鈕
if (url.search("bookmark.php") > 0) {
	$("nav.column-order-menu").append('<input class="_button ext_download bookmark_download_all" type="button" value="整頁下載">');
}

// 加入作品列表按鈕
if (url.search("member_illust.php") > 0 && url.search("mode") < 0) {
	$("ul.column-order-menu").append('<input class="_button ext_download member_illust_download_all" type="button" value="整頁下載">');
}

// 加入插圖按鈕
if (url.search("member_illust.php") > 0 && url.search("mode") > 0) {
	$("div.bookmark-container").append('<input class="_button ext_download illust_download" type="button" value="下載">');
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
		$("div.view_layer").css("margin-left", -view_img.width() / 2);
		$("div.view_layer").css("margin-top", -view_img.height() / 2);
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
	$(this).off("click"); // 暫時關閉 click event 避免重複下載
	$(this).prop("disabled", true); // 暫時禁止按鈕 避免重複下載
	var works = get_works($(this));
	parse_img_src(works);
	get_manga_link(works);

	// 將資料準備好以後，直接整包傳給 background page
	chrome.runtime.sendMessage({
		works: works
	}, function(response) {
		console.log(response);
		// 下載結束後會被呼叫，還原暫停下載按鈕的狀態
		$(this).on("click"); // 取消關閉 click event
		$(this).prop("disabled", false); // 取消禁止按鈕
	});
});