// 作品、相簿、動圖判斷
$("div._layout-thumbnail").each(function() {
	if ($(this).parent().attr("class").search("multiple") > 0) {
		//console.log("multiple");
		
	}
	if ($(this).parent().attr("class").search("ugoku-illust") > 0) {
		//console.log("ugoku");
	}
	if ($(this).parent().attr("class").search("multiple") < 0 && $(this).attr("class").search("ugoku-illust") < 0) {
		//console.log("normal");
		$(this).children("img").attr("src");
	}
});

// 取得 URL 判斷目前位置並加入按鈕
var url = window.location.href;
if (url.search("search.php") > 0) {
	$("div.pager-container").append('<span class="_button download_all">整頁下載</a>');
}
if (url.search("bookmark.php") > 0) {
	$("div.pager-container").append('<span class="_button download_all">整頁下載</a>');
}
if (url.search("member_illust.php") > 0 && url.search("mode") < 0) {
	$("div.pager-container").append('<span class="_button download_all">整頁下載</a>');
}
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

