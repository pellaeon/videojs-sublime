var videoViewer = {
	UI : {
		playerTemplate : '<header><link href="'+OC.filePath('files_videojs-sublime', 'videojs', 'src')+'/video-js.css" rel="stylesheet"><script src="'+OC.filePath('files_videojs-sublime', 'videojs', 'src')+'/video.js"></script>' + '<script>' +
		'_V_.options.flash.swf = "'+OC.filePath('files_videojs-sublime', 'videojs', 'src')+'/video-js.swf"' +
		'</script>' + '</header><video id="my_video_1" class="video-js vjs-sublime-skin" controls preload="auto" width="100%" height="100%" poster="'+OC.filePath('files_videojs-sublime', '', 'img')+'/poster.png" data-setup="{}">' +
		'<source type="%type%" src="%src%" />' +
		'</video>',
		show : function () {
			// insert HTML
			$('<div id="videoplayer_overlay" style="display:none;"><div id="videoplayer_outer_container"><div id="videoplayer_container"><div id="videoplayer"><a class="box-close" id="box-close" href="#"></a></div></div></div></div>').appendTo('body');
			var playerView = videoViewer.UI.playerTemplate
								.replace(/%type%/g, videoViewer.mime)
								.replace(/%src%/g, videoViewer.location)
			;
			$(playerView).prependTo('#videoplayer');
			// add event to close icon
			$('#box-close').click(videoViewer.hidePlayer);
			// add event to overlay
			$("#videoplayer_overlay").on("click", function(e) {
				if (e.target != this) {
					return;
				} else {
					videoViewer.hidePlayer();
				}
			});
			// add event to ESC key
			$(document).keyup(function(e) {
			  if (e.keyCode === 27) {
			    videoViewer.hidePlayer();
			  }
			});
			// show elements
			$('#videoplayer_overlay').fadeIn('fast');
			// autoplay
			var vjsPlayer = videojs("my_video_1");
			vjsPlayer.play();
		},
		hide : function() {
			$('#videoplayer_overlay').fadeOut('fast', function() {
				$('#videoplayer_overlay').remove();
			});
		}
	},
	mime : null,
	file : null,
	location : null,
	player : null,
	mimeTypes : [
		'video/mp4',
		'video/webm',
		'video/x-flv',
		'video/ogg',
		'video/quicktime',
	],
	onView : function(file) {
		videoViewer.file = file;
		videoViewer.location = videoViewer.getMediaUrl(file);
		videoViewer.mime = FileActions.getCurrentMimeType();
		videoViewer.showPlayer();
	},
	showPlayer : function() {
		videoViewer.UI.show();
	},
	hidePlayer : function() {
		videoViewer.player = false;
		delete videoViewer.player;

		videoViewer.UI.hide();
	},
	getMediaUrl : function(file) {
		var dir = $('#dir').val();
		var rel = dir+'/'+file;
		return OC.generateURL('remote.php/webdav'+rel);
	},
	log : function(message){
		console.log(message);
	}
};

$(document).ready(function(){

	if (typeof FileActions !== 'undefined') {
		for (var i = 0; i < videoViewer.mimeTypes.length; ++i) {
			var mime = videoViewer.mimeTypes[i];
                        console.log(mime);
			FileActions.register(mime, 'View', OC.PERMISSION_READ, '', videoViewer.onView);
			FileActions.setDefault(mime, 'View');

		}
	}

});
