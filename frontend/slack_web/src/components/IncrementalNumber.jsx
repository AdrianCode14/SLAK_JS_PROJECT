import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const IncrementalNumber = ({ initialState, onChange, className, min, max }) => {
    const [number, setNumber] = useState(initialState);

    const increment = () => {
        if (max && number + 1 > max) return;

        setNumber((number) => number + 1);
    };

    const decrement = () => {
        if (min && number - 1 < min) return;
        setNumber((number) => number - 1);
    };

    useEffect(() => {
        if (onChange) onChange(number);
    }, [number]);

    return (
        <div
            className={twMerge(
                "h-8 w-fit flex flex-row justify-between select-none",
                className
            )}>
            <button
                onClick={decrement}
                className="aspect-square bg-green1 rounded-l-lg text-white font-bold">
                -
            </button>
            <div className="bg-bg_gray flex min-w-[4rem] px-3 justify-center items-center shadow-[inset_-5px_-5px_4px_0px_rgba(255,255,255,.5),inset_5px_5px_4px_0px_rgba(70,70,70,.12)]">
                {number}
            </div>
            <button
                onClick={increment}
                className="aspect-square bg-green1 rounded-r-lg text-white font-bold">
                +
            </button>
        </div>
    );
};

export default IncrementalNumber;
