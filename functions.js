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