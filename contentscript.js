// 幫預覽圖加入按鈕
$("div._layout-thumbnail").each(function() {
	$(this).append('<div class="extension-button"><input class="_button view" type="button" value="🔍" /><br><input class="_button ext_btn thumbnail-download" type="button" value="⬇︎" /></div>');
});

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

