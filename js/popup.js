import * as Cmn from "./modules/common.js";

const PopG = {
    bookmarks: [],
    eventListeners: [{
            "id": "bk-f",
            "eventType": "submit",
            "function": () => Cmn.createBookmark({"tags": PopG.tag.tags, "imageBlob": PopG.form.imageBlob})
        }, {
            "id": "bk-file-input",
            "eventType": "change",
            "function": uploadFile
        }, {
            "id": "bk-file-input-group",
            "eventType": "click",
            "function": updateFileInput
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
    form: {
        imageBlob: null,
        title: "",
        url: ""
    },
    tag: {
        container: null,
        search: null
    },
    tags: []
}

document.addEventListener("DOMContentLoaded", function() {
    Cmn.addListeners(PopG.eventListeners);

    PopG.form.url = document.getElementById("bk-f-url");
    PopG.form.title = document.getElementById("bk-f-title");
    PopG.tag.search = document.getElementById("tag-search");
    PopG.tag.container = document.getElementById("tags");

    fillForm(PopG.form.url, PopG.form.title, true);
});

/******************************* FORM *******************************/
function fillForm(inputUrl, inputTitle, withImage) {
    let [previewURL, previewImage, previewTitle, fileInputGroup, fileLabel] = document.querySelectorAll("#preview, #preview-image, #preview-title, #bk-file-input-group, #file-label");

    if (withImage) {
        chrome.tabs.captureVisibleTab({quality: 80}, async function(dataUrl) {
            PopG.form.imageBlob = await (await fetch(dataUrl)).blob();
            previewImage.src = dataUrl;
            fileInputGroup.classList.add("del");
            fileLabel.title = dataUrl;
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

function updateFileInput() {
    if (this.classList.contains("del")) {
        event.preventDefault();
        let [preview, fileLabel, fileInput, inputRemove] = document.querySelectorAll("#preview-image, #file-label, #bk-file-input, #bk-file-remove");
        preview.src = "images/No-Image.jpg";
        fileLabel.title = fileLabel.innerHTML = "";
        fileLabel.classList.add("hidden");
        this.classList.remove("del");
        fileInput.value = "";
        inputRemove.value = "true";
    }
}

function uploadFile() {
    let fileName = this.value.split("\\").pop(),
        [preview, inputGroup, fileLabel, inputRemove] = document.querySelectorAll("#preview-image, #bk-file-input-group, #file-label, #bk-file-remove");
    inputRemove.value = "false";
    fileLabel.classList.toggle("hidden", !fileName);
    fileLabel.title = fileLabel.innerHTML = fileName;

    if (this.files.length > 0) {
        let reader = new FileReader();
        reader.onload = e => preview.src = e.target.result;
        reader.readAsDataURL(this.files[0]);
        inputGroup.classList.add("del");
    } else {
        preview.src = "images/No-Image.jpg";
        inputGroup.classList.remove("del");
    }
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

function createTags(arr, tagsCtn) {
    arr.forEach(tagText => { createTag(tagText, tagsCtn); });
}

function displayTags(arr, show = true) {
    arr.forEach(e => document.getElementById(`tag-${e}`).classList.toggle("hidden", !show));
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
            tagsActive = PopG.tags.filter(e => reTag.test(e)),
            isIncluded = PopG.tags.includes(this.value);
        displayTags(PopG.tags, false);
        displayTags(tagsActive);
        tagBtn.classList.toggle("add", !isIncluded);
        tagBtn.classList.toggle("del", isIncluded);
    } else {
        displayTags(PopG.tags);
        tagBtn.classList.remove("del", "add");
    }
}

function updateTag() {
    let input = PopG.tag.search,
        tagText = input.value;
    if (this.classList.contains("add")) {
        PopG.tags.push(tagText);
        createTag(tagText, PopG.tag.container);
        input.value = "";
        this.classList.remove("add");
    } else if (this.classList.contains("del")) {
        removeTag(tagText);
        input.value = "";
        this.classList.remove("del");
    }
    displayTags(PopG.tags);
}

/******************************* BOOKMARKS *******************************/
function openBookmark() {
    let href = this.dataset.href;
    if (href && href != "#") { window.open(href); }
}