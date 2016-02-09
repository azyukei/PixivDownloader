// 取得每張作品的連結
$("a.work").each(function( index ) {
	console.log( index + ": " + $(this).attr("href") + "." );
})