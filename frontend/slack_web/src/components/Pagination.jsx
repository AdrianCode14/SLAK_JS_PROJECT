import React, { useEffect } from "react";

import { twMerge } from "tailwind-merge";

import { FaLeftLong, FaRightLong } from "react-icons/fa6";

const Pagination = ({ className, rows, itemCount, currentPageState }) => {
    const pagesCount = Math.max(Math.ceil(itemCount / rows), 1);

    useEffect(() => {}, [currentPageState[0]]);

    const renderPagesCount = () => {
        return (
            <div className="w-6 h-6 flex flex-row items-center justify-center">
                {currentPageState[0]}
            </div>
        );
    };

    const decrementPage = () => {
        if (currentPageState[0] > 1)
            currentPageState[1](currentPageState[0] - 1);
    };
    const gotoPage = (i) => {
        if (i >= 1 && i <= pagesCount) currentPageState[1](i);
    };

    const incrementPage = () => {
        if (currentPageState[0] < pagesCount)
            currentPageState[1](currentPageState[0] + 1);
    };

    return (
        <div
            className={twMerge(
                "w-full flex flex-row flex-wrap space-x-2 select-none justify-center font-semibold ",
                className
            )}>
            <div
                className="w-6 h-6 flex flex-row items-center justify-center cursor-pointer"
                onClick={() => gotoPage(1)}>
                1
            </div>
            <div
                className="w-6 h-6 flex flex-row items-center justify-center cursor-pointer"
                onClick={decrementPage}>
                <FaLeftLong color="#009A61" />
            </div>

            {renderPagesCount()}

            <div
                className="w-6 h-6 flex flex-row items-center justify-center cursor-pointer"
                onClick={incrementPage}>
                <FaRightLong color="#009A61" />
            </div>
            <div
                className="w-6 h-6 flex flex-row items-center justify-center cursor-pointer"
                onClick={() => gotoPage(pagesCount)}>
                {pagesCount}
            </div>
        </div>
    );
};

export default Pagination;
