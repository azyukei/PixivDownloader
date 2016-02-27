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
	if (!($("div.player.toggle").length)) {
		// 非 ugoku
		$("div.bookmark-container").append('<input class="_button ext_download illust_download" type="button" value="下載">');
	}
}

// 加入預覽圖按鈕
$("li.image-item").each(function() {
	if($(this).children("a.work").length) {
		// a.work 存在，代表不是消除或非公開
		if (!($(this).children("a.work.ugoku-illust").length)) {
			// 非 ugoku
			$(this).prepend('<div class="extension-button"><input class="_button ext_view thumbnail_view" type="button" value="🔍" /><br><input class="_button ext_download thumbnail_download" type="button" value="⬇︎" /></div>');
		}
	}
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

var download_tasks = []; // 下載任務
var doing_tasks = 0; // 目前下載中任務數量

// 按下下載按鈕
$(".ext_download").click(function() {
	$(this).prop("disabled", true); // 暫時禁止按鈕 避免重複下載
	var disabled_button = $(this); // 把被禁止的按鈕 selector 存下來
	var works = get_works($(this)); // 取得作品相關資訊
	parse_img_src(works); // 取得圖片連結
	get_manga_link(works); // 若為相簿，取得 manga 連結

	var unfinished_works = works.length; // 未完成 works 數量，works[i] 中的所有圖片下載完後更動此變數回報

	// 將 works 中的所有 work 拆開去準備下載
	for (var i = 0; i < works.length; i++) {

		// 確認每個 work 中的圖片數量
		get_work_pages(works[i], function(work) {
			get_source_link(work); // 取得原圖連結
			get_filename(work); // 取得檔案名稱
			var unfinished_work = work.source_links.length; // 設定未完成圖片數量，下載完成後更動此變數回報

			// 檢查檔案類型
			check_type(work, function(work, blob_type) {
				// 將 work 中的每個原圖連結分開處理
				for (var i = 0; i < work.source_links.length; i++) {
					var source_link = work.source_links[i] + "." + work.type; // 將不含副檔名的 source_link 取出並加上副檔名
					var filename = work.filenames[i] + "." + work.type; // 將不含副檔名的 filename 取出並加上副檔名

					// 建立下載任務
					var download_task = {
						source_link: download_tasks,
						filename: filename,
						blob_type: blob_type,
						callback: function() {
							// 任務完成後執行
							// 將為完成圖片數量-1
							unfinished_work -= 1;
							if (unfinished_work == 0) {
								// 若所有圖片下載完成，將為完成 works 數量-1
								unfinished_works -= 1;
								if (unfinished_works == 0) {
									// 全部完成，取消按鈕禁止狀態
									disabled_button.prop("disabled", false);
								}
							}
						}
					};

					// 將下載任務排到隊列中
					add_tasks(download_task);
				}
			});
		});
	}
});
