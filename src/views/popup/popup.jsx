/* global chrome */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "store/actions";
import { Form, ImageInput, Input } from "components/form";
import { TagInput } from "components/tags";
import { dataUrlToBlob } from "utils";
import { getTabInfo, screenToDataUrl } from "utils/chrome";
import * as Media from "media";
import "css/index.scss";

const Popup = () => {
    const dispatch = useDispatch();

    const [keyPrefix, setKeyPrefix] = useState(null);

    useEffect(() => {
        const captureTab = async () => {
            const tab = await getTabInfo();
            dispatch(actions.inputUpdated("title", tab.title));
            dispatch(actions.inputUpdated("pageUrl", tab.url));
            setKeyPrefix(tab.incognito ? "Incognito" : "Standard");

            const dataUrl = await screenToDataUrl();
            dispatch(actions.imageInputUpdated("image", dataUrl, false));
        };

        captureTab();
    }, []);

    const imageUrl = useSelector(state => state.inputs.find(i => i.id === "image"))?.value;
    const pageUrl = useSelector(state => state.inputs.find(i => i.id === "pageUrl"))?.value;
    const title = useSelector(state => state.inputs.find(i => i.id === "title"))?.value;
    const tags = useSelector(state => state.inputs.find(i => i.id === "tags"))?.value;

    const handleSubmit = async (formData) => {
        chrome.storage.sync.get([`${keyPrefix}AccessToken`, `${keyPrefix}RefreshToken`], async (stored) => {
            const notifOptions = { iconUrl: Media.LogoLarge, type: "basic" };
            if (!stored) chrome.notifications.create({ ...notifOptions, title: "Error: No account set" });

            formData.append("tags", JSON.stringify(tags));
            formData.append("file", await dataUrlToBlob(imageUrl), `${title}.jpg`);
            const res = await (await fetch("http://localhost:3000/api/bookmark", {
                method: "POST",
                body: formData,
                headers: { "Authorization": `Bearer ${stored[`${keyPrefix}AccessToken`]} ${stored[`${keyPrefix}RefreshToken`]}` }
            })).json();

            if (!res.success) return chrome.notifications.create({ ...notifOptions, title: "Error creating bookmark!", message: res?.message });
            chrome.notifications.create({ ...notifOptions, title: "Bookmark created!", message: title });
        });
    };

    return (
        <div className="common popup">
            <figure className="preview-output" onClick={() => pageUrl && chrome.tabs.create({ url: pageUrl })}>
                <img className={`image${imageUrl ? "" : " no-image"}`} src={imageUrl ?? Media.NoImage} alt="" />
                <figcaption className="title">{title || "No Title"}</figcaption>
            </figure>

            <Form onSubmit={handleSubmit} submitText="Submit" submitClasses="submit" labelClasses="small glow">
                <ImageInput id="image" inputName="imageUrl" />

                <div className="row mg-2">
                    <div className="column full-width">
                        <Input id="title" name="title" label="Title" hasErrorCheck isRequired />

                        <Input id="pageUrl" name="pageUrl" label="Page URL" hasErrorCheck isRequired />
                    </div>

                    <div className="column">
                        <label className="small glow">Tags</label>
                        <TagInput id="tags" name="tags" />
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default Popup;