var channels = ['favorites', 'trending', 'sports', 'drama', 'comedy', 'news', 'doctors'];
var limits = [1, 10, 10, 10, 10, 10, 10];

var favorites = [];
var favIds = [];
var fav = false;

var chanNum = 1;
var chanDisplay = '00';
var chanChangeTimer;
var prevChannel = [1, 1];

var showNum = 0;

var state = null;
var still = null;
var animate = null;
var gifName = '';
var gifRating = '';

var numClicked = false;
var numVal = '';
var numTimer;
var numDisplayTimer;

var info = false;
var hover = false;
var menu ='tv';
var hScroll = 0;

var api_key = '9Q3EhEbfCX4PIZY6SSPqQnSSngkJBDM7';
var limit = 10;

function changeChannel() {
// 	chanNum++;
	if(chanNum >= channels.length) {
		chanNum = 0;
	} else if(chanNum < 0) {
		chanNum = channels.length -1;
	}
	if(chanNum < 10) {
		chanDisplay = '0' + chanNum;
	} else {
		chanDisplay = chanNum;
	}
	clearTimeout(chanChangeTimer);
	$('.num-display').text(chanDisplay);
	$('.num-display').attr('class', 'num-display');
/*
	if(channels[chanNum] != 'black+screen') {
		$('.channel-display').text(channels[chanNum].toUpperCase());
	} else {
		$('.channel-display').text('Info');
	}
*/
	
	$('.channel-display').text(channels[chanNum].toUpperCase());
	$('.channel-display').attr('class', 'channel-display');
	
	chanChangeTimer = setTimeout(function() {
		$('.num-display').addClass('js-hidden');
		$('.channel-display').addClass('js-hidden');
	}, 2000)
	if(fav) {
		fav = false;
	} else {
		showNum = 0;
	}
	changeShow();
}
function changeShow() {
//	showNum++;

	$('.full-screen').addClass('js-hidden');
	info = false;

	if(chanNum != 0) {
		if(showNum >= limits[chanNum]) {
			showNum = 0;
		} else if(showNum < 0) {
			showNum = limits[chanNum] -1;
		}
		console.log(showNum);
		
/*
		if(chanNum == 1) {
			$.ajax({
				url: 'https://api.giphy.com/v1/gifs/trending?lang=en&api_key=9Q3EhEbfCX4PIZY6SSPqQnSSngkJBDM7'
				+ '&limit=' + limits[chanNum],
				method: "GET"
			}).then(function(response) {
				
			});
		} else {
*/
		var ajaxURL = '';
		if(chanNum == 1) {
			ajaxURL = 'https://api.giphy.com/v1/gifs/trending?lang=en&api_key=9Q3EhEbfCX4PIZY6SSPqQnSSngkJBDM7'
					+ '&limit=' + limits[chanNum];
		} else {
			ajaxURL = 'https://api.giphy.com/v1/gifs/search?lang=en&api_key=9Q3EhEbfCX4PIZY6SSPqQnSSngkJBDM7'
					+ '&limit=' + limits[chanNum] + '&q=' + channels[chanNum];
		}
		$.ajax({
			url: ajaxURL,
			method: "GET"
		}).then(function(response) {
			console.log(response);
			$('.gif').attr({
				'src': response.data[showNum].images.fixed_height.url,
				'data-still': response.data[showNum].images.fixed_height_still.url,
				'data-animate': response.data[showNum].images.fixed_height.url,
				'data-state': 'animate'
			});
			state = 'animate';
			still = response.data[showNum].images.fixed_height_still.url;
			animate = response.data[showNum].images.fixed_height.url;
			gifName = response.data[showNum].title;
			gifRating = response.data[showNum].rating.toUpperCase();
			$('#pause').attr('class', 'icon ion-pause');
		});
// 		}
	} else if(favorites.length != 0) {
		if(showNum >= favorites.length) {
			showNum = 0;
		} else if(showNum < 0) {
			showNum = favorites.length -1;
		}
		console.log('show num: ' + showNum);
		console.log('favorites: ' + favorites);
		console.log('Fav[showNum]: ' + favorites[showNum]);
		console.log('src: ' + favorites[showNum].images.fixed_height.url);
		$('.gif').attr({
			'src': favorites[showNum].images.fixed_height.url,
			'data-still': favorites[showNum].images.fixed_height_still.url,
			'data-animate': favorites[showNum].images.fixed_height.url,
			'data-state': 'animate'
		});
		state = 'animate';
		still = favorites[showNum].images.fixed_height_still.url;
		animate = favorites[showNum].images.fixed_height.url;
		gifName = favorites[showNum].title;
		gifRating = favorites[showNum].rating.toUpperCase();
		$('#pause').attr('class', 'icon ion-pause');
		
		console.log('gifName: ' + gifName);
		console.log('gifRating: ' + gifRating);

	} else {
		$('.gif').attr('src', 'assets/images/blank-screen.jpeg');
	}
}
function pausePlay() {
	if(state == 'animate') {
		$('.gif').attr('src', still);
		$('#pause').attr('class', 'icon ion-play');
		state = 'still';
	} else {
		$('.gif').attr('src', animate);
		$('#pause').attr('class', 'icon ion-pause');
		state = 'animate';
	}
}
function addShows() {
	limits[chanNum] = limits[chanNum] + 10;
	showNum = limits[chanNum] - 10;
	console.log('Current Limits: ' + limits[chanNum]);
	console.log('Show Number: ' + showNum);
	changeShow();
}
function addChannel() {
	var newChannel = $('.input').val().toLowerCase().trim();
	console.log(newChannel);
	if(channels.indexOf(newChannel) < 0. && newChannel != '') {
		$('.input').val('');
		chanNum = channels.length;
		logPrev();
		channels.push(newChannel);
		limits.push(10);
		changeChannel();
	} else if(newChannel != '') {
		chanNum = channels.indexOf(newChannel);
		logPrev();
		changeChannel();
	}
}
function favorite() {
	if(chanNum != 0) {
		$.ajax({
			url: 'https://api.giphy.com/v1/gifs/search?lang=en&api_key=9Q3EhEbfCX4PIZY6SSPqQnSSngkJBDM7'
			+ '&limit=' + limits[chanNum] + '&q=' + channels[chanNum],
			method: 'GET'
		}).then(function(response) {
			console.log(response.data[showNum].id);
			if(favIds.indexOf(response.data[showNum].id) < 0) {
				favIds.push(response.data[showNum].id);
				favorites.push(response.data[showNum]);
				
				var favIcon = $('<i>');
				favIcon.addClass('fav-display icon ion-heart');
				$('.fav-container').empty().append(favIcon);
			} else {
//				alert('already favorited!');
				chanNum = 0;
				logPrev();
				showNum = favIds.indexOf(response.data[showNum]);
				fav = true;
				changeChannel();
			}
			console.log(favorites);
			console.log(favIds);
		});
	} 
/*
	else if(favorites.length == 0) {
		alert('favorite something first!');
	} else{
		alert('already favorited!');
	}
*/
}
function logPrev() {
	prevChannel[0] = prevChannel[1];
	prevChannel[1] = chanNum;
}
function randomChan() {
	chanNum = Math.floor(Math.random() * channels.length);
	if(chanNum == 0) {
		randomChan();
	} else {
		logPrev();
		changeChannel();
	}
}
function numberClicked(number) {
	clearTimeout(chanChangeTimer);
	if(!numClicked) {
		numClicked = true;
		numVal += number;
		$('.num-display').text(numVal + '-');
		$('.num-display').attr('class', 'num-display');
		numTimer = setTimeout(function() {
			handleNums();
		}, 1500)
	} else {
		numVal += number;
		handleNums();
	}
}
function handleNums() {
	clearTimeout(numTimer);
//	clearTimeout(numDisplayTimer);
	numClicked = false;
	 
//	var numString = numVal;
	if(parseInt(numVal) < channels.length) {
		chanNum = parseInt(numVal);
		numVal = '';
		logPrev();
		changeChannel();
/*
		clearTimeout(chanChangeTimer);
		numDisplayTimer = setTimeout(function() {
			$('.num-display').addClass('js-hidden');
			$('.channel-display').addClass('js-hidden');
		}, 2000)
*/
	} else {
		numVal = ''
		changeChannel();
/*
		clearTimeout(chanChangeTimer);
		numDisplayTimer = setTimeout(function() {
			$('.num-display').addClass('js-hidden');
			$('.channel-display').addClass('js-hidden');
		}, 2000)
*/
	}
/*
	 if(parseInt(currentNum) < 10. && currentNum[0] != '0') {
		 numString = '0' + numString;
	 } else if(currentNum === '0') {
		 numString = '0' + numString;
	 }
	 $('.numDisplay').text(numString);
*/
}

