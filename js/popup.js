import * as Cmn from "./modules/common.js";

const PopG = {
    bookmarks: [],
    eventListeners: [{
            "id": "bk-f",
            "eventType": "submit",
            "function": () => Cmn.createBookmark({"tags": PopG.tags, "imageBlob": PopG.imageBlob})
        }, {
            "id": "preview",
            "eventType": "click",
            "function": openBookmark
        }, {
            "id": "tag-btn",
            "eventType": "click",
            "function": updateTag
        }, {
            "id": "tag-search",
            "eventType": "input",
            "function": searchTags,
            "debounce": 50
        }, {
            "dataListener": "errorCheck",
            "eventType": "input",
            "function": Cmn.errorCheck
        }, {
            "dataListener": "inputPreview",
            "eventType": "input",
            "function": inputPreview
        }],
    imageBlob: null,
    inputTitle: "",
    inputUrl: "",
    tags: [],
    tagsCtn: "",
    tagSearch: ""
}

document.addEventListener("DOMContentLoaded", function() {
    Cmn.addListeners(PopG.eventListeners);

    PopG.inputUrl = document.getElementById("bk-f-url");
    PopG.inputTitle = document.getElementById("bk-f-title");
    PopG.tagSearch = document.getElementById("tag-search");
    PopG.tagsCtn = document.getElementById("tags");

    fillForm(PopG.inputUrl, PopG.inputTitle, true);
});

/******************************* FORM *******************************/
function fillForm(inputUrl, inputTitle, withImage) {
    let [previewURL, previewTitle, previewImage] = document.querySelectorAll("#preview, #preview-title, #preview-image");

    if (withImage) {
        chrome.tabs.captureVisibleTab({quality: 80}, async function(dataUrl) {
            PopG.imageBlob = await (await fetch(dataUrl)).blob();
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
    let preview = document.getElementById(this.dataset.preview);
    if (this.dataset.attr == "innerHTML") { preview.innerHTML = Cmn.isValid(this).Valid ? this.value : this.dataset.invalidValue; }
    else { preview.setAttribute(this.dataset.attr, Cmn.isValid(this).Valid ? this.value : this.dataset.invalidValue); }
}

/******************************* TAGS *******************************/
function createTag(tagText, tagsCtn) {
    let tag = `<div class="tag" id="tag-${tagText}">
                    <div class="tag-text">${tagText}</div>
                    <span id="tagx-${tagText}" class="tag-x" data-form="${tagsCtn.id.substring(0, tagsCtn.id.indexOf("-"))}">×</span>
                </div>`;
    tagsCtn.insertAdjacentHTML("afterbegin", tag);

    let tagX = document.getElementById(`tagx-${tagText}`);
    tagX.addEventListener("click", function() {
        let tagBtn = document.getElementById("tag-btn");
        tagBtn.classList.remove("del");
        tagBtn.classList.add("add");
        removeTag(tagText);
    });
}

function displayTags(arr, hide = true) {
    arr.forEach(e => {
        let tag = document.getElementById(`tag-${e}`).classList;
        hide == true ? tag.add("hidden") : tag.remove("hidden");
    });
}

function removeTag(tagText) {
    let tag = document.getElementById(`tag-${tagText}`);
    tag.remove();
    PopG.tags = PopG.tags.filter(e => e !== tagText);
}

function searchTags() {
    let tagBtn = document.getElementById("tag-btn");
    if (this.value.length > 0) {
        let reTag = new RegExp(Cmn.regexEscape(this.value), "i"),
            tagsActive = PopG.tags.filter(e => { return reTag.test(e); });
        displayTags(PopG.tags, false);
        displayTags(tagsActive);
        if (PopG.tags.includes(this.value)) {
            tagBtn.classList.remove("add");
            tagBtn.classList.add("del");
        } else {
            tagBtn.classList.remove("del");
            tagBtn.classList.add("add");
        }
    } else {
        displayTags(PopG.tags);
        tagBtn.classList.remove("del", "add");
    }
}


function updateTag() {
    let input = PopG.tagSearch,
        tagText = input.value;
    if (this.classList.contains("add")) {
        PopG.tags.push(tagText);
        createTag(tagText, PopG.tagsCtn);
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
    let href = this.dataset.href;
    if (href && href != "#") { window.open(href); }
}