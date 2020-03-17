import * as Common from "./modules/common.js";

const eventListeners = [
    {
        "id": "tag-search",
        "eventType": "input",
        "function": searchTags,
        "debounce": 50
    }, {
        "id": "tag-btn",
        "eventType": "click",
        "function": updateTag
    }, {
        "id": "preview",
        "eventType": "click",
        "function": openBookmark
    }, {
        "id": "bk-f",
        "eventType": "submit",
        "function": function() { Common.createBookmark({"tags": PopGlobals.tags, "imageBlob": PopGlobals.imageBlob}); }
    }, {
        "dataListener": "inputPreview",
        "eventType": "input",
        "function": inputPreview
    }, {
        "dataListener": "errorCheck",
        "eventType": "input",
        "function": Common.errorCheck
    }
];

var PopGlobals = {
    imageBlob: null,
    inputUrl: "",
    inputTitle: "",
    tagSearch: "",
    tagsCtn: "",
    tags: [],
    bookmarks: []
}

document.addEventListener("DOMContentLoaded", function() {
    Common.addListeners(eventListeners);

    PopGlobals.inputUrl = document.getElementById("bk-f-url");
    PopGlobals.inputTitle = document.getElementById("bk-f-title");
    PopGlobals.tagSearch = document.getElementById("tag-search");
    PopGlobals.tagsCtn = document.getElementById("tags");

    fillForm(PopGlobals.inputUrl, PopGlobals.inputTitle, true);
});

/******************************* GENERAL *******************************/
function regexEscape(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

/******************************* FORM *******************************/
function fillForm(inputUrl, inputTitle, withImage) {
    var [previewURL, previewTitle, previewImage] = document.querySelectorAll("#preview, #preview-title, #preview-image");

    if (withImage) {
        chrome.tabs.captureVisibleTab({quality: 80}, async function(dataUrl) {
            PopGlobals.imageBlob = await (await fetch(dataUrl)).blob();
            previewImage.src = dataUrl;
        });
    } else { previewImage.src = "images/No-Image.jpg"; }

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        inputUrl.value = tabs[0].url;
        inputTitle.value = tabs[0].title;
        previewURL.dataset.href = tabs[0].url;
        previewTitle.innerHTML = tabs[0].title;
    });
}

function inputPreview() {
    var preview = document.getElementById(this.dataset.preview);
    if (this.dataset.attr == "innerHTML") { preview.innerHTML = Common.isValid(this).Valid ? this.value : this.dataset.invalidValue; }
    else { preview.setAttribute(this.dataset.attr, Common.isValid(this).Valid ? this.value : this.dataset.invalidValue); }
}

/******************************* TAGS *******************************/
function createTag(tagText, tagsCtn) {
    var tag = `<div class="tag" id="tag-${tagText}">
                    <div class="tag-text">${tagText}</div>
                    <span id="tagx-${tagText}" class="tag-x" data-form="${tagsCtn.id.substring(0, tagsCtn.id.indexOf("-"))}">×</span>
                </div>`;
    tagsCtn.insertAdjacentHTML("afterbegin", tag);

    var tagX = document.getElementById(`tagx-${tagText}`);
    tagX.addEventListener("click", function() {
        let tagBtn = document.getElementById("tag-btn");
        tagBtn.classList.remove("del");
        tagBtn.classList.add("add");
        removeTag(tagText);
    });
}

function removeTag(tagText) {
    var tag = document.getElementById(`tag-${tagText}`);
    tag.remove();
    PopGlobals.tags = PopGlobals.tags.filter(e => e !== tagText);
}

function hideTags(arr) {
    arr.forEach(function(e) { document.getElementById(`tag-${e}`).classList.add("hidden"); });
}

function showTags(arr) {
    arr.forEach(function(e) { document.getElementById(`tag-${e}`).classList.remove("hidden"); });
}

function searchTags() {
    var tagBtn = document.getElementById("tag-btn");
    if (this.value.length > 0) {
        var reTag = new RegExp(regexEscape(this.value), "i"),
            tagsActive = PopGlobals.tags.filter(e => { return reTag.test(e); });
        hideTags(PopGlobals.tags);
        showTags(tagsActive);
        if (PopGlobals.tags.includes(this.value)) {
            tagBtn.classList.remove("add");
            tagBtn.classList.add("del");
        } else {
            tagBtn.classList.remove("del");
            tagBtn.classList.add("add");
        }
    } else {
        showTags(PopGlobals.tags);
        tagBtn.classList.remove("del", "add");
    }
}

function updateTag() {
    var input = PopGlobals.tagSearch,
        tagText = input.value;
    if (this.classList.contains("add")) {
        PopGlobals.tags.push(tagText);
        createTag(tagText, PopGlobals.tagsCtn);
        input.value = "";
        this.classList.remove("add");
    } else if (this.classList.contains("del")) {
        removeTag(tagText);
        input.value = "";
        this.classList.remove("del");
    }
}

/******************************* BOOKMARKS *******************************/
function openBookmark() {
    var href = this.dataset.href;
    if (href && href != "#") { window.open(href); }
}