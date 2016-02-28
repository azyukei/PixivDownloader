/**
 * 隱藏預覽相關介面
 */
function hide_layer() {
	$("div.view_layer").hide();
	$("div.shadow_layer").hide();
}

/**
 * 傳入按鈕的 jquery selector，判斷目前所在的頁面並建立 works 物件回傳
 * @param  {object}	button	jQuery selected button
 * @return {[object]} works 物件，包含作品的相關資訊
 */
function get_works(button) {

	var works = [];

	// 收藏 - 整頁下載
	if (button.attr("class").indexOf("bookmark_download_all") > 0) {
		// 找出每個 _image-items
		$("ul._image-items").each(function() {
			// 排除推薦的作品
			if ($(this).attr("class").indexOf("no-response") < 0) {
				// 選出 a.work
				var a_work = $(this).children("li.image-item").children("a.work");

				// 將資料塞進 works
				a_work.each(function() {
					works.push({
						"title": $(this).parent().find("h1.title").text(),
						"id": "",
						"date": "",
						"time": "",
						"user_name": $(this).parent().find("a.user").attr("data-user_name"),
						"user_id": $(this).parent().find("a.user").attr("data-user_id"),
						"type": "png",
						"pages": 1,
						"multiple": is_multiple_work($(this)),
						"ugoku": is_ugoku_work($(this)),
						"site": "",
						"link": "http://www.pixiv.net/" + $(this).attr("href"),
						"manga_link": "",
						"img_src": $(this).children("div._layout-thumbnail").children("img").attr("src"),
						"source_links": [],
						"filenames": []
					});
				});
			}
		});
	}

	// 作品列表 - 整頁下載
	if (button.attr("class").indexOf("member_illust_download_all") > 0) {
		// 選出 a.work
		var a_work = $("ul._image-items > li.image-item > a.work");

		// 將資料塞進 works
		a_work.each(function() {
			works.push({
				"title": $(this).parent().find("h1.title").text(),
				"id": "",
				"date": "",
				"time": "",
				"user_name": $(this).parent().find("a.user").attr("data-user_name"),
				"user_id": $(this).parent().find("a.user").attr("data-user_id"),
				"type": "png",
				"pages": 1,
				"multiple": is_multiple_work($(this)),
				"ugoku": is_ugoku_work($(this)),
				"site": "",
				"link": "http://www.pixiv.net/" + $(this).attr("href"),
				"manga_link": "",
				"img_src": $(this).children("div._layout-thumbnail").children("img").attr("src"),
				"source_links": [],
				"filenames": []
			});
		});
	}

	// 插圖 - 下載
	if (button.attr("class").indexOf("illust_download") > 0) {
		// 選出 div.works_display
		var works_display = $("div.works_display");

		// 建立 work
		var work = {
			"title": $("div.ui-expander-target > h1.title").text(),
			"id": "",
			"date": "",
			"time": "",
			"user_name": $("h1.user").text(),
			"user_id": $('input[name="user_id"]').attr("value"),
			"type": "png",
			"pages": 1,
			"multiple": false,
			"ugoku": false,
			"site": "",
			"link": window.location.href,
			"manga_link": "",
			"img_src": "",
			"source_links": [],
			"filenames": []
		}

		// 判斷類型寫入資料
		if (works_display.find("._work").length == 1) {
			// 相簿
			work.multiple = true;
			work.img_src = works_display.find("img").attr("src");
		} else if (works_display.find("canvas").length == 1) {
			// 動圖
			work.ugoku = true;
		} else {
			// 一般作品使用圖片連結
			work.img_src = works_display.find("img").attr("src");
		}

		// 塞進 works
		works.push(work);
	}

	// 預覽圖 - view 或 download
	if (button.attr("class").indexOf("thumbnail_view") > 0 || button.attr("class").indexOf("thumbnail_download") > 0) {
		// 選出 a.work
		var a_work = $(button).parent().parent().find("a.work");

		// 塞進 worksg
		works.push({
			"title": a_work.parent().find("h1.title").text(),
			"id": "",
			"date": "",
			"time": "",
			"user_name": a_work.parent().find("a.user").attr("data-user_name"),
			"user_id": a_work.parent().find("a.user").attr("data-user_id"),
			"type": "png",
			"pages": 1,
			"multiple": is_multiple_work(a_work),
			"ugoku": is_ugoku_work(a_work),
			"site": "",
			"link": "http://www.pixiv.net/" + a_work.attr("href"),
			"manga_link": "",
			"img_src": a_work.children("div._layout-thumbnail").children("img").attr("src"),
			"source_links": [],
			"filenames": []
		});
	}

	return works;
}

/**
 * 判斷是否為相簿
 * @param  {object} work    jQuery selected a.work.
 * @return {Boolean} Is target an album or manga.
 */
function is_multiple_work(a_work) {
	return (a_work.attr("class").indexOf("multiple") > 0);
}

/**
 * 判斷是否為動圖
 * @param  {object} work    jQuery selected a.work.
 * @return {Boolean} Is target a ugoku.
 */
function is_ugoku_work(a_work) {
	return (a_work.attr("class").indexOf("ugoku-illust") > 0);
}

/**
 * 解析 url 拿到需要用的資料
 * @param  {[object]} url
 */
