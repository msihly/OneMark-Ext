const CmnG = {
    months: ["", "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."],
    toasts: []
}

/******************************* GENERAL *******************************/
export function addListeners(data) {
	let errors = [];
    data.forEach(d => {
        let elements, errMsg;
        if (d.id) {
            elements = [document.getElementById(d.id)];
            errMsg = `Could not find element with ID: ${d.id}`;
        } else if (d.class) {
            elements = [...document.getElementsByClassName(d.class)];
            errMsg = `Could not find any elements with class: ${d.class}`;
        } else if (d.dataListener) {
            elements = document.querySelectorAll(`[data-listener~='${d.dataListener}']`);
            errMsg = `Could not find any elements with data-listener attribute: ${d.dataListener}`;
        } else if (d.domObject) {
            elements = [d.domObject];
        }
        if (elements.length > 0 && elements[0] !== null) {elements.forEach(e => e.addEventListener(d.eventType, !d.debounce ? d.function : debounce(d.function.bind(e), d.debounce))); }
        else { errors.push(errMsg); }
    });
	if (errors.length > 0) { console.log(errors); }
}

export function capitalize(string) {
    return string[0].toUpperCase() + string.substring(1);
}

export function checkEmpty(arr) {
    if (arr == undefined) { return console.error("Undefined reference passed to 'checkEmpty(arr)' function"); }
    return arr.length < 1 ? true : false;
}

export function debounce(fn, delay) {
    let timeout;
    return function(...args) {
        if (timeout) { clearTimeout(timeout); }
        timeout = setTimeout(() => {
            fn(...args);
            timeout = null;
        }, delay);
    }
}

export function getRandomInt(min, max, cur = null) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    return (num === cur) ? getRandomInt(min, max, cur) : num;
}

export function printDate(dateTime, type = "date") {
    let [year, month, day, time] = [dateTime.substring(0, 4), dateTime.substring(5, 7), dateTime.substring(8, 10), dateTime.substring(11)];
    switch (type) {
        case "date": return `${CmnG.months[+month]} ${day}, ${year}`;
        case "dateTime": return `${CmnG.months[+month]} ${day}, ${year} | ${new Date(`1970-01-01T${time}`).toLocaleTimeString({}, {hour: "numeric", minute: "numeric"})}`;
        case "time": return new Date(`1970-01-01T${time}`).toLocaleTimeString({}, {hour: "numeric", minute: "numeric"});
    }
}

/******************************* NOTIFICATIONS *******************************/
export function toast(title, message) {
    let opt = {
        type: "basic",
        title: title,
        message: String(message),
        iconUrl: "././images/logo-128.png"
    };
    chrome.notifications.create(opt, function(id) {
        setTimeout(function() {
            chrome.notifications.clear(id);
        }, 5000);
    });
}

