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

// 取得原圖網址
// illust_id=55063306
// img-original=http://i3.pixiv.net/img-original/img/2016/02/03/14/25/17/55063306_p0.jpg
// 缺少資訊：
// 相簿的頁數 p0 p1...
// 相簿的日期時間 2016/02/03/14/25/17