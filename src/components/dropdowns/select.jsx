import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "store/actions";
import { Portal } from "components/popovers";
import { ConditionalWrap } from "components/wrappers";
import { FormContext } from "components/form";
import { DropSelectOption } from "./";
import { appendClasses } from "utils";
import { useElementResize } from "utils/hooks";
import * as Media from "media";

const DropSelect = ({
    formAttr,
    formula = option => option?.displayed,
    groupClasses,
    handleSelect,
    hasFormGroup = true,
    hasInitFocus,
    hasNone = true,
    id,
    initValue,
    isRequired,
    label,
    labelClasses = null,
    name,
    onClose,
    parent,
    src = [],
    srcAttr = "form",
    style = null
}) => {
    const context = useContext(FormContext);

    id = context?.idPrefix ? `${context.idPrefix}-${id}` : id;
    initValue = initValue ?? {
        displayed: !hasNone ? (src[0]?.displayed ?? "Invalid Source") : "None",
        form: !hasNone ? (src[0]?.form ?? "Invalid Source") : ""
    };

    const dispatch = useDispatch();

    // BEGIN - Input
    const dropRef = useRef(null);

    useEffect(() => {
        dispatch(actions.inputCreated(id, initValue?.form ?? ""));
        if (hasInitFocus) dispatch(actions.menuOpened(id, parent));

        return () => dispatch(actions.inputDeleted(id));
    }, [dispatch, hasInitFocus, id, initValue?.form, parent]);

    const isOptionsOpen = useSelector(state => state.menus.find(menu => menu.id === id))?.isOpen ?? false;
    const [isMenuOpen, setIsMenuOpen] = useState(isOptionsOpen); // used to keep track of old state vs. new state

    useEffect(() => {
        if (isOptionsOpen === false && isMenuOpen === true) onClose?.();
        setIsMenuOpen(isOptionsOpen);
    }, [isOptionsOpen, onClose]); //eslint-disable-line

    const formValue = useSelector(state => state.inputs.find(input => input.id === id))?.value ?? "";

    const [displayedValue, setDisplayedValue] = useState(initValue?.displayed ?? "None");

    const getDisplayedValue = (option) => option ? (formula?.(option) ?? option?.displayed) : "None";

    const getFormValue = (option) => option ? (option[formAttr ?? name ?? srcAttr] ?? option?.form) : "";

    const getOptions = () => (hasNone ? [null] : []).concat(...src).map((option, index) =>
        <DropSelectOption key={index} displayedValue={getDisplayedValue(option)}
            formValue={getFormValue(option)} handleSelect={selectOption} selectorId={id} parent={parent} />
    );

    const selectOption = (disVal, formVal) => {
        setDisplayedValue(disVal);
        dispatch(actions.inputUpdated(id, formVal));

        handleSelect && handleSelect({ name, value: formVal });
    };

    const toggleMenu = event => {
        event.stopPropagation();
		dispatch(isOptionsOpen ? actions.menuClosed(id, parent) : actions.menuOpened(id, parent));
    };

    const { top, left, width, height } = useElementResize(dropRef, isOptionsOpen);
    // END - Input

    const getLabelClasses = () => appendClasses(labelClasses, context.labelClasses);

    return (
        <ConditionalWrap condition={hasFormGroup} wrap={c => <div className={`form-group no-error ${groupClasses ?? ""}`.trim()}>{c}</div>}>
            {label && <label className={getLabelClasses()} title={label}>{`${label}${isRequired ? " *" : ""}`}</label>}

            <span ref={dropRef} onClick={toggleMenu} className="dropdown" style={style}>
                <span>{displayedValue}</span>
                <Media.ChevronSVG />
            </span>

            {name && <input name={name} value={formValue} type="hidden" className="hidden" />}

            {isOptionsOpen && (
                <Portal>
                    <div className="drop-menu-content" style={{ position: "absolute", top: top + height, left, width }}>
                        {getOptions()}
                    </div>
                </Portal>
            )}
        </ConditionalWrap>
    );
};

export default DropSelect;