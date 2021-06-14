import React, { cloneElement } from "react";
import { useDispatch } from "react-redux";
import * as actions from "store/actions";
import { Modal } from "./";
import { renderArrayString } from "utils";

const Alert = ({ id, modalClasses = null, iconClasses = "", icon, heading, subheading, children, buttons, hasCancelButton = true }) => {
    const dispatch = useDispatch();

    const closeAlert = () => dispatch(actions.modalClosed(id));

    const getIconClasses = () => `alert-icon ${iconClasses}`.trim();

    return (
        <Modal id={id} classes={modalClasses}>
            <div className="alert">
                {icon && (typeof icon === "string" ?
                    <img src={icon} className={getIconClasses()} alt="" />
                    : cloneElement(icon, { className: getIconClasses() }))}

                <div className="alert-heading">{renderArrayString(heading)}</div>

                {subheading && <div className="alert-subheading">{renderArrayString(subheading)}</div>}

                {children}

                <div className="row j-center">
                    {hasCancelButton && <AlertButton key="0" text="Cancel" classes="grey" handleClose={closeAlert} />}
                    {buttons && buttons.map((b, i) => cloneElement(b, { key: i + 1, handleClose: closeAlert }))}
                </div>
            </div>
        </Modal>
    );
};

export const AlertButton = ({ text, classes = "", onClick, handleClose }) => {
    const handleClick = () => {
        if (onClick) return onClick(handleClose);
        handleClose();
    };

    return (
        <div className={`alert-button ${classes}`.trim()} onClick={handleClick}>
            {text}
        </div>
    );
};

export default Alert;