export function inlineMessage(position, refNode, text, options = [{"type": "", "duration": 0}]) {
    refNode = document.getElementById(refNode);
    let parentNode = refNode.parentElement,
        tempID = (`${parentNode.id}-${refNode.id}`).replace(/[#.]/g, ""),
        prevNode = document.getElementById(tempID),
        msgNode = document.createElement("div");

    msgNode.classList.add("inline-message");
    msgNode.innerHTML = text;
    msgNode.id = tempID;

    if (prevNode) { prevNode.remove(); }

    switch (options.type) {
        case "info": case "blue": msgNode.classList.add("bg-blue"); break;
        case "success": case "green": msgNode.classList.add("bg-green"); break;
        case "error": case "red": msgNode.classList.add("bg-red"); break;
        case "warning": case "orange": msgNode.classList.add("bg-orange"); break;
    }

    switch (position) {
        case "before": parentNode.insertBefore(msgNode, refNode); break;
        case "after": parentNode.insertBefore(msgNode, refNode.nextSibling); break;
    }

    if (options.duration > 0) {
        setTimeout(() => msgNode.remove(), options.duration);
    }
}

/******************************* FORM *******************************/
export function checkErrors(elements) {
    let errors = [];
    elements.forEach(e => { if (e.type != "submit") { errors.push(errorCheck.call(e)); } });
    return !errors.includes(false);
}

export function errorCheck() {
    let label = document.getElementById(`${this.id}-error`),
        validity = isValid(this);

    if (label === null) { return; }
    if (!validity.Valid) {
        this.classList.add("invalid");
        label.innerHTML = validity.Message;
        label.classList.remove("invisible");
    } else {
        label.classList.add("invisible");
        label.innerHTML = "Valid";
        this.classList.remove("invalid");
    }

    return validity.Valid;
}

export function isValid(element) {
    let re,
        validity = {"Valid": false, "Message": ""};
    switch (element.name) {
        case "title": case "pageURL": case "email": case "username": case "password": case "password-confirm":
            if (!element.value) { validity.Message = "Field is required"; return validity; }
    }
    switch (element.name) {
        case "title":
            if (element.value.length > 255) { validity.Message = "Title cannot be more than 255 characters"; return validity; }
            break;
        case "pageURL":
            re = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;
            if (element.value.length > 2083) { validity.Message = "Page URL cannot be more than 2083 characters"; return validity; }
            else if (!re.test(element.value)) { validity.Message = "Invalid URL"; return validity; }
            break;
        case "email":
            re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (element.value.length > 255) { validity.Message = "Email cannot be more than 255 characters"; return validity; }
            else if (!re.test(element.value)) { validity.Message = "Invalid email"; return validity; }
            break;
        case "username":
            if (element.value.length > 40) { validity.Message = "Username cannot be more than 40 characters"; return validity; }
            break;
        case "password":
        case "password-new":
            if (element.value.length < 8) { validity.Message = "Password must be a minimum of 8 characters"; return validity; }
            let passConf = document.getElementById(`${element.id}-confirm`);
            if (passConf) { errorCheck.call(passConf); }
            if (element.id == "pass-new") {
                let passCur = document.getElementById("pass-cur");
                if (element.value === passCur.value) { validity.Message = "New password cannot match current password"; return validity; }
            }
            break;
        case "password-confirm":
            let pass = document.getElementById(element.id.substring(0, element.id.indexOf("-confirm")));
            if (element.value !== pass.value) { validity.Message = "Passwords do not match"; return validity; }
            break;
    }
    return {"Valid": true, "Message": "Field is valid"};
}

/******************************* BOOKMARKS *******************************/
export async function createBookmark({isContext = false, tags = [], imageBlob = null}) {
    let e = event;
    if (e) { e.preventDefault(); }

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let isIncognito = tabs[0].incognito;

        if (isContext) {
            let formData = new FormData();
            formData.append("title", tabs[0].title);
            formData.append("pageURL", tabs[0].url);
            chrome.tabs.captureVisibleTab({quality: 80}, async function(dataUrl) {
                formData.append("imageURL", await (await fetch(dataUrl)).blob(), `${tabs[0].title}.jpg`);
                uploadBookmark(formData, isIncognito);
            });
        } else {
            if (!checkErrors([...e.target.elements])) { return toast("Error: Bookmark Creation", "Errors in form fields", "error"); }
            let formData = new FormData(e.target);
            formData.append("tags", JSON.stringify(tags));
            formData.append("imageURL", imageBlob, `${formData.get("title")}.jpg`);
            uploadBookmark(formData, isIncognito);
        }
    });
}

export async function uploadBookmark(formData, isIncognito) {
    chrome.storage.sync.get(["StandardAuthToken", "IncognitoAuthToken"], async function(stored) {
        let token = isIncognito ? stored.IncognitoAuthToken : stored.StandardAuthToken;
        if (!token) { return toast("Error: Authentication", `No account set for ${isIncognito ? "Incognito" : "Standard"} browsing`, "error"); }

        let res = await (await fetch("https://onemark.herokuapp.com/php/ext-add-bookmark.php", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        })).json();

        res.Success ? toast("Success: Bookmark Creation", res.BookmarkInfo.Title, "success") : toast("Error: Bookmark Creation", res.Message, "error");
    });
}

/******************************* OPTIONS *******************************/
export function toggleContext({contextID, title = contextID, remove = true}) {
    chrome.storage.sync.get("ContextMenus", stored => {
        let menus = stored.ContextMenus;
        if (remove && menus.findIndex(({id}) => id == contextID) > -1) {
            chrome.contextMenus.remove(contextID);
            menus.splice(menus.findIndex(({id}) => id == contextID));
            chrome.storage.sync.set({"ContextMenus": menus});
        } else if (!remove && !menus.includes(contextID)) {
            chrome.contextMenus.create({id: contextID, title: title});
            menus.push({id: contextID, title: title});
            chrome.storage.sync.set({"ContextMenus": menus});
        }
    });
}

export function toggleSetting(setting) {
    setting = setting || event.target.dataset.setting;
    chrome.storage.sync.get(setting, stored => {
        let newState = stored[setting] ? false : true;
        switch (setting) {
            case "EnableContext":
                chrome.storage.sync.set({"EnableContext": newState}, () => {
                    newState ? toggleContext({contextID: "createBookmark", title: "Create Bookmark", remove: false}) : toggleContext({contextID: "createBookmark"});
                });
                break;
        }
    });
}