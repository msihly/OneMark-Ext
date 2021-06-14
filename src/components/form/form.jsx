import React, { createContext } from "react";

export const FormContext = createContext();

const Form = ({ children, classes = null, idPrefix, labelClasses, onSubmit, submitText, submitClasses = "submit" }) => {
    const handleSubmit = async (event) => {
        event.preventDefault();
        return await onSubmit(new FormData(event.target));
    };

    return (
        <form className={classes} onSubmit={handleSubmit} encType="multipart/form-data">
            <FormContext.Provider value={{ idPrefix, labelClasses }}>
                {children}
            </FormContext.Provider>
            {submitText && <button type="submit" className={submitClasses}>{submitText}</button>}
        </form>
    );
};

export default Form;