function parse_img_src(works) {
	for (var i = 0; i < works.length; i++) {
		works[i].site = works[i].img_src.substr(works[i].img_src.indexOf("//i") + 3, 1);
		works[i].date = works[i].img_src.substr(works[i].img_src.indexOf("img/") + 4, 10);
		works[i].time = works[i].img_src.substr(works[i].img_src.indexOf("img/") + 15, 8);
		works[i].id = works[i].img_src.substr(works[i].img_src.indexOf("img/") + 24, 8);
		works[i].id = works[i].id.substr(0, works[i].id.indexOf("_"));
	}
}

/** 
 * 將相簿作品連結變成漫畫連結
 * @param  {[object]} works
 * @return {string} manga_link
 */
function get_manga_link(works) {
	for (var i = 0; i < works.length; i++) {
		if (works[i].multiple) {
			var link = works[i].link;
			works[i].manga_link = link.replace("medium", "manga");
		}
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
				console.log(work);
				console.log("get_work_pages(), status: " + xhr.status);
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
	var filename = work.user_name + "-" + work.title + "(" + work.user_id + "-" + work.id + ")";
	filename = filename.replace(/[\\/:|]/g, " "); // 過濾特殊字元
	filename = filename.replace(/[*?"<>]/g, ""); // 過濾特殊字元g
	if (work.multiple) {
		for (var i = 0; i < work.source_links.length; i++) {

			work.filenames[i] = filename + "_p" + i;
		}
	} else {
		work.filenames[0] = filename;
	}
}

/**
 * 確認檔案類型，在 HEADERS_RECEIVED 狀態就終止，不要下載
 * @param  {object} work
 * @param  {Function} callback function(work, blob_type)
 */
function check_type(work, callback) {
	var blob_type;
	var xhr = new XMLHttpRequest();
	xhr.responseType = "blob";
	xhr.open("GET", work.source_links[0] + ".png");
	xhr.onreadystatechange = function(e) {
		if (xhr.readyState == 2) {
			if (xhr.status == 404) {

				work.type = "jpg";
				blob_type = "image/jpeg";
			} else if (xhr.status == 200) {
				work.type = "png";
				blob_type = "image/png";
			}
			xhr.abort();
			callback(work, blob_type);
		}
	};
	xhr.send(null);
}

/**
 * 加入新的下載任務
 * @param {[type]} download_task [description]
 */
function add_tasks(download_task) {
	download_tasks.push(download_task);
	// TODO: popup 要顯示出新的 task

	//確認是否可執行新的下載任務
	if (has_free_doing_tasks() && has_next_tasks()) {
		// 可以，準備下一個下載任務
		schedule_next_task();
	}
}

/**
 * 確認是否還有空間可執行新任務
 * @return {Boolean}
 */
function has_free_doing_tasks() {
	return doing_tasks < 1;
}

/**
 * 確認是否還有下載任務可以做
 * @return {Boolean}
 */
function has_next_tasks() {
	return download_tasks.length > 0;
}

/**
 * 安排新任務，並在結束任務後再安排下一個新任務
 */
function schedule_next_task() {
	// 從 download_tasks 中取出最早加入的一個任務開始執行
	start_task(download_tasks.shift(), function() {
		// 任務完成後
		doing_tasks -= 1; // 下載中任務-1
		//確認是否可執行新的下載任務
		if (has_free_doing_tasks() && has_next_tasks()) {
			// 可以，準備下一個下載任務
			schedule_next_task();
		}
	});
	doing_tasks += 1; // 加入任務後，執行中下載任務+1
}

function start_task(download_task, callback) {
	// 用 source_link 取回 blob
	request_source(download_task, function(blob, filename) {
		// 將 blob 變成最後要下載的連結
		var download_url = get_download_url(blob);
		// 下載影像！
		send_download_message(download_url, filename, function() {
			// 下載結束
			// TODO: 對 popup 介面做些更動
			download_task.callback();
			callback(); // 回到 schedule_next_task() 判斷是否執行下一個任務
		});
	});
}

/**
 * @param  {string} source_link 含副檔名
 * @param  {string} filename
 * @param  {string} type blob type
 * @param  {Function}
 */
function request_source(download_task, callback) {
	var xhr = new XMLHttpRequest();
	xhr.responseType = "blob";
	xhr.open("GET", download_task.source_link);
	xhr.onprogress = update_progress;
	xhr.onreadystatechange = function(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var blob = new Blob([xhr.response], {
				type: download_task.blob_type
			});
			callback(blob, download_task.filename);
		} else if (xhr.readyState == 4 && xhr.status != 200) {
			console.log(download_task);
			console.log("request_source(), status: " + xhr.readyState + ", " + xhr.status);
		}
	}
	xhr.send(null);
}


function update_progress(event) {
	if (event.lengthComputable) {
		//console.log(event.loaded / event.total);
	} else {
		//console.log(event.lengthComputable);
	}
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

/**
 * 傳送下載任務給 download.js background page
 * @param  {string}   download_url 下載網址
 * @param  {string}   filename     檔案名稱
 * @param  {Function} callback     callback 函式
 */
function send_download_message(download_url, filename, callback) {
	chrome.runtime.sendMessage({
		download_url: download_url,
		filename: filename
	}, function() {
		callback();
	});
}
