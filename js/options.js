import * as Common from "./modules/common.js";

const eventListeners = [{
        "id": "login-form",
        "eventType": "submit",
        "function": login
    }, {
        "id": "redir-incognito",
        "eventType": "click",
        "function": function(event) { redirExtPage(event, "setting-incognito"); }
    }, {
        "dataListener": "logout",
        "eventType": "click",
        "function": logout
    }, {
        "dataListener": "toggle",
        "eventType": "click",
        "function": Common.toggleSetting
    }];

document.addEventListener("DOMContentLoaded", function() {
    Common.addListeners(eventListeners);
    chrome.storage.sync.get(["StandardUsername", "IncognitoUsername", "EnableContext"], function(stored) {
        if (stored.StandardUsername) { document.getElementById("acc-standard").innerHTML = stored.StandardUsername; }
        if (stored.IncognitoUsername) { document.getElementById("acc-incognito").innerHTML = stored.IncognitoUsername; }
        document.getElementById("context-enabled").checked = stored.EnableContext ? "checked" : "";
    });
    chrome.extension.isAllowedIncognitoAccess(function(isAllowedAccess) {
        if (!isAllowedAccess) { document.getElementById("incognito-enabled").checked = ""; }
    });
});

async function login(event) {
    event.preventDefault();
    if (!Common.checkErrors([...this.elements])) { return Common.toast("Error: Incorrect Form Fields", "Correct the errors in the form fields", "error"); }

    var formData = new FormData(this),
        username = formData.get("username"),
        forIncognito = formData.get("incognito");
    chrome.storage.sync.get(["StandardUsername", "IncognitoUsername"], async function (stored) {
        if ((username == stored.StandardUsername && !forIncognito) || (username == stored.IncognitoUsername && forIncognito)) {
            return Common.insertInlineMessage("after", "login", `Account already in use for ${forIncognito ? "Incognito": "Standard"}`, {type: "error"});
        }

        var response = await (await fetch("https://onemark.herokuapp.com/php/ext-login.php", {method: "POST", body: formData})).json();

        if (response.Success) {
            if (forIncognito) { chrome.storage.sync.set({IncognitoUsername: username, IncognitoUID: response.UID, IncognitoAuthToken: response.Token}); }
            else { chrome.storage.sync.set({StandardUsername: username, StandardUID: response.UID, StandardAuthToken: response.Token}); }
            Common.insertInlineMessage("after", "login", `Account [${username}] set for ${forIncognito ? "Incognito": "Standard"} browsing`, {type: "success", duration: 3000});
        } else {
            Common.insertInlineMessage("after", "login", response.Message, {type: "error"});
        }
    });
}

function logout() {
    var type = Common.capitalize(this.dataset.acc);
    chrome.storage.sync.remove([`${type}Username`, `${type}UID`, `${type}AuthToken`]);
    this.previousElementSibling.innerHTML = "No account set";
}

function redirExtPage(event, inlineNode) {
    event.preventDefault();
    Common.insertInlineMessage("after", inlineNode, "Redirecting to extension page...", {type: "info", duration: 2000});
    setTimeout(function() {chrome.tabs.create({url: `chrome://extensions/?id=${chrome.runtime.id}`})}, 2000);
}