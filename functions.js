// thumbnail 按鈕用，傳入按鈕 selector 回傳 url
function get_thumbnail_url(button) {
	return button.parent().nextAll("a.work").children("div._layout-thumbnail").children("img").attr("src");
}

// 解析 url 拿到需要用的資料
function parse_thumbnail_url(url) {
	// url = http://i3.pixiv.net/c/150x150/img-master/img/2015/12/16/18/28/45/54069002_p0_master1200.jpg
	var ix = url.substr(url.indexOf("//i") + 3, 1);
	var date = url.substr(url.indexOf("img/") + 4, 10);
	var time = url.substr(url.indexOf("img/") + 15, 8);
	var id = url.substr(url.indexOf("img/") + 24, 8);
	return {
		ix: ix,
		date: date,
		time: time,
		id: id
	};
}


// 輸入 a.work > div._layout-thumbnail > img 圖片連結
// 最後取得原圖的 array
function get_image_source (links, callback) {
	// 分析連結取得 ix, date, time, id
	// 
	// 檢查是否為相簿
		// 取得 相簿頁數
	// 取得其他資料
	// 製作原圖連結
	// 顯示原圖
}

function illust_request (link, callback) {
	var xmlhttp = new XMLHttpRequest();

}



// 將連結的陣列解析為 illust_id 的陣列
function parseLinks(links, illust_ids) {
	for (index in links) {
		var link = links[index];
		illust_ids.push(link.substr(link.indexOf("id=") + 3, 8));
	}
}