/*
channels.forEach(function(channel) {
	$.ajax({
		url: 'https://api.giphy.com/v1/gifs/search?lang=en&api_key=9Q3EhEbfCX4PIZY6SSPqQnSSngkJBDM7' + '&limit=' + limit + '&q=' + channel,
		method: 'GET'
	}).then(function(response) {
		console.log(response);
	});
});

channels.forEach(function(channel) {
	$.ajax({
		url: 'https://api.giphy.com/v1/gifs/search?lang=en&api_key=9Q3EhEbfCX4PIZY6SSPqQnSSngkJBDM7&limit=10&q=' + channel,
		method: 'GET'
	}).then(function(response) {
		console.log(channel + ': ' + response);
	});
});
*/

function toggleInfo() {
	if(info) {
		info = false;
		hover = false;
		menu = 'tv';
		$('.full-screen').addClass('js-hidden');
		$('.ok').addClass('js-hidden');
		$('.pause').removeClass('js-hidden');
		
	} else {
		info = true;
		menu = 'info';
		
		$('.full-screen').empty();
		
		var infoDiv = $('<div>');
		infoDiv.addClass('info-display');
		
		var nameSpan = $('<span>');
		if(favorites.length == 0 && chanNum == 0) {
			nameSpan.text('N/A');
		} else {
			nameSpan.text(gifName);
		}
		
		var infoName = $('<p>');
		infoName.text('GIF Name: ');
		infoName.append(nameSpan);
		
		var channelSpan = $('<span>');
		channelSpan.text(chanDisplay + ' - ' + channels[chanNum]);
		
		var infoChan = $('<p>');
		infoChan.text('Channel: ');
		infoChan.append(channelSpan);
		
		var ratingSpan = $('<span>');
		if(favorites.length == 0 && chanNum == 0) {
			ratingSpan.text('N/A');
		} else {
			ratingSpan.text(gifRating);
			
		}
		
		var infoRating = $('<p>');
		infoRating.text('Rated: ');
		infoRating.append(ratingSpan);
		
		var backBtn = $('<div>');
		backBtn.attr('class', 'back-btn');
		backBtn.text('Back');
		
		infoDiv.append(infoName, infoChan, infoRating, backBtn);
		$('.full-screen').append(infoDiv);
		
		$('.full-screen').removeClass('js-hidden');
		
		$('.ok').removeClass('js-hidden');
		$('.pause').addClass('js-hidden');
	}
}
function toggleHelp() {
	if(menu === 'help') {
		menu = 'tv';
// 		hScroll = 0;
		$('.help-display').addClass('js-hidden');
		$('.ok').addClass('js-hidden');
		$('.pause').removeClass('js-hidden');
	} else {
//		scrollTo(0)
		menu = 'help';
		$('.help-display').removeClass('js-hidden');
		$('.ok').removeClass('js-hidden');
		$('.pause').addClass('js-hidden');
	}
}
function scrollTo(num) {
	$('html, .help-display').animate({
	    scrollTop: $('#help-' + num).offset().top
	}, 1000);
	console.log('help-' + num);
}
function scroll() {
	var elem = $('#help-' + hScroll);
	if(elem) {
		var main = $(".help-display"),
		t = main.offset().top;
		main.scrollTop(elem.position().top - t);
		console.log('help-' + hScroll);
	}
}
function scrollz() {
	
// 	$('html, .help-display').animate({
//     }, 1000);
	
/*
	$('.help-display').scrollTop($('.help-display').scrollTop() + $('#help-' + hScroll).position().top
    - $('.help-display').height()/2 + $('#help-' + hScroll).height()/2);
*/
    
	$('.help-display').animate({
/* 		$('.help-display'). */scrollTop: $('.help-display').scrollTop() + $('#help-' + hScroll).position().top
		- $('.help-display').height()/2 + $('#help-' + hScroll).height()/2
	}, 1000);
    
}

