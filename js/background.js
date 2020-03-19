import * as Common from "./modules/common.js";

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") { chrome.storage.sync.set({"EnableContext": true}, () => Common.toggleSettings(["EnableContext"])); }
});

chrome.contextMenus.onClicked.addListener(function(info) {
    switch (info.menuItemId) {
        case "createBookmark": Common.createBookmark({isContext: true}); break;
    }
});