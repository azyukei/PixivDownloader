// Background page
var download_queue = [];








// 設定 on Message event listener 接收下載任務
chrome.runtime.onMessage.addListener(function(download_task, sender, sendResponse) {
	//download_queue.push(download_task);
	console.log(sender);
	// 接收任務以後交給函式處理，完成後呼叫 callback 來讓 content function 收到 response
	quest(download_task.works, function() {
		sendResponse({ "status": "OK" });
	});
});


/**
 * @param  {string} source_link 含副檔名
 * @param  {string} filename
 * @param  {string} type blob type
 * @param  {Function}
 */
function request_source(source_link, filename, type, callback) {
	var xhr = new XMLHttpRequest();
	xhr.responseType = "blob";
	xhr.open("GET", source_link);
	xhr.onreadystatechange = function(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var blob = new Blob([xhr.response], {
				type: type
			});
			callback(blob, filename);
		}
	}
	xhr.send(null);
}

/**
 * 用 Blob 建立下載連結
 * @param  {Blob} blob
 * @return {string} download_url
 */
function get_download_url(blob) {
	var urlCreator = window.URL || window.webkitURL;
	return urlCreator.createObjectURL(blob);
}

function download_image(download_url, filename, callback) {
	chrome.downloads.download({
			url: download_url,
			filename: filename
		},
		function(downloadId) {
			callback(downloadId);
		});
}

/**
 * 分析漫畫連結來取得作品頁數
 * @param  {object} work
 * @return {string} pages
 */
function get_work_pages(work, callback) {
	if (work.multiple) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", work.manga_link, true);
		xhr.send();

		xhr.onload = function() {
			// 200 成功
			if (this.status == 200) {
				var html = $.parseHTML(this.response);
				work.pages = $(html).find("span.total").text();

				callback(work);
			} else {
				console.log(this.status);
			}
		}
	} else {
		callback(work);
	}

}

/**
 * 組成原圖連結
 * @param  {object} work
 */
function get_source_link(work) {
	for (var i = 0; i < work.pages; i++) {
		work.source_links[i] = "http://i" + work.site + ".pixiv.net/img-original/img/" + work.date + "/" + work.time + "/" + work.id + "_p" + i;
	}
}

/**
 * 根據設定建立檔案名稱
 * @param  {object} work
 */
function get_filename(work) {
	var filename = work.user_name + "-" + work.title + "(" + work.id + ")";
	filename = filename.replace(/[\\/:|]/g, " "); // 過濾特殊字元
	filename = filename.replace(/[*?"<>]/g, ""); // 過濾特殊字元g
	if (work.multiple) {
		for (var i = 0; i < work.source_links.length; i++) {

			work.filename[i] = filename + "_p" + i;
		}
	} else {
		work.filename[0] = filename;
	}
}

/**
 * 確認檔案類型，在 HEADERS_RECEIVED 狀態就終止，不要下載
 * @param  {object} work
 * @param  {Function} callback function(work, type)
 */
function check_type(work, callback) {
	var type;
	var xhr = new XMLHttpRequest();
	xhr.responseType = "blob";
	xhr.open("GET", work.source_links[0] + ".png");
	xhr.onreadystatechange = function(e) {
		if (xhr.readyState == 2) {
			if (xhr.status == 404) {

				work.type = "jpg";
				type = "image/jpeg";
			} else if (xhr.status == 200) {
				work.type = "png";
				type = "image/png";
				console.log(xhr.getAllResponseHeaders());
			}
			xhr.abort();
			callback(work, type);
		}
	};
	xhr.send(null);
}
