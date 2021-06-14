import React, { useContext, useState } from "react";
import { FormContext } from "components/form";
import * as Media from "media";

const Checkbox = ({ classes, handleClick, id, initValue = false, inputName = null, option, text }) => {
    const context = useContext(FormContext);
    id = context?.idPrefix ? `${context.idPrefix}-${id}` : id;

    const [isChecked, setIsChecked] = useState(initValue);

    const getClasses = () => {
        let className = "checkbox-ctn";
        if (isChecked) className += " checked";
        if (classes) className += " " + classes;
        return className;
    };

    const toggleCheckbox = () => {
        setIsChecked(!isChecked);
        handleClick?.(option ?? !isChecked);
    };

    return (
        <label className={getClasses()} onClick={event => event.stopPropagation()}>
            <input type="checkbox" name={inputName} onClick={toggleCheckbox} checked={isChecked} readOnly />
            <span className="checkbox">{isChecked ? <Media.CheckmarkSVG /> : null}</span>
            {text && <label className="lb-title checkbox-title">{text}</label>}
        </label>
    );
};

export default Checkbox;