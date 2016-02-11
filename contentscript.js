// 作品、相簿、動圖判斷
$("div._layout-thumbnail").each(function() {
	// $(this).parent("a") 檢查是否為相簿或動圖
	// $(this).children("img") 獲得能分析出其他需要資訊的 url

	// 檢查相簿 multiple
	if ($(this).parent().attr("class").search("multiple") > 0) {

		
	}

	// 檢查動圖 ugoku
	if ($(this).parent().attr("class").search("ugoku-illust") > 0) {
		

	}

	// 一般插圖
	if ($(this).parent().attr("class").search("multiple") < 0 && $(this).attr("class").search("ugoku-illust") < 0) {


		$(this).children("img").attr("src");
	}
});

// 取得 URL 判斷目前位置並加入按鈕
var url = window.location.href;
// 搜尋頁
if (url.search("search.php") > 0) {
	$("div.pager-container").append('<span class="_button download_all">整頁下載</a>');
}

// 收藏
if (url.search("bookmark.php") > 0) {
	$("div.pager-container").append('<span class="_button download_all">整頁下載</a>');
}

// 作品列表
if (url.search("member_illust.php") > 0 && url.search("mode") < 0) {
	$("div.pager-container").append('<span class="_button download_all">整頁下載</a>');
}

// 插圖
if (url.search("member_illust.php") > 0 && url.search("mode") > 0) {
	$("div.bookmark-container").append('<span class="_button download">下載</a>');
}




// 作品連結的 Array
var links = [];
var illust_ids = [];

// 取得每張作品的連結
$("a.work").each(function( index ) {
	links[index] = $(this).attr("href");
});

parseLinks(links, illust_ids);

for (index in illust_ids) {
	var illust_id = illust_ids[index];
	//console.log(illust_id);
};


console.log($("div._layout-thumbnail img:first").attr("src"));

