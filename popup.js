$(document).ready(function() {
	$(".btn_popup").click(function() {
		chrome.windows.create({ url: "http://www.pixiv.net/setting_profile.php", type: "popup", width: 800, height: 600}, function() {
			
		});
	});
});