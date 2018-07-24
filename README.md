# gifTV

https://cdt12988.github.io/gifTV/

Welcome to gifTV!  This app allows the user to surf through various gifTV channels and view related gifs using an accompanying remote much like you would sitting on your couch 

at home! It also has some extra little features such as adding gifs to your own personal Favorites channel or adding a completely new channel of whatever you would like!  And best of all, the app can store these customizations for you for the next time you visit the app!

Read below to learn more about the app, its features and development notes.  (There's also an in-app help menu if you need help while in the app itself.)

## App Features

### gifTV

In addition to channels and gifs, gifTV has various menus that it can display.

#### Channels

By default, there are 53 built-in channels, including a Favorites channel, a Trending channel and 51 default channels.  

The default channels are built using API calls to [GIPHY's open source library](https://developers.giphy.com/).

The Trending channel uses a similar API call, but utilizes a different endpoint than the rest of the channels.

The Favorites channel is empty by default, but gifs that are favorited by the user will show up here afterwards (see Customization Options below).

Besides the 53 built-in channels, each user can add additional channels to their liking (see Customization Options below).

#### Gifs

By default, each individual channel will display 10 related gifs.  The only exception being the Favorites channel which does not contain any gifs by default.

Each user can add more gifs to any given channel by clicking the Add Gifs button on the remote (+).  These changes are even saved and able to be viewed the next time the user visits the app.  See the Customization Options below for more information about this.

### Menus

The app comes with 3 built-in menus available to it.

#### Guide

The guide feature allows the user to scroll through and view all of the current channels available using any of the arrow buttons.  The user can select a channel from the guide to change the channel.

#### Info

The info menu displays basic info about the current gif:

* The gif name (per the GIPHY API)
* The current channel
* The gif rating (per the GIPHY API)

#### Help

The help menu displays information about the remote's various features and buttons.  It can be navigated using the arrow buttons.

### Customization Options

The gifTV app uses local storage for data persistence, allowing the user to not only customize the app while they are in it using all of the below features, but to keep those changes the next time they view the app in the same browser.

#### Adding Favorites

Each user can favorites individual gifs by clicking the favorites button (heart icon).  Favorited gifs will then appear within their Favorites channel (channel 00) for them to view whenever they would like.

Attempting to favorite a gif that is already favorited will redirect the user to that same gif within the Favorites channel.

Favorited gifs are saved within local storage and will persist the next time the app is viewed in the same browser.

Note that because the channels are all built using API queries to GIPHY, each time the app is loaded may result in different gifs being loaded on different channels.  The favorites feature, however, allows you to save a specific gif that will persist even if it can no longer be found on the original channel it was favorited from.  The only way to lose the favorited gif is to clear it from local storage or if GIPHY no longer keeps the gif within its database.

#### Adding Channels

In addition to the 53 default channels, users can add custom channels to the channel list by typing the desired channel into the input field and clicking the Add Channel button (ADD).  This will add the channel to the end of the channels list and take the user immediately to that channel.

If the user enters a preexisting channel, they will instead be redirected to that channel.

Added channels are saved within local storage and will persist the next time the app is viewed in the same browser.

#### Adding Gifs

Each channel will load 10 gifs by default.  By clicking the Add Gifs button (+), the user can add additional gifs to the current channel.  Doing so will add 10 gifs to the channel and immediately change the current gif to the first of these ten new gifs.

There is a 3 second delay after the Add Gif button is clicked that prevents the user from adding additional gifs.  This is to give the app time to process the current API call before a new one is made (and to prevent spamming the API calls).

Added gifs to a specific channel are saved within local storage and will persist the next time the app is viewed in the same browser.  There is, however, a limit of 50 gifs that can be saved to any one channel and remain data persistent.  This is to prevent excessive API calls when the app is first loaded in the browser.  Additional gifs can be added after the app loads, but only up to 50 gifs are allowed to be loaded initially.

### Remote Control

The remote control allows the user to access all of the features of gifTV via its various buttons.  Below are a list of these buttons as well as their keyboard shortcuts in parentheses.

#### Control Pad

The control pad buttons allow the user to navigate and use gifTV's primary features.

##### Up/Down (Up/Down Arrows)

The up and down buttons change the current channel being viewed on the gifTV screen.

While in the various menus, they instead allow the user to scroll and navigate the menu.

##### Left/Right (Left/Right Arrows)

The left and right buttons change the current gif being displayed on the gifTV screen.

While in the various menus, they instead allow the user to more quickly scroll and navigate the menu.

##### Play/Pause (P)

The play button will will resume playing a gif that is currently paused on the gifTV screen.

The pause button will pause a gif that is currently playing on the gifTV screen.

##### OK (Enter/Return)

The ok (or select) button is used within the various auxiliary menus to select a highlighted item on the gifTV screen, either the "back" button in the Info/Help menus or the currently selected channel while within the guide.

#### Number Pad (0-9)

The number pad contains the Back and Random auxiliary buttons (see Auxiliary Buttons below) and ten numbers (0-9).  Pressing the numbers will change the channel accordingly on the gifTV screen.

While within the Guide Menu, pressing the numbers will quickly select the indicated channel instead.

The number pad only works up to two-digit numbers (0-99).

Changing the channel to a channel that does not currently exist will result in staying on the current channel while viewing the gifTV or navigating to the last channel while in the guide.

#### Auxiliary Buttons

The AUX buttons perform various secondary functions of the gifTV app.

##### Info Button (I)

The info button toggles the Info Menu on/off of the gifTV screen.  See the Info Menu section above for more information about the Info Menu.

##### Favorite Button (F)

The favorite button will add the current gif to the Favorites channel.  If the gif already exists on the Favorites channel, pressing this button will instead redirect you to the current gif within the Favorites channel.  See the Adding Favorites section above for more information about favoriting gifs.

##### Help Button (H)

The help button toggles the Help Menu on/off of the gifTV screen.  See the Help Menu section above for more information about the Help Menu.

#####Add Gif Button (+)

The add gif button adds 10 new gifs to the current channel and changes the current gif to the first of these 10 newly added ones.  See the Adding Gifs section above for more information about adding gifs.

##### Add Channel Button (Enter/Return)

The add channel button will add the channel typed into the input field to the list of channels available to gifTV along with 10 new related gifs.

If the input field is empty, clicking this button will instead select and add focus to the input field so the user can type their desired channel.  Clicking it again will either then add the channel or unfocus the input field (if still empty).  See the Adding Channels section above for more information about adding channels.

##### Exit Button (ESC)

The exit button exits out of the current menu when viewing the Guide, Info, or Help menus.  It will also exit out of the input field when it is currently focused.

##### Guide Button (G)

The guide button toggles the Guide Menu on/off of the gifTV screen.  See the Guide Menu section above for more information about the Guide Menu.

##### Back/Last Button (B)

The back button (or last button) will change the channel to the previously viewed channel.

##### Random Button (R)

The random button will change the channel to a random existing channel within the user's gifTV app.

### Other Features

In addition to clicking the remote buttons, users can use their keyboard to achieve the same results as clicking each button.  The Remote Control section above contains each button with its keyboard shortcut equivalent in parentheses.

While in the auxiliary menus (Info, Help and Guide), the mouse can be used to scroll through and click on the various menu options within the gifTV screen itself.

## Development Notes

### Languages Used

This app uses HTML5, CSS3, and JavaScript (with jQuery), with emphases on JSON formatting and Ajax API calls.

### Contributors

Cody Thompson is the sole contributor to this app thus far.

### To-Do List

The following are features I would like to still add to the app when I find the time:

* Improved Layout
* Improved Responsiveness, including better Mobile functionality
* Ensure cross-browser functionality
* New Button/Feature -- "Remove"
	- Removes saved channels and gifs from the user's local storage:
	- When on a non-default channel, will remove the current channel
	- When on a default channel, will reset the number of gifs back to its default number (10)
	- When on the Favorites channel, will remove the currently selected gif from the Favorites channel
* Add a letter pad that will appear when the input field is focused (I mainly want this feature so that the app can be navigated and used completely using just the remote).
