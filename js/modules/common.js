/******************************* GENERAL *******************************/
export function capitalize(string) {
    return string[0].toUpperCase() + string.substring(1);
}

export function getRandomInt(min, max, cur) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return (num === cur) ? getRandomInt(min, max, cur) : num;
}

export function debounce(fn, delay) {
    var timeout;
    return function(...args) {
        if (timeout) { clearTimeout(timeout); }
        timeout = setTimeout(() => {
            fn(...args);
            timeout = null;
        }, delay);
    }
}

export function addListeners(data) {
	var errors = [];
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
        if (elements.length > 0) { elements.forEach(e => e.addEventListener(d.eventType, !d.debounce ? d.function : debounce(d.function.bind(e), d.debounce))); }
        else { errors.push(errMsg); }
    });
	if (errors.length > 0) { console.log(errors); }
}

export function toast(title, message, type) {
    var opt = {
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

export function insertInlineMessage(position, refNode, text, options = [{"type": "", "duration": 0}]) {
    var refNode = document.getElementById(refNode),
        parentNode = refNode.parentElement,
        tempID = (`${parentNode.id}-${refNode.id}`).replace(/[#.]/g, ""),
        prevNode = document.getElementById(tempID),
        msgNode = document.createElement("div");

    msgNode.classList.add("inline-message");
    msgNode.innerHTML = text;
    msgNode.id = tempID;

    if (prevNode) { prevNode.remove(); }

    switch (options.type) {
        case "info": msgNode.classList.add("bg-blue"); break;
        case "success": msgNode.classList.add("bg-green"); break;
        case "error": msgNode.classList.add("bg-red"); break;
        case "warning": msgNode.classList.add("bg-orange"); break;
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
export function isValid(element) {
    var validity = {"Valid": false, "Message": ""};
    switch (element.name) {
        case "title": case "pageURL": case "email": case "username": case "password": case "password-confirm":
            if (!element.value) { validity.Message = "Field is required"; return validity; }
    }
    switch (element.name) {
        case "title":
            if (element.value.length > 255) { validity.Message = "Title cannot be more than 255 characters"; return validity; }
            break;
        case "pageURL":
            var re = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;
            if (element.value.length > 2083) { validity.Message = "Page URL cannot be more than 2083 characters"; return validity; }
            else if (!re.test(element.value)) { validity.Message = "Invalid URL"; return validity; }
            break;
        case "email":
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (element.value.length > 255) { validity.Message = "Email cannot be more than 255 characters"; return validity; }
            else if (!re.test(element.value)) { validity.Message = "Invalid email"; return validity; }
            break;
        case "username":
            if (element.value.length > 40) { validity.Message = "Username cannot be more than 40 characters"; return validity; }
            break;
        case "password":
        case "password-new":
            if (element.value.length < 8) { validity.Message = "Password must be a minimum of 8 characters"; return validity; }
            var passConf = document.getElementById(`${element.id}-confirm`);
            if (passConf) { errorCheck.call(passConf); }
            if (element.id == "pass-new") {
                var passCur = document.getElementById("pass-cur");
                if (element.value === passCur.value) { validity.Message = "New password cannot match current password"; return validity; }
            }
            break;
        case "password-confirm":
            var pass = document.getElementById(element.id.substring(0, element.id.indexOf("-confirm")));
            if (element.value !== pass.value) { validity.Message = "Passwords do not match"; return validity; }
            break;
    }
    return {"Valid": true, "Message": "Field is valid"};
}

export function errorCheck() {
    var label = document.getElementById(`${this.id}-error`),
        validity = isValid(this);

    if(label === null) { return; }
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

export function checkErrors(elements) {
    var errors = [];
    elements.forEach(e => {
        if (e.type != "submit") { errors.push(errorCheck.call(e)); }
    });
    if (errors.includes(false)) { return false; }
    else { return true; }
}

/******************************* BOOKMARKS *******************************/
export async function createBookmark({isContext = false, tags = [], imageBlob = null}) {
    var e = event;
    if (e) { e.preventDefault(); }

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var isIncognito = tabs[0].incognito;

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
        var token = isIncognito ? stored.IncognitoAuthToken : stored.StandardAuthToken;
        if (!token) { return toast("Error: Authentication", `No account set for ${isIncognito ? "Incognito" : "Standard"} browsing`, "error"); }

        var response = await (await fetch("https://onemark.herokuapp.com/php/ext-add-bookmark.php", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })).json();

        response.Success ? toast("Success: Bookmark Creation", response.BookmarkInfo.Title, "success") : toast("Error: Bookmark Creation", response.Message, "error");
    });
}

/******************************* OPTIONS *******************************/
export function toggleSetting() {
    var setting = this.dataset.setting;
    chrome.storage.sync.get([setting], function(stored) {
        chrome.storage.sync.set({[setting]: (stored[setting] ? false : true)}, () => toggleSettings([setting]));
    });
}

export function toggleSettings(settings) {
    chrome.storage.sync.get(settings, function(stored) {
        stored.EnableContext ? chrome.contextMenus.create({id: "createBookmark", title: "Create Bookmark"}) : chrome.contextMenus.remove("createBookmark");
    });
}