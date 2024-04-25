import React from "react";
import { twMerge } from "tailwind-merge";

const ZoneList = ({ zone, className }) => {
    return (
        <section
            className={twMerge(
                "bg-highlight_green rounded-5xl ps-8 pt-3 pb-4 shadow-xl filter drop-shadow(0px 4px 30px 5px rgba(49, 169, 93, 0.20)) w-full h-14 space-x-8",
                className
            )}>
            <span className="text-green2 text-2xl font-semibold self-center mr-5">
                {zone.area_index}
            </span>
            <span className="text-gray1 text-2xl font-normal">{zone.name}</span>
        </section>
    );
};

export default ZoneList;