changeChannel();

$('.up').on('click', function() {
	if(info && !hover) {
		$('.back-btn').addClass('back-btn-hover');
		hover = true;
	} else if(hover) {
		$('.back-btn').removeClass('back-btn-hover');
		hover = false;
	} else if(menu === 'help') {
		if(hScroll > 0 && !hover) {
			hScroll--;
			scrollz();
		} else if(hover) {
			$('.back-btn').removeClass('back-btn-hover');
			hover = false;
		}
	} else {
		chanNum++;
		logPrev();
		changeChannel();
	}
});
$('.right').on('click', function() {
	if(info && !hover) {
		$('.back-btn').addClass('back-btn-hover');
		hover = true;
	} else if(hover) {
		$('.back-btn').removeClass('back-btn-hover');
		hover = false;
	} else if(menu === 'help') {
		
	} else {
		showNum++;
		changeShow();
	}
});
$('.down').on('click', function() {
	if(menu === 'info' && !hover) {
		$('.back-btn').addClass('back-btn-hover');
		hover = true;
	} else if(menu === 'info' && hover) {
		$('.back-btn').removeClass('back-btn-hover');
		hover = false;
	} else if(menu === 'help') {
		if(hScroll < 8) {
			hScroll++;
			scrollz();
		} else if(!hover) {
			$('.back-btn').addClass('back-btn-hover');
			hover = true;
		}
	} else {
		chanNum--;
		logPrev();
		changeChannel();
	}
});
$('.left').on('click', function() {
	if(info && !hover) {
		$('.back-btn').addClass('back-btn-hover');
		hover = true;
	} else if(hover) {
		$('.back-btn').removeClass('back-btn-hover');
		hover = false;
	} else if(menu === 'help') {
		
	
	} else {
		showNum--;
		changeShow();
	}
})
$('.pause').on('click', function() {
/*
	if(info && hover) {
		$('.full-screen').addClass('js-hidden');
		info = false;
		hover = false;
//		$('.pause').addClass()
	} else if(!hover) {
		pausePlay();
	}
*/
	if(menu === 'tv') {
		pausePlay();
	}

});
$('.ok').on('click', function() {
	if(menu === 'info' && hover) {
		toggleInfo();
	} else if(menu === 'help' && hover) {
		toggleHelp();
	}
});
$('.add').on('click', function() {
	if(menu === 'tv') {
		addShows();
	}	
});
$('.fav').on('click', function() {
	if(menu === 'tv') {
		favorite();
	}
});
$('.info').on('click', function() {
	if(menu === 'tv' || menu === 'info') {
		toggleInfo();
	}
});
$('.help').on('click', function() {
	if(menu === 'tv' || menu === 'help') {
		toggleHelp();
	}
})


$('#submit').on('click', function() {
	addChannel();
});




$('.number').on('click', function() {
	if(menu === 'tv') {
		numberClicked($(this).text());
	}
});
$('.back').on('click', function() {
	if(menu === 'tv') {
		chanNum = prevChannel[0];
		changeChannel();
		logPrev();
	}
});
$('.random').on('click', function() {
	if(menu === 'tv') {
		randomChan();
	}
});



$(document).on('click', '.back-btn', function() {
/*
	$('.full-screen').addClass('js-hidden');
	info = false;
*/
	if(menu === 'info') {
		toggleInfo();
	} else if (menu === 'help') {
		toggleHelp();
	}
});

$(document).ready(function() {

});