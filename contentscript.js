// 取得 URL 判斷目前位置
var url = window.location.href;
if (url.search("search.php") > 0) {
	console.log("搜尋");
}
if (url.search("bookmark.php") > 0) {
	console.log("某人的收藏");
}
if (url.search("member_illust.php") > 0 && url.search("mode") < 0) {
	console.log("某人的作品");
}
if (url.search("member_illust.php") > 0 && url.search("mode") > 0) {
	console.log("作品詳細");
}



// 加入按鈕






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

