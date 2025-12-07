
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();

$(function () {
    // setup garden
	$loveHeart = $("#loveHeart");
	var offsetX = $loveHeart.width() / 2;
	var offsetY = $loveHeart.height() / 2 - 55;
    $garden = $("#garden");
    gardenCanvas = $garden[0];
	gardenCanvas.width = $("#loveHeart").width();
    gardenCanvas.height = $("#loveHeart").height()
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);
	
	$("#content").css("width", $loveHeart.width() + $("#code").width());
	$("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
	$("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
	$("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));

    // renderLoop
    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);
});

$(window).resize(function() {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth != clientWidth && newHeight != clientHeight) {
        location.replace(location);
    }
});

function getHeartPoint(angle) {
	var t = angle / Math.PI;
	var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
	var y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
	return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
	var interval = 100;  // kalp animasyonun gecikmesi xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
	var angle = 10;
	var heart = new Array();
	var animationTimer = setInterval(function () {
		var bloom = getHeartPoint(angle);
		var draw = true;
		for (var i = 0; i < heart.length; i++) {
			var p = heart[i];
			var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
			if (distance < Garden.options.bloomRadius.max * 1.3) {
				draw = false;
				break;
			}
		}
		if (draw) {
			heart.push(bloom);
			garden.createRandomBloom(bloom[0], bloom[1]);
		}
		if (angle >= 30) {
			clearInterval(animationTimer);
			showMessages();
		} else {
			angle += 0.2;
		}
	}, interval);
}

(function($) {
	$.fn.typewriter = function() {
		this.each(function() {
			var $ele = $(this), str = $ele.html(), progress = 0;
			$ele.html('');
			var timer = setInterval(function() {
				var current = str.substr(progress, 1);
				if (current == '<') {
					progress = str.indexOf('>', progress) + 1;
				} else {
					progress++;
				}
				$ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
				if (progress >= str.length) {
					clearInterval(timer);
				}
			}, 50); //dsfasfdfasdgfdsfgdsfgsdfg      Yazdırma gecikmesi xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
		});
		return this;
	};
})(jQuery);

function timeElapse(date){
	var current = Date();
	var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
	var days = Math.floor(seconds / (3600 * 24));
	seconds = seconds % (3600 * 24);
	var hours = Math.floor(seconds / 3600);
	if (hours < 10) {
		hours = "0" + hours;
	}
	seconds = seconds % 3600;
	var minutes = Math.floor(seconds / 60);
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	seconds = seconds % 60;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var result = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds"; 
	$("#elapseClock").html(result);
}

function showMessages() {
	adjustWordsPosition();
	$('#messages').fadeIn(5000, function() {
		showLoveU();
	});
}

function adjustWordsPosition() {
	$('#words').css("position", "absolute");
	$('#words').css("top", $("#garden").position().top + 195);
	$('#words').css("left", $("#garden").position().left + 70);
}

function adjustCodePosition() {
	$('#code').css("margin-top", ($("#garden").height() - $("#code").height()) / 2);
}

function showLoveU() {
	$('#loveu').fadeIn(3000);
}
// Görseli göstermek için fonksiyon
function showImage() {
	// Popup ve overlay'yi görünür hale getirme
	document.getElementById('popupImage').style.display = 'flex';
	document.getElementById('popupOverlay').style.display = 'block';
	
	// Popup'ın animasyonla görünmesini sağlamak
	setTimeout(function() {
	  document.getElementById('popupImage').style.opacity = '1';
	  document.getElementById('popupImage').style.transform = 'scale(1)';
	}, 50); // Animasyonun başlaması için kısa bir gecikme ekliyoruz
  }
  
  // Görseli kapatmak için fonksiyon
  document.getElementById('popupOverlay').onclick = function() {
	// Popup ve overlay'yi gizleme
	document.getElementById('popupImage').style.opacity = '0';
	document.getElementById('popupImage').style.transform = 'scale(0.9)';
	
	setTimeout(function() {
	  document.getElementById('popupImage').style.display = 'none';
	  document.getElementById('popupOverlay').style.display = 'none';
	}, 300); // Kapanma animasyonunun bitmesini bekliyoruz
  };

var player;
var currentTrack = 0;

var playlist = [
	"ZtG3eMZL8x8",
    "9rsA8UmGxwA", // 1. şarkı
    "BVZOt7D3ZaI",
	"9rsA8UmGxwA"  // 2. şarkı
];

// YouTube API hazır olduğunda çalışır
function onYouTubeIframeAPIReady() {
    player = new YT.Player('hiddenPlayer', {
        height: '0',
        width: '0',
        videoId: playlist[currentTrack],
        playerVars: {
            'autoplay': 0,   // ❌ Autoplay artık kapalı
            'controls': 0,
            'mute': 0        // ❌ Sessiz başlamak yok
        },
        events: {
            'onReady': onPlayerReady,
        }
    });
}

function onPlayerReady() {
    // ❌ Artık otomatik oynatma yok, boş bırakıyoruz
    console.log("Player hazır.");
}

// Buton Eventleri
$(document).ready(function () {

    // Play / Pause
    $("#playPauseBtn").click(function () {
        // Eğer oynuyorsa durdur
        if (player.getPlayerState() === 1) {
            player.pauseVideo();
        } 
        // Eğer duruyorsa oynat + sesi aç
        else {
            player.unMute();
            player.playVideo();
        }
    });

    // Sonraki şarkı
    $("#nextBtn").click(function () {
        currentTrack = (currentTrack + 1) % playlist.length;
        player.loadVideoById(playlist[currentTrack]);
        player.unMute();
        player.playVideo();
    });

    // Önceki şarkı
    $("#prevBtn").click(function () {
        currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
        player.loadVideoById(playlist[currentTrack]);
        player.unMute();
        player.playVideo();
    });

});
