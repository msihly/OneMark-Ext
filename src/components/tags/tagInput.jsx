import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "store/actions";
import { toast } from "react-toastify";
import { Tag } from "./";
import { regexEscape } from "utils";

const TagInput = ({ id, initValue }) => {
    const dispatch = useDispatch();

    const [displayedTags, setDisplayedTags ] = useState(initValue ?? []);
    const [buttonClass, setButtonClass ] = useState("");
    const [value, setValue ] = useState("");

    const tags = useSelector(state => state.inputs.find(i => i.id === id))?.value;

    useEffect(() => {
        dispatch(actions.inputCreated(id, initValue ?? []));

        return () => dispatch(actions.inputDeleted(id));
    }, [dispatch, id, initValue]);

    const addTag = rawTag => {
        const tag = rawTag.trim().replace(" ", "-");
        if (!(tag?.length > 0)) {
            setDisplayedTags(tags);
            setButtonClass("");
            return toast.error("Tag cannot be blank");
        };

        dispatch(actions.tagAdded(id, tag));
        setDisplayedTags([...tags, tag]);
        setButtonClass("");
    };

    const removeTag = rawTag => {
        const tag = rawTag.trim().replace(" ", "-");
        dispatch(actions.tagRemoved(id, tag));
        setDisplayedTags(tags.filter(t => t !== tag));
        setButtonClass("");
    };

    const displayTags = (value) => {
        if (value) {
            const re = new RegExp(regexEscape(value), "i");
            setDisplayedTags(tags.filter(tag => re.test(tag)));
            setButtonClass(tags.includes(value) ? "del" : "add");
        } else {
            setDisplayedTags(tags);
            setButtonClass("");
        }
    };

    const handleButtonClick = () => {
        if (buttonClass.length > 0) {
            buttonClass === "add" ? addTag(value) : removeTag(value);
            setValue("");
        }
    };

    const handleSearch = event => {
        setValue(event.target.value);
        displayTags(event.target.value);
    };

    return (
        <div className="column">
            <div className="row">
                <input className="placeholder tag-search" placeholder="Tags" onChange={handleSearch} value={value} type="text" />
                <span className={`tag-search-btn ${buttonClass}`} onClick={handleButtonClick}></span>
            </div>
            <div className="tags">{displayedTags?.map((tag, idx) => <Tag key={idx} value={tag} handleRemoval={removeTag} />)}</div>
        </div>
    );
}

export default TagInput;