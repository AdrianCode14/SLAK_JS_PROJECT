import React from "react";
import { twMerge } from "tailwind-merge";

import "../css/core.css";

const CapsuleButton = ({ title, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={twMerge(
                "transition duration-500 hover:scale-105 h-16 w-52 border-0 rounded-3xl bg-gradient-to-r from-green1 to-green4 font-semibold text-xl text-white",
                className
            )}>
            <span>{title ?? "Button"}</span>
        </button>
    );
};

export default CapsuleButton;
