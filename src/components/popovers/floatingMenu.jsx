import React from "react";

const FloatingMenu = ({ children, position = "bottom right", isHorizontal, hasBackground, hasPadding }) => (
    <div className={`floating-menu ${position} ${isHorizontal ? "horizontal" : ""} ${hasBackground ? "has-bg" : ""} ${hasPadding ? "has-padding" : ""}`.trim()}>
        {children}
    </div>
);

export const CircleButton = ({ children, classes, isActive, onClick, title }) => {
    const getClasses = () => {
        let className = "circle-button";
        if (isActive === false) className += " inactive";
        if (classes) className += " " + classes;
        return className;
    };

    return (
        <div title={title} className={getClasses()} onClick={onClick}>
            {children}
        </div>
    );
};

export default FloatingMenu;