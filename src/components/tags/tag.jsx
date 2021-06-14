import React from "react";

const Tag = ({ handleRemoval, value }) => (
    <div className="tag">
        <div className="tag-text">{value}</div>
        <span onClick={() => handleRemoval(value)} className="tag-x">{"\u00D7"}</span>
    </div>
);

export default Tag;