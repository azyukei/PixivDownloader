// 作品連結的 Array
var links = [];
var illust_ids = [];

// 將連結的陣列解析為 illust_id 的陣列
function parseLinks(links, illust_ids) {
	for (index in links) {
		var link = links[index];
		illust_ids.push(link.substr(link.indexOf("id=") + 3, 8));
	}
};

// 取得每張作品的連結
$("a.work").each(function( index ) {
	links[index] = $(this).attr("href");
});

parseLinks(links, illust_ids);

for (index in illust_ids) {
	var illust_id = illust_ids[index];
	console.log(illust_id);
};
