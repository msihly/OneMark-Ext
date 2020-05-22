# OneMark Add-On Extension for Chrome
### The [OneMark Add-On](https://chrome.google.com/webstore/detail/cjklnajnighcegajggjfmjecfidllinm) is a companion Google Chrome extension for the visual-bookmark organizer [OneMark](https://onemark.herokuapp.com). The extension provides the ability to quickly create bookmarks of any page, including a screenshot of the active tab. The extension also supports the usage of 2 different accounts for Standard and Incognito browsing to quickly and seamlessly add bookmarks to the correct account.

---
# Changelog
## Version 1.05 &nbsp;-&nbsp; (2020-05-22)
* Fixed improper initialization order of 'Open OneMark' browser_action context-menu causing its removal

## Version 1.04 &nbsp;-&nbsp; (2020-05-22)
* Updated all JavaScript files to use ES6 consistently, cleanup functions and global scope, and extract common functions
    * Functions and object properties reordered lexicographically
    * Global variables all placed into single file-specific global `const`
    * Replaced all uses of `var` keyword with `let` and `const`
    * Shortened frequently used and unncessarily long variable names while expanding more specific names to make their purpose clearer
* Fixed initialization of context-menus
    * Created a wrapper function `toggleContext(...)` in `common.js` to prevent attempts at duplicate creation and removal of non-existing menus
    * Created context-menus now stored in Chrome sync storage for tracking
    * Default menus properly created on installation
    * Menus are removed and reinitiliazed in 'onInstalled' event listener
* Removed `toggleSettings(...)` function and merged functionality with `toggleSetting(...)`

## Version 1.03 &nbsp;-&nbsp; (2020-04-18)
* Added context-menu item to browser-action popup to link to the OneMark website

## Version 1.02 &nbsp;-&nbsp; (2020-03-19)
* Updated `onInstalled` listener in `background.js`
    * Action taken only on initial extension installation
    * Replaced hard-coding with new `toggleSettings(...)` function
* Fixed bug involving toggling settings from the options page
    * `toggleSetting()` function moved from `options.js` to `common.js` module
    * `toggleSettings(...)` function added to `common.js` module to facilitate settings actions
* Fixed bug involving `event` binding in the `createBookmark(...)` function in `common.js`

## Version 1.01 &nbsp;-&nbsp; (2020-03-16)
* Fixed bug caused by improper API syntax for checking incognito status

## Version 1.00 &nbsp;-&nbsp; (2020-03-10)
* Initial commit
    * Supporting files publicly available at the [OneMark-Public GitHub](https://github.com/msihly/OneMark-Public) *(see Version 0.80 in the changelog)*