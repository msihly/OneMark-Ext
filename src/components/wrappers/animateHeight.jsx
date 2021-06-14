import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const AnimateHeight = ({ children, duration = 300 }) => {
    const ref = useRef(null);

    const [height, setHeight] = useState(null);
    const [isInitialRender, setIsInitialRender] = useState(false);

    const getStyle = () => {
        if (height === null) return null;
        return { maxHeight: isInitialRender ? 0 : height, transition: `max-height ${duration}ms ease-in`, overflow: "hidden" };
    };

    useLayoutEffect(() => {
        if (ref.current) {
            setHeight(ref.current.getBoundingClientRect().height);
            setIsInitialRender(true);
        }
    }, []);

    useEffect(() => {
        setTimeout(() => setIsInitialRender(false), 0);
        setTimeout(() => setHeight(null), duration); // removes height limit after animation to allow for dynamic content updates
    }, [duration]);

    return (
        <div ref={ref} style={getStyle()}>
            {children}
        </div>
    );
};

export default AnimateHeight;