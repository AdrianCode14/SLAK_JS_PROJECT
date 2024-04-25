import React from "react";

import { twMerge } from "tailwind-merge";

const Card = ({ children, className, onClickHandler }) => {
    return (
        <section
            onClick={onClickHandler}
            className={twMerge(
                " bg-white rounded-5xl pe-8 ps-8 pb-2 pt-6 shadow-[0px_0px_30px_5px_rgba(49,169,93,.2)] ",
                className
            )}>
            {children}
        </section>
    );
};

export default Card;
