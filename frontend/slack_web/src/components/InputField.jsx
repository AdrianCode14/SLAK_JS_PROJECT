import React from "react";

import { twMerge } from "tailwind-merge";

const InputField = (
    { type, placeHolder, className, onClick, disabled, id, defaultValue },
    ref
) => {
    const defaultClassName = `
    bg-bg_gray w-2/5 h-12 focus:outline-none rounded-2xl px-5
    text-xl text-gray2 
    shadow-[inset_-5px_-5px_4px_0px_rgba(255,255,255,.5),inset_5px_5px_4px_0px_rgba(70,70,70,.12)]
    `;

    return (
        <input
            ref={ref}
            onClick={onClick ?? (() => {})}
            type={type ?? "text"}
            className={twMerge(defaultClassName, className)}
            placeholder={placeHolder ?? ""}
            readOnly={disabled}
            id={id ?? undefined}
            defaultValue={defaultValue ?? ""}
        />
    );
};

export default React.forwardRef(InputField);
