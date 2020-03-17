import * as Common from "./modules/common.js";

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get(["EnableContext"], function(stored) {
        if (stored.EnableContext) {
            chrome.contextMenus.create({id: "createBookmark", title: "Create Bookmark"});
        }
    });
});

chrome.contextMenus.onClicked.addListener(function(info) {
    switch (info.menuItemId) {
        case "createBookmark": Common.createBookmark({isContext: true}); break;
    }
});