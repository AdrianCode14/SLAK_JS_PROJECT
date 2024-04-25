import React from "react";
import { twMerge } from "tailwind-merge";

const ScrollView = ({ children, className }) => {
    return (
        <section
            className={twMerge(
                "h-full w-full overflow-y-scroll scrollbar-thumb-gray0 scrollbar-track-bg_gray scrollbar-thin scrollbar-thumb-rounded-5xl",
                className
            )}>
            {children}
        </section>
    );
};

export default ScrollView;
