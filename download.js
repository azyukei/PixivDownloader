// Background page

var debug = true;

// 設定 on Message event listener 接收下載任務
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		// 接收任務以後交給函式處理，完成後呼叫 callback 來讓 content function 收到 response
		do_task(message.works, function() {
			sendResponse();
		});
	}
);

/**
 * 將 content script 傳來的資料加入下載任務中
 * @param {[type]}   works    [description]
 * @param {Function} callback [description]
 */
function do_task(works, callback) {
	// 將 works 中的所有 work 拆開去準備下載
	for (var i = 0; i < works.length; i++) {
		// 確認每個 work 中的影像數量
		get_work_pages(works[i], function(work) {
			// 取得原圖連結
			get_source_link(work);
			// 取得檔案名稱
			get_filename(work);
			// TODO: 將要下載的檔案顯示在 popup 介面中

			// 檢查檔案類型
			check_type(work, function(work, type) {
				if (debug) {
					console.log("after check_type()");
					console.log("type: " + type);
				}
				// 將 work 中的每個原圖連結分開處理
				for (var i = 0; i < work.source_links.length; i++) {
					// 將不含副檔名的 source_link 取出並加上副檔名
					var source_link = work.source_links[i] + "." + work.type;
					// 將不含副檔名的 filename 取出並加上副檔名
					var filename = work.filenames[i] + "." + work.type;
					// 取得 blob
					// TODO: 這邊需要做一個排隊的功能

					// 用 source_link 取回 blob
					request_source(source_link, function(blob) {
						if (debug) {
							console.log("after request_source(), blob: ");
							console.log(blob);
						}
						// 將 blob 變成最後要下載的連結
						var download_url = get_download_url(blob);
						// 下載影像！
						download_image(download_url, filename, function() {
							if (debug) {
								console.log("after download_image()");
								console.log("filename: " + filename);
							}
							// TODO: 下載結束後需對 popup 介面做些更動

							// 呼叫 callback 一路往回呼叫到 content_script 中將下載按鈕的暫停狀態復原
							callback();
						});
					});
				}
			});
		});
	}
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
			if (xhr.status == 200) {
				var html = $.parseHTML(xhr.response);
				work.pages = $(html).find("span.total").text();

				callback(work);
			} else {
				console.log(xhr.status);
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
	console.log(work.filename);
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
