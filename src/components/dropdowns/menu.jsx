import React, { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ConditionalWrap } from "components/wrappers";
import * as actions from "store/actions";

const DropContext = createContext();

export const DropMenu = ({ children, contentClasses, id, isWrapped, retainOnClick, toggleBody, toggleClasses }) => {
    const dispatch = useDispatch();

    const isOpen = useSelector(state => state.menus.find(menu => menu.id === id))?.isOpen ?? false;

    const toggleMenu = event => {
		event.stopPropagation();
		dispatch(isOpen ? actions.menuClosed(id) : actions.menuOpened(id));
    };

    return (
        <ConditionalWrap condition={isWrapped} wrap={c => <div className="menu">{c}</div>}>
            <DropContext.Provider value={{ id, retainOnClick }}>
                <div className={`${contentClasses ?? "menu-content"}${isOpen ? "" : " hidden"}`}>
                    {children}
                </div>
                <div onClick={toggleMenu} className={toggleClasses ?? "menu-toggle"}>
                    {toggleBody ?? null}
                </div>
            </DropContext.Provider>
        </ConditionalWrap>
    );
};

export const DropButton = ({ icon, label, onClick }) => {
    const dispatch = useDispatch();

    const { id, retainOnClick } = useContext(DropContext);

    const handleClick = (event) => {
        event.stopPropagation();
        if (!retainOnClick) setTimeout(() => dispatch(actions.menuClosed(id)), 0);
        onClick?.();
    };

    return (
        <div className="menu-btn" onClick={handleClick}>
            {icon === undefined ? label : (<>{icon}<span>{label}</span></>)}
        </div>
    );
};