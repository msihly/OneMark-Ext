import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "store/actions";
import { FormContext } from "components/form";
import { Portal } from "components/popovers";
import { ConditionalWrap } from "components/wrappers";
import { appendClasses, defaultReqs, regexEscape, validateForm } from "utils";
import { useElementResize } from "utils/hooks";

const Input = ({
    autoComplete = "off",
    classes,
    formula,
    groupClasses,
    hasErrorCheck,
    hasInitFocus,
    id,
    isDisabled = null,
    initValue,
    isRequired = null,
    isRow,
    isSelectOnly,
    isTransparent,
    label,
    labelClasses = null,
    name = null,
    onBlur,
    onChange,
    placeholder = null,
    style = null,
    suggAttr,
    suggSrc,
    title = null,
    type = "search" // workaround for forced autocomplete behaviour
}) => {
    const context = useContext(FormContext);
    id = context?.idPrefix ? `${context.idPrefix}-${id}` : id;

    const dispatch = useDispatch();

    // BEGIN - Input
    const inputRef = useRef(null);

    useEffect(() => {
        dispatch(actions.inputCreated(id, initValue ?? ""));
        hasInitFocus && inputRef.current.focus();

        return () => dispatch(actions.inputDeleted(id));
    }, [dispatch, id, hasInitFocus, initValue]);

    const inputValue = useSelector(state => state.inputs.find(input => input.id === id))?.value ?? "";

    const handleInput = event => {
        if (isSelectOnly) return event.preventDefault();

        const { target, target: { value } } = event;
        const cursorPos = target.selectionStart;

        if (type === "search" || type === "text") {
            window.requestAnimationFrame(() => {
                target.selectionStart = cursorPos;
                target.selectionEnd = cursorPos;
            });
        }

        dispatch(actions.inputUpdated(id, value));
        if (hasErrorCheck) checkError(value);

        onChange?.(value);

        displaySuggestions(value);
    };
    // END - Input

    // BEGIN - Error checking
    const [errorDesc, setErrorDesc] = useState("");
    const [hasError, setHasError] = useState(false);

    const checkError = value => {
        const reqs = { ...defaultReqs, [name]: { ...defaultReqs[name], isRequired } };
        const { success, message } = validateForm({ reqs, key: name, value });

        setHasError(!success);
        setErrorDesc(message);
    };
    // END - Error checking

    // BEGIN - Suggestions
    const [suggestions, setSuggestions] = useState([]);

    const isSuggestionsOpen = useSelector(state => state.menus.find(menu => menu.id === id))?.isOpen ?? false;

    const { top, left, width, height } = useElementResize(inputRef, isSuggestionsOpen);

    const displayMenu = src => dispatch(src.length > 0 ? actions.menuOpened(id) : actions.menuClosed(id));

    const displaySuggestions = value => {
        if (!suggSrc) return;

        const re = new RegExp(regexEscape(value), "i");
        const src = (formula || suggAttr) ? [...new Set(suggSrc.map(s => formula ? formula(...s) : s[suggAttr]))] : suggSrc;
        const filtered = src.filter(s => re.test(s));

        setSuggestions(filtered);
        displayMenu(filtered);
    };

    const handleFocusLost = event => {
        onBlur && onBlur(event);
        if (isSuggestionsOpen && event.relatedTarget === null) dispatch(actions.menuClosed(id));
    };

    const selectSuggestion = (event, suggestion) => {
        event.stopPropagation();

        dispatch(actions.inputUpdated(id, suggestion));
        dispatch(actions.menuClosed(id));

        inputRef.current?.focus();
    };
    // END - Suggestions

    // BEGIN - CSS Classes
    const getErrorClasses = () => `error-label${hasError ? "" : " invisible"}`;

    const getGroupClasses = () => {
        let className = "form-group";
        if (groupClasses) className += " " + groupClasses;
        if (!hasErrorCheck) className += " no-error";
        if (isRow) className += " full-width";
        if (isTransparent) className += " rev";
        if (suggSrc && suggAttr) className += " relative";
        return className;
    };

    const getLabelClasses = () => appendClasses(labelClasses, context?.labelClasses);
    // END - CSS Classes

    const inputProps = {
        autoComplete,
        className: `${classes ?? ""}${isTransparent ? " t-input" : ""}`,
        disabled: isDisabled,
        name,
        onBlur: handleFocusLost,
        onChange: handleInput,
        onClick: () => displaySuggestions(inputValue),
        placeholder: placeholder === true ? label : placeholder,
        ref: inputRef,
        required: isRequired,
        style,
        type,
        value: inputValue,
    };

    return (
        <ConditionalWrap condition={isRow} wrap={children => <div className="row">{children}</div>}>
            {isRow && <label className="lb-title horizontal" title={title}>{`${label}${isRequired ? " *" : ""}`}</label>}

            <div className={getGroupClasses()}>
                {!isRow && (isTransparent
                    ? hasErrorCheck && <label className={getErrorClasses()} title={errorDesc}>{errorDesc || "Valid"}</label>
                    : label && <label className={getLabelClasses()} title={title}>{`${label}${isRequired ? " *" : ""}`}</label>)}

                <input {...inputProps} />

                {isSuggestionsOpen && (
                    <Portal>
                        <div className="drop-menu-content" style={{ position: "absolute", top: top + height, left, width }}>
                            {suggestions.map((suggestion, key) =>
                                <div key={key} className="drop-btn" title={suggestion} onClick={event => selectSuggestion(event, suggestion)} tabIndex="0">
                                    {suggestion}
                                </div>
                            )}
                        </div>
                    </Portal>
                )}

                {hasErrorCheck && (isTransparent
                    ? label && <label className={`${getLabelClasses()}${isTransparent ? " lb-title" : null}`} title={title}>{label}</label>
                    : <label className={getErrorClasses()} title={errorDesc}>{errorDesc || "Valid"}</label>)}
            </div>
        </ConditionalWrap>
    );
};

// Refactor / Abstract the Title and Error labels to their own components

export default Input;