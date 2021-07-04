/* global chrome */
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../loading";
import Accounts from "./accounts";
import Settings from "./settings";
import * as Media from "media";
import "react-toastify/dist/ReactToastify.css";
import "css/index.scss";

toast.configure({
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    newestOnTop: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 0,
    toastClassName: "Toastify__toast--dark"
});

export const OptionsContext = createContext();

const Options = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [standardUsername, setStandardUsername] = useState(null);
    const [incognitoUsername, setIncognitoUsername] = useState(null);

    const [hasIncognitoAccess, setHasIncognitoAccess] = useState(false);
    const [isContextEnabled, setIsContextEnabled] = useState(true);

    useEffect(() => {
        chrome.extension.isAllowedIncognitoAccess(hasAccess => setHasIncognitoAccess(hasAccess));

        chrome.storage.sync.get(["StandardUsername", "IncognitoUsername", "EnableContext"], stored => {
            setStandardUsername(stored.StandardUsername ?? null);
            setIncognitoUsername(stored.IncognitoUsername ?? null);
            setIsContextEnabled(stored.EnableContext ?? true);

            setIsLoading(false);
        });
    }, []);

    return isLoading ? <Loading /> : (
        <div className="common options">
            <header>
                <img src={Media.LogoMedium} alt="OneMark logo" />
                <h1>OneMark Add-On</h1>
            </header>

            <main>
                <OptionsContext.Provider value={{ hasIncognitoAccess, isContextEnabled, standardUsername, setStandardUsername, incognitoUsername, setIncognitoUsername }}>
                    <Accounts />
                    <Settings />
                </OptionsContext.Provider>
            </main>
        </div>
    );
};

export default Options;