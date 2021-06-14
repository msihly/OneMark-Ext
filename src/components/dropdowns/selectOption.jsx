import React from "react";
import { useDispatch } from "react-redux";
import * as actions from "store/actions";

const DropSelectOption = ({ classes, displayedValue, formValue, handleSelect, selectorId, parent }) => {
    const dispatch = useDispatch();

    const getClasses = () => {
        let className = "drop-btn";
        if (classes) className += " " + classes;
        return className;
    };

    const handleClick = (event) => {
        event.stopPropagation();

        handleSelect(displayedValue, formValue);

        dispatch(actions.menuClosed(selectorId, parent));
    };

    return (
        <div className={getClasses()} title={displayedValue} onClick={handleClick} >
            {displayedValue}
        </div>
    );
};

export const makeSelectOption = (form, displayed) => {
    if (form === undefined && displayed === undefined) return undefined;
    if (form === undefined) return { displayed, form: displayed };
    if (displayed === undefined) return { displayed: form, form };
    return { displayed, form };
};

export default DropSelectOption;