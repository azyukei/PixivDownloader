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
	alert($(this).parent().nextAll("a.work").children("div._layout-thumbnail").children("img").attr("src"));
});

// 點擊預覽圖下載按鈕
$("._button.thumbnail-download").click(function() {
	// 取得 id
	// 檢查是否為相簿
		// 取得 相簿頁數
	// 取得其他資料
	// 製作原圖連結
	// 顯示原圖
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

