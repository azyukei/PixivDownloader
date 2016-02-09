// 將連結的陣列解析為 illust_id 的陣列
function parseLinks(links, illust_ids) {
	for (index in links) {
		var link = links[index];
		illust_ids.push(link.substr(link.indexOf("id=") + 3, 8));
	}
};