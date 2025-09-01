import { TimesIcon } from "@/icons/icons";
import React from "react";

const Tag = ({ tag, onRemove }) => {
  return (
    <div className='tag-container'>
      <p>{tag}</p>
      <button
        onClick={onRemove}
        className='tag-icon'
        aria-label={`Remove ${tag}`}
      >
        <TimesIcon />
      </button>
    </div>
  );
};

export default Tag;
