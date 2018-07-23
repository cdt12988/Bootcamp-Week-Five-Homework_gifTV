var tv = {
	menu: 'tv',
/**************************************************************************************************

											  Channels

**************************************************************************************************/	
	channels: {
		//	Variables
		num: 1,				
		display: '00',
		chanChangeTimer: null,
		//	Arrays
		prevChannel: [1, 1],
		initialChannels: ['favorites', 'trending', 'soap operas', 'local news', 'prime time',
			'sitcoms', 'game shows', 'public broadcasting', 'court room', 'sports',
			'fishing', 'cars', 'crime', 'music', 'entertainment',
			'fashion', 'scifi', 'cartoons', 'babies', 'cooking',
			'lifestyle', 'diy', 'home improvement', 'garden', 'infomercials',
			'animals', 'sharks', 'documentary', 'history', 'educational',
			'western', 'foreign', 'classic', 'news', 'politics',
			'finance', 'movies', 'family', 'comedy', 'romantic',
			'rom-com', 'drama', 'suspense', 'horror', 'action',
			'adventure', 'adult', 'hip hop', 'r&b', 'pop',
			'rock', 'classical', 'country'
			],
		storedChannels: JSON.parse(localStorage.getItem('channels')),
		initialLimits: [1],
		storedLimits: JSON.parse(localStorage.getItem('limits')),
		//	Methods
		logPrevChan: function() {
			//	this method stores the previous and current channel to use when needed
			//	sets first index to the second index value and then sets the second index value to the current channel
			this.prevChannel[0] = this.prevChannel[1];
			this.prevChannel[1] = this.num;
		},
		changeChannel: function() {
			//	if user attempts to move above last channel, resets to first; if they go below first, resets to last
			if(this.num >= this.storedChannels.length) {
				this.num = 0;
			} else if(this.num < 0) {
				this.num = this.storedChannels.length -1;
			}
			//	changes the channel display text to always be at least 2 digits
			if(this.num < 10) {
				this.display = '0' + this.num;
			} else {
				this.display = this.num;
			}
			//	clears the existing channel change timer, if any
			clearTimeout(this.chanChangeTimer);
			//	displays the channel number on screen
			$('.num-display').text(this.display);
			$('.num-display').attr('class', 'num-display');
			//	displays the channel text on screen
			$('.channel-display').text(this.storedChannels[this.num].toUpperCase());
			$('.channel-display').attr('class', 'channel-display');
			
			//	sets timer to remove the channel displays after 2 seconds
			this.chanChangeTimer = setTimeout(function() {
				$('.num-display').addClass('js-hidden');
				$('.channel-display').addClass('js-hidden');
			}, 2000)
			//	checks if user clicked 'fav' on an already favorited gif (this is set in the favorite() function)
			//	resets the var to false if true and leaves gifNum the same so it will take them to the selected gif
			//	otherwise, it sets the gifNum to 0
			//	--Dev Note-- ran into performance issues calling the API for specific gifs by gifNum, so set it back to 0 (the first index) each time
			if(this.favorites.fav) {
				this.favorites.fav = false;
			} else {
				tv.gifs.num = 0;
			}
			//	calls the changeGif method to actually call the API
			tv.gifs.changeGif();
		},
		addChannel: function() {
			//	captures and formats the new channel input
			var newChannel = $('.input').val().toLowerCase().trim();
			//	makes sure the new channel doesn't already exist and isn't an empty string
			//	--Dev Note-- Could use better validation methods and security measures
			if(this.storedChannels.indexOf(newChannel) < 0. && newChannel != '') {
				//	clears the input field
				$('.input').val('');
				//	changes the channel number to the new channel
				this.num = this.storedChannels.length;
				//	update the previous channel placeholder
				this.logPrevChan();
				//	add the new channel and limits to the stored channels/limits
				this.storedChannels.push(newChannel);
				this.storedLimits.push(10);
				//	update the user's local storage to include the new channels/limits
				localStorage.setItem('channels', JSON.stringify(this.storedChannels));
				localStorage.setItem('limits', JSON.stringify(this.storedLimits));
				//	change the channel using the updated info
				this.changeChannel();
			//	if the new channel already exists, change the channel to that channel
			} else if(newChannel != '') {
				$('.input').val('');
				this.num = this.storedChannels.indexOf(newChannel);
				this.logPrevChan();
				this.changeChannel();
			}
			$('#new-chan').blur();
		},
		randomChannel: function() {
			//	set channel number to a random number between 0 and the number of channels
			this.num = Math.floor(Math.random() * this.storedChannels.length);
			//	reruns the function if channel is 0 to prevent randomly selecting the favorites channel
			if(this.num == 0) {
				randomChan();
			//	otherwise, just change the channel to the new random number (after updating the previous channel holder)
			} else {
				this.logPrevChan();
				this.changeChannel();
			}
		},
		//	Favorites Object
		favorites: {
			fav: false,
			storedFavorites: JSON.parse(localStorage.getItem('favorites')),
			storedFavIds: JSON.parse(localStorage.getItem('favIds')),
			favorite: function() {
				//	ensures that the user can't favorite gifs already in the favorites channel
				if(tv.channels.num != 0) {
					//	changes the ajax URL to either the trending endpoint or the search endpoint (depending on the current channel) 
					if(tv.channels.num == 1) {
						ajaxURL = 'https://api.giphy.com/v1/gifs/trending?lang=en&api_key=9Q3EhEbfCX4PIZY6SSPqQnSSngkJBDM7'
								+ '&limit=' + tv.channels.storedLimits[tv.channels.num];
					} else {
						ajaxURL = 'https://api.giphy.com/v1/gifs/search?lang=en&api_key=9Q3EhEbfCX4PIZY6SSPqQnSSngkJBDM7'
								+ '&limit=' + tv.channels.storedLimits[tv.channels.num] + '&q=' + tv.channels.storedChannels[tv.channels.num];
					}
					//	perform the ajax call
					$.ajax({
						url: ajaxURL,
						method: 'GET'
					}).then(function(response) {
						//	checks that the favorited gif is not already in favorites (using the gif's API id)
						if(tv.channels.favorites.storedFavIds.indexOf(response.data[tv.gifs.num].id) < 0) {
							//	adds the gif object and id from the API call to the stored arrays
							tv.channels.favorites.storedFavIds.push(response.data[tv.gifs.num].id);
							tv.channels.favorites.storedFavorites.push(response.data[tv.gifs.num]);
							//	update the user's local storage to include the new favorited gif
							localStorage.setItem('favorites', JSON.stringify(tv.channels.favorites.storedFavorites));
							localStorage.setItem('favIds', JSON.stringify(tv.channels.favorites.storedFavIds));
							//	create and display the heart icon on screen for a moment (animation done in CSS)
							var favIcon = $('<i>');
							favIcon.addClass('fav-display icon ion-heart');
							$('.fav-container').empty().append(favIcon);
						//	if the gif has already been favorited, change the channel to favorites and display the same gif
						} else {
							tv.channels.num = 0;
							tv.channels.logPrevChan();
							//	gif.num set to the index number of the current gif id within the favorites array
							tv.gifs.num = tv.channels.favorites.storedFavIds.indexOf(response.data[tv.gifs.num].id);
							//	this variable is needed to override the default gif index number of 0 on channel change
							tv.channels.favorites.fav = true;
							tv.channels.changeChannel();
						}
					});
				} 
			}
		}
	},
/**************************************************************************************************

												GIFs

**************************************************************************************************/	
	gifs: {
		num: 0,
		state: null,
		still: null,
		animate: null,
		cooldown: false,
		name: '',
		rating: '',
		changeGif: function() {
			//	hides and resets the info menu in case this method is called from there
			$('.full-screen').addClass('js-hidden');
			tv.menus.info.info = false;
			//	if channel not on favorites:
			if(tv.channels.num != 0) {
				//	if user attempts to move above last gif, resets to first; if they go below first, resets to last
				if(tv.gifs.num >= tv.channels.storedLimits[tv.channels.num]) {
					tv.gifs.num = 0;
				} else if(tv.gifs.num < 0) {
					tv.gifs.num = tv.channels.storedLimits[tv.channels.num] -1;
				}
				//	changes the ajax URL to either the trending endpoint or the search endpoint (depending on the current channel)
				var ajaxURL = '';
				if(tv.channels.num == 1) {
					ajaxURL = 'https://api.giphy.com/v1/gifs/trending?lang=en&api_key=9Q3EhEbfCX4PIZY6SSPqQnSSngkJBDM7'
							+ '&limit=' + tv.channels.storedLimits[tv.channels.num];
				} else {
					ajaxURL = 'https://api.giphy.com/v1/gifs/search?lang=en&api_key=9Q3EhEbfCX4PIZY6SSPqQnSSngkJBDM7'
							+ '&limit=' + tv.channels.storedLimits[tv.channels.num] + '&q=' + tv.channels.storedChannels[tv.channels.num];
				}
				//	perform the ajax call
				$.ajax({
					url: ajaxURL,
					method: "GET"
				}).then(function(response) {
					//	display the gif on screen and set all if its data attributes
					$('.gif').attr({
						'src': response.data[tv.gifs.num].images.fixed_height.url,
						'data-still': response.data[tv.gifs.num].images.fixed_height_still.url,
						'data-animate': response.data[tv.gifs.num].images.fixed_height.url,
						'data-state': 'animate'
					});
					//	set the current gif's state to 'animate' and hold the URLs and other data for ease of use later
					tv.gifs.state = 'animate';
					tv.gifs.still = response.data[tv.gifs.num].images.fixed_height_still.url;
					tv.gifs.animate = response.data[tv.gifs.num].images.fixed_height.url;
					tv.gifs.name = response.data[tv.gifs.num].title;
					tv.gifs.rating = response.data[tv.gifs.num].rating.toUpperCase();
					//	ensure that the pause button is displayed instead of the play button since the default state is 'animate'
					$('#pause').attr('class', 'icon ion-pause');
				});
			//	The below code does very similar things as the above code, but uses the favorites array instead of the normal channels
			//	if channel is 'favorite' and favorites isn't empty:
			} else if(tv.channels.favorites.storedFavorites.length != 0) {
				//	if user attempts to move above last favorited gif, resets to first; if they go below first, resets to last	
				if(this.num >= tv.channels.favorites.storedFavorites.length) {
					tv.gifs.num = 0;
				} else if(this.num < 0) {
					tv.gifs.num = tv.channels.favorites.storedFavorites.length -1;
				}
				//	display the gif on screen and set all if its data attributes
				$('.gif').attr({
					'src': tv.channels.favorites.storedFavorites[tv.gifs.num].images.fixed_height.url,
					'data-still': tv.channels.favorites.storedFavorites[tv.gifs.num].images.fixed_height_still.url,
					'data-animate': tv.channels.favorites.storedFavorites[tv.gifs.num].images.fixed_height.url,
					'data-state': 'animate'
				});
				//	set the current gif's state to 'animate' and hold the URLs and other data for ease of use later
				tv.gifs.state = 'animate';
				tv.gifs.still = tv.channels.favorites.storedFavorites[tv.gifs.num].images.fixed_height_still.url;
				tv.gifs.animate = tv.channels.favorites.storedFavorites[tv.gifs.num].images.fixed_height.url;
				tv.gifs.name = tv.channels.favorites.storedFavorites[tv.gifs.num].title;
				tv.gifs.rating = tv.channels.favorites.storedFavorites[tv.gifs.num].rating.toUpperCase();
				//	ensure that the pause button is displayed instead of the play button since the default state is 'animate'
				$('#pause').attr('class', 'icon ion-pause');
			//	if on the favorites channel and nothing has been favorited, display a default blank screen
			} else {
				$('.gif').attr('src', 'assets/images/blank-screen.jpeg');
			}
		},
		addGifs: function() {
			if(!this.cooldown) {
				this.cooldown = true;
				//	increase the current channel's limit by 10
				tv.channels.storedLimits[tv.channels.num] = tv.channels.storedLimits[tv.channels.num] + 10;
				//	update the user's local storage with the new limits
				localStorage.setItem('limits', JSON.stringify(tv.channels.storedLimits));
				//	set the current gif to the first of the newest 10 gifs
				this.num = tv.channels.storedLimits[tv.channels.num] - 10;
				//	run the API call with the updated info
				this.changeGif();
				//	sets a 3 second cooldown before this method can be called again to prevent excessive API calls
				setTimeout(function() {
					this.cooldown = false;
				}, 3000);
			}
		},
		pausePlay: function() {
			//	toggles between the 'animate'/'still' state and changes the gif image and play/pause button accordingly
			if(tv.gifs.state == 'animate') {
				$('.gif').attr('src', tv.gifs.still);
				$('#pause').attr('class', 'icon ion-play');
				tv.gifs.state = 'still';
			} else {
				$('.gif').attr('src', tv.gifs.animate);
				$('#pause').attr('class', 'icon ion-pause');
				tv.gifs.state = 'animate';
			}
		}	
	},
/**************************************************************************************************

											TV Menus

**************************************************************************************************/
	menus: {
/***********************************************
					INFO
***********************************************/
		info: {
			info: false,
			hover: false,
			toggleInfo: function() {
				//	if info menu is already open, reset booleans, tv menu, and change displays accordingly
				if(this.info) {
					this.info = false;
					this.hover = false;
					tv.menu = 'tv';
					$('.full-screen').addClass('js-hidden');
					$('.ok').addClass('js-hidden');
					$('.pause').removeClass('js-hidden');
				//	if info menu is not open:
				} else {
					//	toggle boolean and set tv menu to info
					this.info = true;
					tv.menu = 'info';
					//	empty the info menu div
					$('.full-screen').empty();
					//	create a container div to display the current gif info
					var infoDiv = $('<div>');
					infoDiv.addClass('info-display');
					//	create a span to hold the current gif name
					var nameSpan = $('<span>');
					//	sets the name to 'N/A' if on the favorites channel and there aren't currently any favorites
					if(tv.channels.favorites.storedFavorites.length == 0 && tv.channels.num == 0) {
						nameSpan.text('N/A');
					//	otherwise, set the name to the current gif's name
					} else {
						nameSpan.text(tv.gifs.name);
					}
					//	create a paragraph to display the gif name info and append the gif name span
					var infoName = $('<p>');
					infoName.text('GIF Name: ');
					infoName.append(nameSpan);
					//	repeats the process above for the current channel number and name
					var channelSpan = $('<span>');
					channelSpan.text(tv.channels.display + ' - ' + tv.channels.storedChannels[tv.channels.num]);
					
					var infoChan = $('<p>');
					infoChan.text('Channel: ');
					infoChan.append(channelSpan);
					//	repeats the same process for the current gif's rating (displays 'N/A' if on favorites channel with no current favorites)
					var ratingSpan = $('<span>');
					if(tv.channels.favorites.storedFavorites.length == 0 && tv.channels.num == 0) {
						ratingSpan.text('N/A');
					} else {
						ratingSpan.text(tv.gifs.rating);	
					}
					var infoRating = $('<p>');
					infoRating.text('Rated: ');
					infoRating.append(ratingSpan);
					//	creates a back button
					var backBtn = $('<div>');
					backBtn.attr('class', 'back-btn');
					backBtn.text('Back');
					//	appends all the above elements to the info container div and appends that to the info menu display
					infoDiv.append(infoName, infoChan, infoRating, backBtn);
					$('.full-screen').append(infoDiv);
					//	shows the info menu
					$('.full-screen').removeClass('js-hidden');
					//	switches the select and play/pause button displays accordingly
					$('.ok').removeClass('js-hidden');
					$('.pause').addClass('js-hidden');
				}
			}
		},
/***********************************************
					HELP
***********************************************/
		help: {
			scrollId: 0,
			scroll: function() {
				$('.help-display').animate({
					//	scrolls to the element with the given scroll id within the help container
					scrollTop: $('.help-display').scrollTop() + $('#help-' + this.scrollId).position().top
					//	centers the id being scrolled to by dividing the heights in half and subtracting that from the top of the scroll
					- $('.help-display').height()/2 + $('#help-' + this.scrollId).height()/2
				}, 1000);
			},
			toggleHelp: function() {
				if(tv.menu === 'help') {
					//	hides the help menu and changes the select and play/pause buttons accordingly
					tv.menu = 'tv';
					$('.help-display').addClass('js-hidden');
					$('.ok').addClass('js-hidden');
					$('.pause').removeClass('js-hidden');
				} else {
					//	sets the scroll id and calls the help scroll method to scroll to the top of the menu
					this.scrollId = 0;
					this.scroll();
					//	shows the help menu and changes the select and play/pause buttons accordingly
					tv.menu = 'help';
					$('.help-display').removeClass('js-hidden');
					$('.ok').removeClass('js-hidden');
					$('.pause').addClass('js-hidden');
				}
			}
		},
/***********************************************
					GUIDE
***********************************************/
		guide: {
			selected: 0,
			scrollId: 0,
			toggleGuide: function() {
				if(tv.menu === 'guide') {
					tv.menu = 'tv';
					//	toggle guide displays off
					$('.guide-display').addClass('js-hidden');
					$('.ok').addClass('js-hidden');
					$('.pause').removeClass('js-hidden');
				} else {
					tv.menu = 'guide';
					$('.num-display').addClass('js-hidden');
					$('.guide-display').empty();
					
					//	dynamically creates the guide contents based on the current channels
					tv.channels.storedChannels.forEach(function(channel, i) {
						var divCont = $('<div>');
						divCont.attr({
							'class': 'guide-info',
							'data-chan': i
						});
						//	gives an id to every 4th div container for scrolling purposes
						if(i % 4 == 0) {
							divCont.attr('id', 'chan-' + i);
						}
						var numDiv = $('<div>');
						numDiv.addClass('guide-data');
						//	prepend a '0' to the channel number if less than 10
						var j = 0;
						i < 10 ? j = '0' + i : j = i;
						numDiv.text('Channel ' + j);
						
						var chanDiv = $('<div>');
						chanDiv.addClass('guide-data');
						chanDiv.text(channel.toUpperCase());
						
						divCont.append(numDiv, chanDiv);
						$('.guide-display').append(divCont);	
					});
					
					//	fills in the rest of the page with either 1, 2 or 3 empty placeholder divs depending on the modulo remainder (4 divs per guide page)
					if((tv.channels.storedChannels.length % 4) == 3) {
						var newDiv1 = $('<div>');
						newDiv1.addClass('empty-info');
//						newDiv1.attr('data-chan', 'na');
			
						$('.guide-display').append(newDiv1);
					} else if((tv.channels.storedChannels.length % 4) == 2) {
						var newDiv1 = $('<div>');
						newDiv1.addClass('empty-info');
//						newDiv1.attr('data-chan', 'na');
			
						var newDiv2 = $('<div>');
						newDiv2.addClass('empty-info');
//						newDiv2.attr('data-chan', 'na');
			
						$('.guide-display').append(newDiv1, newDiv2);
					} else if((tv.channels.storedChannels.length % 4) == 1) {
						var newDiv1 = $('<div>');
						newDiv1.addClass('empty-info');
//						newDiv1.attr('data-chan', 'na');
			
						var newDiv2 = $('<div>');
						newDiv2.addClass('empty-info');
//						newDiv2.attr('data-chan', 'na');
			
						var newDiv3 = $('<div>'); 
						newDiv3.addClass('empty-info');
//						newDiv3.attr('data-chan', 'na');
			
						$('.guide-display').append(newDiv1, newDiv2, newDiv3);
					}
					
					//	toggle guide displays on
					$('.guide-display').removeClass('js-hidden');
					$('.ok').removeClass('js-hidden');
					$('.pause').addClass('js-hidden');
					
					//	set the initial selected channel to be highlighted and use the mod4Floor formula to scroll to the nearest
					//	preceding guide page top
					tv.menus.guide.selected = tv.channels.num;
					tv.menus.guide.scrollId = tv.menus.guide.mod4Floor(tv.menus.guide.selected);
					tv.menus.guide.highlight();
					tv.menus.guide.scroll();
				}
			},
			scroll: function() {
				//	scrolls to the chan-id that equals the scrollId (set before calling the method)
				$('.guide-display').animate({
					scrollTop: $('.guide-display').scrollTop() + $('#chan-' + this.scrollId).position().top
				}, 0);
			},
			highlight: function() {
				//	loops through all channels and adds the .hovered class to the currently selected channel (removes it from the rest)
				for(var i = 0; i < tv.channels.storedChannels.length; i++) {
					if(i == this.selected) {
						$('[data-chan=' + i + ']').addClass('hovered');
					} else {
						$('[data-chan=' + i + ']').removeClass('hovered');
					}
				}
			},
			mod4Floor: function(number) {
				//	takes the given number (usually the currently selected guide-menu channel) and returns the nearest preceding multiple of 4
				//	used to scroll to the top of each 4-div guide page
				//	probably could have just used the tv.menus.guide.selected property instead of passing through an argument each time
				//	but I've gone too far now!
				//	this one line of code for this method now has 5 lines of comments...
				return Math.floor(number/4) * 4;
			}
		},
	}
}
var remote = {
/**************************************************************************************************

											Control Pad

**************************************************************************************************/
	controlPad: {
		upClicked: function() {
			if(tv.menus.info.info && !tv.menus.info.hover) {
				//	hovers over the back button of the info menu
				$('.back-btn').addClass('back-btn-hover');
				tv.menus.info.hover = true;
			} else if(tv.menus.info.hover) {
				//	removes hover if already hovering
				$('.back-btn').removeClass('back-btn-hover');
				tv.menus.info.hover = false;
			} else if(tv.menu === 'help') {
				if(tv.menus.help.scrollId > 0 && !tv.menus.info.hover) {
					//	decrement the scroll id before calling the scroll (scrolls up)
					tv.menus.help.scrollId--;
					tv.menus.help.scroll();
				} else if(tv.menus.info.hover) {
					//	removes any remaining hover effects from the info menu
					$('.back-btn').removeClass('back-btn-hover');
					tv.menus.info.hover = false;
				}
			} else if(tv.menu === 'guide') {
				tv.menus.guide.selected--;
				if(tv.menus.guide.selected < 0) {
					tv.menus.guide.selected = tv.channels.storedChannels.length - 1;
				}
				tv.menus.guide.scrollId = tv.menus.guide.mod4Floor(tv.menus.guide.selected);
				tv.menus.guide.highlight();
				tv.menus.guide.scroll();
			} else {
				//	change channel to the next channel if no other menus are selected
				tv.channels.num++;
				tv.channels.logPrevChan();
				tv.channels.changeChannel();
			}
		},
		downClicked: function() {
			if(tv.menu === 'info' && !tv.menus.info.hover) {
				//	hovers over the back button of the info menu
				$('.back-btn').addClass('back-btn-hover');
				tv.menus.info.hover = true;
			} else if(tv.menu === 'info' && tv.menus.info.hover) {
				//	removes hover if already hovering
				$('.back-btn').removeClass('back-btn-hover');
				tv.menus.info.hover = false;
			} else if(tv.menu === 'help') {
				if(tv.menus.help.scrollId < 8) {
					//	increment the scroll id before calling the scroll (scrolls down)
					tv.menus.help.scrollId++;
					tv.menus.help.scroll();
				} else if(!tv.menus.info.hover) {
					//	hovers the help menu back button
					$('.back-btn').addClass('back-btn-hover');
					tv.menus.info.hover = true;
				}
			} else if(tv.menu === 'guide') {
				// scrolls down the guide menu
				tv.menus.guide.selected++;
				if(tv.menus.guide.selected > tv.channels.storedChannels.length - 1) {
					tv.menus.guide.selected = 0;
				}
				tv.menus.guide.scrollId = tv.menus.guide.mod4Floor(tv.menus.guide.selected);
				tv.menus.guide.highlight();
				tv.menus.guide.scroll();
			} else {
				//	change channel to the preceding channel if no other menus are selected
				tv.channels.num--;
				tv.channels.logPrevChan();
				tv.channels.changeChannel();
			}
		},
		leftClicked: function() {
			if(tv.menus.info.info && !tv.menus.info.hover) {
				//	hovers over the back button of the info menu
				$('.back-btn').addClass('back-btn-hover');
				tv.menus.info.hover = true;
			} else if(tv.menus.info.hover) {
				//	removes hover if already hovering
				$('.back-btn').removeClass('back-btn-hover');
				tv.menus.info.hover = false;
			} else if(tv.menu === 'help') {
				if(tv.menus.help.scrollId > 0 && !tv.menus.info.hover) {
					//	scrolls twice as fast as the up/down buttons
					tv.menus.help.scrollId -= 2;
					//	ensures the scroll Id can't go below 0
					tv.menus.help.scrollId < 0 ? tv.menus.help.scrollId = 0 : tv.menus.help.scrollId = tv.menus.help.scrollId;
					tv.menus.help.scroll();
				} else if(tv.menus.info.hover) {
					//	hovers the back button of the help menu
					$('.back-btn').removeClass('back-btn-hover');
					tv.menus.info.hover = false;
				}	
			} else if(tv.menu === 'guide') {				
				if(tv.menus.guide.selected % 4 != 0) {
					//	if the currently selected channel is not already at the top, then assign the scrollId to the top of the current guide page
					//	and the selected item to the top of the current guide page also
					tv.menus.guide.scrollId = tv.menus.guide.mod4Floor(tv.menus.guide.selected);
					tv.menus.guide.selected = tv.menus.guide.scrollId;
				} else {
					//	if the currently selected channel IS already at the top, then assign the scrollId to the top of the previous guide page
					//	and the selected channel to the bottom of that guide page
					tv.menus.guide.scrollId = tv.menus.guide.mod4Floor(tv.menus.guide.selected - 4);
					tv.menus.guide.selected = tv.menus.guide.scrollId + 3;
				}
				if(tv.menus.guide.scrollId < 0) {
					//	resets to the last guide page/channel when user goes below channel 0
					tv.menus.guide.scrollId = tv.menus.guide.mod4Floor(tv.channels.storedChannels.length - 1);
					tv.menus.guide.selected = tv.channels.storedChannels.length - 1;
				}
				//	calls the scroll and highlight methods with the now assigned scrollId and selected properties
				tv.menus.guide.scroll();
				tv.menus.guide.highlight();
			} else {
				//	changes to the preceding gif if no other menu is selected
				tv.gifs.num--;
				tv.gifs.changeGif();
			}
		},
		rightClicked: function() {
			if(tv.menus.info.info && !tv.menus.info.hover) {
				//	hovers over the back button of the info menu
				$('.back-btn').addClass('back-btn-hover');
				hover = true;
			} else if(tv.menus.info.hover) {
				//	removes hover if already hovering
				$('.back-btn').removeClass('back-btn-hover');
				tv.menus.info.hover = false;
			} else if(tv.menu === 'help') {
				if(tv.menus.help.scrollId < 8) {
					//	scrolls twice as fast as the up/down buttons
					tv.menus.help.scrollId += 2;
					//	ensures the scroll Id can't go above the number of help ids
					tv.menus.help.scrollId > 8 ? tv.menus.help.scrollId = 8 : tv.menus.help.scrollId = tv.menus.help.scrollId;
					tv.menus.help.scroll();
				} else if(!tv.menus.info.hover) {
					//	hovers the back button of the help menu
					tv.menus.help.scrollId = 7;
					tv.menus.help.scroll();
					$('.back-btn').toggleClass('back-btn-hover');
					tv.menus.info.hover = true;
				}
			} else if(tv.menu === 'guide') {
				if(tv.menus.guide.selected % 4 == 3) {
					//	if the currently selected channel is at the bottom of the guide page, then assign the scrollId to the top of the next guide page
					//	and the selected item to the top of the next guide page also
					tv.menus.guide.scrollId = tv.menus.guide.mod4Floor(tv.menus.guide.selected + 4);
					tv.menus.guide.selected = tv.menus.guide.scrollId;
				} else {
					//	if the currently selected channel is NOT already at the bottom, then assign the scrollId to the top of the current guide page
					//	and the selected channel to the bottom of the current guide page
					tv.menus.guide.scrollId = tv.menus.guide.mod4Floor(tv.menus.guide.selected);
					tv.menus.guide.selected = tv.menus.guide.scrollId + 3;
				}
				if(tv.menus.guide.scrollId > tv.channels.storedChannels.length - 1) {
					//	resets to the first guide page/channel when user goes past the last channel
					tv.menus.guide.scrollId = 0;
					tv.menus.guide.selected = 0;
				}
				//	calls the scroll and highlight methods with the now assigned scrollId and selected properties
				tv.menus.guide.scroll();
				tv.menus.guide.highlight();
			} else {
				//	changes to the next gif if no other menu is selected
				tv.gifs.num++;
				tv.gifs.changeGif();
			}
		},
		pausePlayClicked: function() {
			if(tv.channels.num == 0 && tv.channels.favorites.storedFavorites.length == 0) {
			//	does nothing if on favorites channel and no favorites selected
		
			} else if(tv.menu === 'tv') {
				tv.gifs.pausePlay();
			}
		},
		selectClicked: function() {
			if(tv.menu === 'info' && tv.menus.info.hover) {
				tv.menus.info.toggleInfo();
				tv.menus.info.hover = false;
			} else if(tv.menu === 'help' && tv.menus.info.hover) {
				tv.menus.help.toggleHelp();
				tv.menus.info.hover = false;
			} else if(tv.menu === 'guide') {
				tv.channels.num = tv.menus.guide.selected;
				tv.channels.logPrevChan();
				tv.channels.changeChannel();
				tv.menus.guide.toggleGuide();
			}
		},
	},
/**************************************************************************************************

											AUX Buttons

**************************************************************************************************/
	auxButtons: {
		infoClicked: function() {
			if(tv.menu === 'tv' || tv.menu === 'info') {
				tv.menus.info.toggleInfo();
			}
		},
		helpClicked: function() {
			if(tv.menu === 'tv' || tv.menu === 'help') {
				tv.menus.help.toggleHelp();
			}
		},
		guideClicked: function() {
			if(tv.menu === 'tv' || tv.menu === 'guide') {
				tv.menus.guide.toggleGuide();
			}
		},
		favClicked: function() {
			if(tv.menu === 'tv') {
				tv.channels.favorites.favorite();
			}
		},
		addGifsClicked: function() {
			if(tv.menu === 'tv') {
					tv.gifs.addGifs();
			}
		},
		addChannelClicked: function() {
			if(tv.menu === 'tv') {
				if($('#new-chan').val() == '' && !($('#new-chan').is(':focus'))) {
					$('#new-chan').focus();
				} else if($('#new-chan').val() == '' && ($('#new-chan').is(':focus'))) {
					$('#new-chan').blur();
				} else {
					tv.channels.addChannel();
				}
			} else {
				$('#new-chan').val('');
			}
		},
		backClicked: function() {
			if(tv.menu === 'info') {
				tv.menus.info.toggleInfo();
			} else if (tv.menu === 'help') {
				tv.menus.help.toggleHelp();
			} else if (tv.menu === 'guide') {
				tv.menus.guide.toggleGuide();
			} else if (tv.menu === 'tv') {
				$('#new-chan').blur();
			}
		},
		lastClicked: function() {
			if(tv.menu === 'tv') {
				//	set current channel to the previous channel
				tv.channels.num = tv.channels.prevChannel[0];
				//	change the channel to the previous channel
				tv.channels.changeChannel();
				//	update the previous channels log
				tv.channels.logPrevChan();
			}
		},
		randomClicked: function() {
			if(tv.menu === 'tv') {
				tv.channels.randomChannel();
			}
		}
	},
/**************************************************************************************************

											Number Pad

**************************************************************************************************/
	numberPad: {
		numClicked: false,
		numVal: '',
		numTimer: null,
		numDisplayTimer: null,
		numberClicked: function(number) {
			//	clears the channel change timer if it exists to prevent the number display from hiding too early if user recently changed channels
			clearTimeout(tv.channels.chanChangeTimer);
			//	if this is the first number clicked:
			if(!this.numClicked) {
				//	toggle this boolean to keep track of which number the user is currently inputting (first/second)
				this.numClicked = true;
				//	build the number value string which will be our new channel number when done inputting
				this.numVal += number;
				//	since this is the first number inputted, display it plus a dash while we wait for the second number input
				$('.num-display').text(this.numVal + '-');
				$('.num-display').attr('class', 'num-display');
				//	set a timer that will deliver the single number input to be processed if not interrupted/cleared
				this.numTimer = setTimeout(function() {
					remote.numberPad.processNums();
				}, 1500);
			//	if this is the second number clicked:
			} else {
				//	add the second number to the number value string being built
				this.numVal += number;
				//	send both of the numbers input to be processed
				this.processNums();
			}
		},
		processNums: function() {
			//	clears/interrupts the number timer if it is still set from the first number input
			clearTimeout(this.numTimer);
			//	reset the toggle boolean
			this.numClicked = false;
			//	makes sure the inputted number is an actual channel number 
			if(parseInt(this.numVal) < tv.channels.storedChannels.length) {
				if(tv.menu === 'tv') {
				//	sets the channel number to the inputted string (converted to an integer)
				tv.channels.num = parseInt(this.numVal);
				//	logs the previous channel
				tv.channels.logPrevChan();
				//	change the channel using the updated info
				tv.channels.changeChannel();
				//	if the current menu is the guide, change the guide display instead 
				} else if(tv.menu === 'guide') {
					clearTimeout(this.numDisplayTimer);
					tv.menus.guide.selected = parseInt(this.numVal);
					tv.menus.guide.scrollId = tv.menus.guide.mod4Floor(tv.menus.guide.selected);
					tv.menus.guide.scroll();
					tv.menus.guide.highlight();
					$('.num-display').text(this.numVal);
					this.numDisplayTimer = setTimeout(function() {
						$('.num-display').addClass('js-hidden');
					}, 0);
				}
				//	resets the input string
				this.numVal = '';
			//	if the inputted channel number is not a channel number:
			} else {
				// reset the input string
				this.numVal = ''
				//	run changeChannel() without changing the channel (display purposes only)
				if(tv.menu === 'tv') {
					tv.channels.changeChannel();
				} else if(tv.menu === 'guide') {
					$('.num-display').addClass('js-hidden');
					tv.menus.guide.selected = tv.channels.storedChannels.length - 1;
					tv.menus.guide.scrollId = tv.menus.guide.mod4Floor(tv.menus.guide.selected);
					tv.menus.guide.scroll();
					tv.menus.guide.highlight();
				}
			}
		}
	}
}
/**************************************************************************************************

											Page Load

**************************************************************************************************/
$(document).ready( function() {
//	Sets channels to initial channels if not already stored locally
	if(!Array.isArray(tv.channels.storedChannels)) {
		tv.channels.storedChannels = tv.channels.initialChannels;
	}
//	Sets the limits to initial limits if not already stored locally
	if(!Array.isArray(tv.channels.storedLimits)) {
		tv.channels.storedLimits = tv.channels.initialLimits;
		for(var i = 0; i < tv.channels.storedChannels.length -1; i++) {
			tv.channels.storedLimits.push(10);
		}
	}
//	Sets favorites and fav Ids to empty arrays if not already stored locally
	if(!Array.isArray(tv.channels.favorites.storedFavorites || !Array.isArray(tv.channels.favorites.storedFavIds))) {
		tv.channels.favorites.storedFavorites = [];
		tv.channels.favorites.storedFavIds = [];
	}
//	Caps the limits allowed to come from local storage at 50 to prevent excessive API calls that will slow down the app
	tv.channels.storedLimits.forEach(function(limit) {
		if (limit > 50) {
			limit = 50;
		}
	});
//	Runs a channel change with the initial variables when the page first loads to initiate 
	tv.channels.changeChannel();
//	Set up button click event listeners
	$('.up').click(remote.controlPad.upClicked);
	$('.right').click(remote.controlPad.rightClicked);
	$('.down').click(remote.controlPad.downClicked);
	$('.left').click(remote.controlPad.leftClicked);
	$('.pause').click(remote.controlPad.pausePlayClicked);
	$('.ok').click(remote.controlPad.selectClicked);
	$('.add').click(remote.auxButtons.addGifsClicked);
	$('#submit').click(remote.auxButtons.addChannelClicked);
	$('.fav').click(remote.auxButtons.favClicked);
	$('.random').click(remote.auxButtons.randomClicked);
	$('.info').click(remote.auxButtons.infoClicked);
	$('.help').click(remote.auxButtons.helpClicked);	
	$('.guide').click(remote.auxButtons.guideClicked);
	$('.back').click(remote.auxButtons.lastClicked);
	$('.go-back').click(remote.auxButtons.backClicked);
	$('.number').click(function() {
		if(tv.menu === 'tv' || tv.menu === 'guide') {
			remote.numberPad.numberClicked($(this).text());
		}
	});
	$(document).on('click', '.back-btn', function() {
		if(tv.menu === 'info') {
			tv.menus.info.toggleInfo();
		} else if (tv.menu === 'help') {
			tv.menus.help.toggleHelp();
		}
	});
	$(document).on('click', '.guide-info', function() {
		$(this).attr('data-chan') === 'na' ? tv.channels.num = tv.channels.num : tv.channels.num = $(this).attr('data-chan');
		tv.channels.logPrevChan();
		tv.channels.changeChannel();
		tv.menus.guide.toggleGuide();
	});
	
//	Set up key up event listeners
	document.onkeyup = function(event) {
		//	Number Pressed
		if(/^[0-9]+$/.test(event.key) && !($('#new-chan').is(':focus'))) {
			remote.numberPad.numberClicked(event.key);
			
		//	Letter Pressed
		} else if(/^[a-z]+$/.test(event.key) && !($('#new-chan').is(':focus'))) {
			if(event.key == 'p') {
				remote.controlPad.pausePlayClicked();
			} else if(event.key == 'g') {
				remote.auxButtons.guideClicked();
			} else if(event.key == 'f') {
				remote.auxButtons.favClicked();
			} else if(event.key == 'i') {
				remote.auxButtons.infoClicked();
			} else if(event.key == 'h') {
				remote.auxButtons.helpClicked();
			} else if (event.key == 'b') {
				remote.auxButtons.lastClicked();
			} else if (event.key == 'r') {
				remote.auxButtons.randomClicked();
			}
			
		//	Left Arrow
		} else if(event.keyCode == 37) {
			remote.controlPad.leftClicked();	
		//	Up Arrow
		} else if(event.keyCode == 38) {
			event.preventDefault();
			remote.controlPad.upClicked();
		//	Right Arrow
		} else if(event.keyCode == 39) {
			remote.controlPad.rightClicked();
		//	Down Arrow
		} else if(event.keyCode == 40) {
			remote.controlPad.downClicked();
		//	Enter/Return
		} else if(event.keyCode == 13) {
			if(tv.menu == 'tv') {
				remote.auxButtons.addChannelClicked();
			} else {
				remote.controlPad.selectClicked();
			}
		//	ESC 
		} else if(event.keyCode == 27) {
			remote.auxButtons.backClicked();
		//	+ Sign
		} else if(event.shiftKey && event.keyCode == 187) {
			remote.auxButtons.addGifsClicked();
		}
	}
//	beginning code for switching numPad to letters
/*
	$("#new-chan").focus(function(){
		console.log($('#new-chan').is(':focus'));
		$('.number-buttons').toggleClass('js-hidden');
	});
*/
});		// end of document.ready()