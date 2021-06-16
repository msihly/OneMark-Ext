chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["EnableContext", "ContextMenus"], stored => {
        const enableContext = stored.EnableContext ?? true;
        const contextMenus = stored.ContextMenus ?? [{ id: "createBookmark", title: "Create Bookmark" }];

        chrome.storage.sync.set({ "EnableContext": enableContext, "ContextMenus": contextMenus }, () => {
            chrome.contextMenus.removeAll(() => {
                chrome.contextMenus.create({ id: "openOnemark", title: "Open OneMark", contexts: ["action"] });

                contextMenus.forEach(({ id, title }) => chrome.contextMenus.create({ id, title }));
            });
        });
    });
});

chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
    if (menuItemId === "createBookmark") {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            const prefix = tabs[0].incognito ? "Incognito" : "Standard";
            const accessKey = `${prefix}AccessToken`;
            const refreshKey = `${prefix}RefreshToken`;

            chrome.storage.sync.get([accessKey, refreshKey], async (stored) => {
                const notifOptions = { iconUrl: "./media/logo-128.png", type: "basic" };
                if (!stored) return chrome.notifications.create({ ...notifOptions, title: "Error: No account set" });

                const formData = new FormData();

                formData.append("title", tabs[0].title);
                formData.append("pageUrl", tabs[0].url);

                const imageBlob = await(await fetch(await chrome.tabs.captureVisibleTab({ quality: 80 }))).blob();
                formData.append("file", imageBlob, `${tabs[0].title}.jpg`);

                const res = await (await fetch("https://onemark.herokuapp.com/api/bookmark", {
                    method: "POST",
                    body: formData,
                    headers: { "Authorization": `Bearer ${stored[accessKey]} ${stored[refreshKey]}` }
                })).json();

                if (!res.success) return chrome.notifications.create({ ...notifOptions, title: "Error creating bookmark!", message: res?.message });
                chrome.notifications.create({ ...notifOptions, title: "Success: Bookmark created!", message: tabs[0].title });
            });
        });
    }

    if (menuItemId === "openOnemark") chrome.tabs.create({ url: "https://onemark.herokuapp.com" });
});