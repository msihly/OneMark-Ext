/* global chrome */
export const getTabInfo = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
};

export const screenToDataUrl = async () => await chrome.tabs.captureVisibleTab({ quality: 80 });

export const toggleContext = ({ id, title, hasRemove = true }) => {
    title = title ?? id;

    chrome.storage.sync.get("ContextMenus", ({ ContextMenus }) => {
        if (hasRemove && ContextMenus.findIndex(c => c.id === id) > -1) {
            chrome.contextMenus.remove(id);
            ContextMenus.splice(ContextMenus.findIndex(c => c.id === id));
        } else if (!hasRemove && !ContextMenus.includes(id)) {
            chrome.contextMenus.create({ id, title });
            ContextMenus.push({ id, title });
        }

        chrome.storage.sync.set({ "ContextMenus": ContextMenus });
    });
};

export const toggleSetting = (setting) => {
    chrome.storage.sync.get(setting, stored => {
        const newState = stored[setting] ? false : true;

        if (setting === "EnableContext") {
            chrome.storage.sync.set({ "EnableContext": newState }, () => {
                toggleContext(newState ? { id: "createBookmark", title: "Create Bookmark", hasRemove: false } : { id: "createBookmark" });
            });
        }
    });
};