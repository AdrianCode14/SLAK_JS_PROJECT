import React from "react";

import Card from "./Card";

import { FaRegTrashCan } from "react-icons/fa6";

const AreaCapsule = ({
    area,
    onDelete,
    currentAreaState: [currentAreaSelected, setCurrentAreaSelected],
}) => {
    const onClick = () => {
        if (currentAreaSelected === area.area_index) setCurrentAreaSelected(-1);
        else setCurrentAreaSelected(area.area_index);
    };

    if (currentAreaSelected === area.area_index) {
        return (
            <Card
                className="cursor-pointer transition-colors duration-200 w-full h-12 flex flex-row items-center pb-6 justify-between bg-highlight_green select-none"
                onClickHandler={onClick}>
                <div className="w-1/2 flex justify-between">
                    <span className="font-bold text-green1 mr-10 w-10 text-center">
                        {area.area_index}
                    </span>
                    <span className="font-medium text-gray1 text-start w-48">
                        {area.name}
                    </span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(area.area_index);
                    }}
                    className="flex h-8 aspect-square items-center justify-center">
                    <FaRegTrashCan className="fill-gray1 hover:fill-red transition-colors duration-150 scale-110" />
                </button>
            </Card>
        );
    } else
        return (
            <Card
                className="cursor-pointer transition-colors duration-200 w-full h-12 flex flex-row items-center pb-6 justify-between select-none"
                onClickHandler={onClick}>
                <div className="w-1/2 flex justify-between">
                    <span className="font-bold text-green1 mr-10 w-10 text-center">
                        {area.area_index}
                    </span>
                    <span className="font-medium text-gray1 text-start w-48">
                        {area.name}
                    </span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(area.area_index);
                    }}
                    className="flex h-8 aspect-square items-center justify-center">
                    <FaRegTrashCan className="fill-gray1 hover:fill-red transition-colors duration-150 scale-110" />
                </button>
            </Card>
        );
};

export default AreaCapsule;
