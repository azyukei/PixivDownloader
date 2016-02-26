// Background page

// 設定 on Message event listener 接收下載任務
chrome.runtime.onMessage.addListener(
	function(download_task, sender, sendResponse) {
		download_image(download_task.download_url, download_task.filename);
	}
);

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
