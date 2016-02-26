// Background page

// 設定 on Message event listener 接收下載任務
chrome.runtime.onMessage.addListener(
	function(download_task, sender, sendResponse) {
		// 下載影像
		download_image(download_task.download_url, download_task.filename);
	}
);

/**
 * 下載影像
 * @param  {string}   download_url 下載連結
 * @param  {string}   filename     檔案名稱
 * @param  {Function} callback     callback 函式
 */
function download_image(download_url, filename, callback) {
	chrome.downloads.download({
			url: download_url,
			filename: filename
		},
		function() {
			callback();
		}
	);
}
