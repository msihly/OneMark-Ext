import * as Cmn from "./modules/common.js";

chrome.runtime.onInstalled.addListener(details => {
    chrome.storage.sync.get(["EnableContext", "ContextMenus"], stored => {
        let defaults = {
            enableContext: stored.EnableContext === undefined ? true : stored.EnableContext,
            contextMenus: stored.ContextMenus === undefined ? [{id: "createBookmark", title: "Create Bookmark"}] : stored.ContextMenus
        }
        chrome.storage.sync.set({"EnableContext": defaults.enableContext, "ContextMenus": defaults.contextMenus}, () => {
            chrome.contextMenus.removeAll(() => {
                chrome.contextMenus.create({id: "openOnemark", title: "Open OneMark", contexts: ["browser_action"]});
                defaults.contextMenus.forEach(e => chrome.contextMenus.create({id: e.id, title: e.title}))
            });
        });
    });
});

chrome.contextMenus.onClicked.addListener(info => {
    switch (info.menuItemId) {
        case "createBookmark": Cmn.createBookmark({isContext: true}); break;
        case "openOnemark": chrome.tabs.create({url: "https://onemark.herokuapp.com"}); break;
    }
});