/* global chrome */
import React from "react";
import { toast } from "react-toastify";
import { Checkbox, Form, Input } from "components/form";
import * as Media from "media";

const Accounts = ({ standardUsername, setStandardUsername, incognitoUsername, setIncognitoUsername }) => {
    const handleLoginSubmit = async (formData) => {
        const username = formData.get("username");
        const forIncognito = formData.get("isForIncognito");
        const type = forIncognito ? "Incognito" : "Standard";
        formData.append("isFromExtension", true);

        chrome.storage.sync.get(["StandardUsername", "IncognitoUsername"], async (stored) => {
            if ((username === stored.StandardUsername && !forIncognito) || (username === stored.IncognitoUsername && forIncognito)) {
                return toast.error(`Account already in use for ${type}`);
            }

            const res = await (await fetch("http://localhost:3000/api/user/login", { method: "POST", body: formData })).json();
            if (!res?.success) return toast.error(res.message);

            chrome.storage.sync.set({ [`${type}Username`]: username, [`${type}AccessToken`]: res.accessToken, [`${type}RefreshToken`]: res.refreshToken });
            forIncognito ? setIncognitoUsername(username) : setStandardUsername(username);

            toast.success(`${type} account added`);
        });
    };

    return (
        <section className="sec-row">
            <div class="sec-col center">
                <h2 className="sec-header">Add Account</h2>
                <Form idPrefix="login" classes="login-form center" labelClasses="small glow" onSubmit={handleLoginSubmit} submitText="Sign In">
                    <Input id="username" type="text" name="username" label="Username" autoComplete="username" isRequired />
                    <Input id="password" type="password" name="password" label="Password" autoComplete="current-password" isRequired />
                    <Checkbox id="for-incognito" text="For Incognito?" inputName="isForIncognito" initValue={false} />
                </Form>
            </div>

            <div className="sec-col">
                <h2 className="sec-header center">Accounts</h2>
                <div className="accounts">
                    <Account type="Standard" username={standardUsername} updateUsername={setStandardUsername} />
                    <Account type="Incognito" username={incognitoUsername} updateUsername={setIncognitoUsername} />
                </div>
            </div>
        </section>
    );
};

const Account = ({ type, username = null, updateUsername }) => {
    const logout = () => {
        if (!username) return toast.warning("No account to delete")
        chrome.storage.sync.remove([`${type}Username`, `${type}UID`, `${type}AuthToken`]);
        updateUsername?.(null);
    };

    return (
        <div className="account">
            <h4 className="account-title">{type}</h4>
            <div className="row">
                <span className="username">{username
                    ? `${username.substring(0, 2)}****${username.substring(username.length - 2)}`
                    : "No account set"
                }</span>
                <span className="logout" onClick={logout}><Media.TrashcanSVG /></span>
            </div>
        </div>
    );
};

export default Accounts;