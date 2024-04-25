import React from "react";

import Card from "./Card";

import { FaTrash, FaCrown } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

const AffiliateCapsule = ({ affiliate, className, onDelete, onEdit }) => {
    const cardClasses = twMerge(
        "w-full h-12 flex flex-row items-center pb-6 justify-between",
        className
    );

    if (affiliate.role === "affiliate")
        return (
            <Card className={cardClasses}>
                <span className="font-medium text-gray1 select-none">
                    {affiliate.name} {affiliate.firstName}
                </span>
                <div className="flex">
                    <FaCrown
                        onClick={() => onEdit(affiliate)}
                        className="fill-[#69696993] hover:fill-green1 hover:scale-125 mr-2 transition-all duration-150 scale-110 active:scale-110"
                    />
                    <FaTrash
                        onClick={() => onDelete(affiliate)}
                        className="fill-highlight_red hover:fill-red hover:scale-125 transition-all duration-150 scale-110 active:scale-110"
                    />
                </div>
            </Card>
        );
    else
        return (
            <Card className={cardClasses}>
                <span className="font-medium text-gray1 select-none">
                    {affiliate.name} {affiliate.firstName}
                </span>
                <div className="flex">
                    <FaCrown className="fill-[#ffc400] scale-125" />
                </div>
            </Card>
        );
};

export default AffiliateCapsule;
