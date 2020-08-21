import * as Cmn from "./modules/common.js";

const OptG = {
    eventListeners: [{
        "id": "login-form",
        "eventType": "submit",
        "function": login
    }, {
        "id": "redir-incognito",
        "eventType": "click",
        "function": () => redirExtPage("setting-incognito")
    }, {
        "dataListener": "logout",
        "eventType": "click",
        "function": logout
    }, {
        "dataListener": "toggle",
        "eventType": "click",
        "function": () => Cmn.toggleSetting()
    }]
}

document.addEventListener("DOMContentLoaded", function() {
    Cmn.addListeners(OptG.eventListeners);

    chrome.storage.sync.get(["StandardUsername", "IncognitoUsername", "EnableContext"], stored => {
        if (stored.StandardUsername) { document.getElementById("acc-standard").innerHTML = stored.StandardUsername; }
        if (stored.IncognitoUsername) { document.getElementById("acc-incognito").innerHTML = stored.IncognitoUsername; }
        document.getElementById("context-enabled").checked = stored.EnableContext ? "checked" : "";
    });

    chrome.extension.isAllowedIncognitoAccess(isAllowedAccess => { if (!isAllowedAccess) { document.getElementById("incognito-enabled").checked = ""; }});
});

async function login() {
    event.preventDefault();
    if (!Cmn.checkErrors([...this.elements])) { return Cmn.toast("Error: Incorrect Form Fields", "Correct the errors in the form fields", "error"); }

    let formData = new FormData(this),
        username = formData.get("username"),
        forIncognito = formData.get("incognito");

    chrome.storage.sync.get(["StandardUsername", "IncognitoUsername"], async function (stored) {
        if ((username == stored.StandardUsername && !forIncognito) || (username == stored.IncognitoUsername && forIncognito)) {
            return Cmn.inlineMessage("after", "login", `Account already in use for ${forIncognito ? "Incognito": "Standard"}`, {type: "error"});
        }

        let res = await (await fetch("https://onemark.herokuapp.com/api/ext/user/login", {method: "POST", body: formData})).json();
        if (res.success) {
            let type = forIncognito ? "Incognito" : "Standard";
            chrome.storage.sync.set({[`${type}Username`]: username, [`${type}UID`]: res.userId, [`${type}AuthToken`]: res.token});
            document.getElementById(`acc-${type.toLowerCase()}`).innerHTML = username;
            Cmn.inlineMessage("after", "login", `Account set for ${type}"}`, {type: "success", duration: 3000});
        } else {
            Cmn.inlineMessage("after", "login", res.message, {type: "error"});
        }
    });
}

function logout() {
    let type = Cmn.capitalize(this.dataset.acc);
    chrome.storage.sync.remove([`${type}Username`, `${type}UID`, `${type}AuthToken`]);
    this.previousElementSibling.innerHTML = "No account set";
}

function redirExtPage(inlineNode) {
    event.preventDefault();
    Cmn.inlineMessage("after", inlineNode, "Redirecting to extension page...", {type: "info", duration: 1000});
    setTimeout(() => chrome.tabs.create({url: `chrome://extensions/?id=${chrome.runtime.id}`}), 1000);
}