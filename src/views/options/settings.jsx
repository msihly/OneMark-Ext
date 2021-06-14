/* global chrome */
import React from "react";
import { Checkbox } from "components/form";
import { toggleSetting } from "utils/chrome";

const Settings = ({ hasIncognitoAccess, isContextEnabled }) => {
    const openExtPage = () => chrome.tabs.create({ url: `chrome://extensions/?id=${chrome.runtime.id}` });

    return (
        <section>
            <h2 className="sec-header">Settings</h2>
            <div className="settings">
                <Checkbox id="setting-incognito" initValue={hasIncognitoAccess} text={<>Extension Enabled in Incognito
                    <span onClick={openExtPage} className="text-btn i"> (Option Controlled via Extensions Page)</span>
                </>} />

                <Checkbox id="setting-context" text="Enable Context-Menu" initValue={isContextEnabled} handleClick={toggleSetting} />
            </div>
        </section>
    );
};

export default Settings;