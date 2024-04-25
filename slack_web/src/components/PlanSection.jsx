import React from "react";
import { twMerge } from "tailwind-merge";

const PlanSection = ({
    plan: { xCount, yCount, content },
    x,
    y,
    elem,
    onClick,
    editable,
}) => {
    if (elem === null) {
        return (
            <div
                onClick={() => {
                    if (editable) onClick(x, y);
                }}
                className={twMerge(
                    "transition-colors duration-200 w-[50px] h-[50px] flex items-center justify-center border-2 border-bg_gray bg-highlight_green rounded-md hover:bg-green2",
                    editable ? "" : "hover:bg-highlight_green"
                )}></div>
        );
    }

    let className =
        "transition-colors duration-200 w-[50px] h-[50px] bg-white flex items-center justify-center border-green1 border-dotted  rounded-md hover:bg-highlight_green";

    className = twMerge(className, editable ? "" : "hover:bg-white");
    let overrides = "";
    let hasUp = false;
    let hasDown = false;
    let hasLeft = false;
    let hasRight = false;

    //CheckSideUp
    if (y - 1 >= 0) {
        if (content[y - 1][x] === elem) {
            hasUp = true;
        }
    }

    //CheckSideDown
    if (y + 1 < yCount) {
        if (content[y + 1][x] === elem) {
            hasDown = true;
        }
    }

    //CheckSideLeft
    if (x - 1 >= 0) {
        if (content[y][x - 1] === elem) {
            hasLeft = true;
        }
    }

    //CheckSideRight
    if (x + 1 < xCount) {
        if (content[y][x + 1] === elem) {
            hasRight = true;
        }
    }

    if (!hasUp) {
        className += " border-t-2";
    } else overrides += " rounded-t-none";

    if (!hasDown) {
        className += " border-b-2";
    } else overrides += " rounded-b-none";

    if (!hasLeft) {
        className += " border-l-2";
    } else overrides += " rounded-l-none";

    if (!hasRight) {
        className += " border-r-2";
    } else overrides += " rounded-r-none";

    return (
        <div
            onClick={() => {
                if (editable) onClick(x, y);
            }}
            className={twMerge(className, overrides)}>
            {elem}
        </div>
    );
};

export default PlanSection;
