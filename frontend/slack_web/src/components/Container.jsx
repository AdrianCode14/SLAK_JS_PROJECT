import React from "react";

import { twMerge } from "tailwind-merge";

const Container = ({ children, className }) => {
    const defaultClassName = `bg-bg_gray rounded-2xl px-5 py-5
    shadow-[inset_-5px_-5px_4px_0px_rgba(255,255,255,.5),inset_5px_5px_4px_0px_rgba(70,70,70,.12)]`;

    return (
        <div className={twMerge(defaultClassName, className)}>{children}</div>
    );
};

export default Container;
