import React, { useRef, useEffect } from "react";

import { useController } from "../hooks/UseController";
import PlanSection from "./PlanSection";
import { twMerge } from "tailwind-merge";

const PlanViewerPage = ({
    editable,
    contentState: [content, setContent],
    xCount,
    yCount,
    currentAreaSelected,
    bg,
}) => {
    const viewPortRef = useRef();
    const [
        onKeyDownListener,
        onKeyUpListener,
        onMouseMoveListener,
        onMouseDownListener,
        onMouseUpListener,
        onFocusListener,
        onFocusOutListener,
        onScrollListener,
    ] = useController(viewPortRef);

    const onClick = (x, y) => {
        if (currentAreaSelected === -1) return;

        let v = currentAreaSelected;

        if (currentAreaSelected === content[y][x]) {
            v = null;
        }

        let newContent = [...content];
        newContent[y][x] = v;
        setContent(newContent);
    };

    const buildPlan = () => {
        return content.map((row, y) => {
            return row.map((elem, x) => {
                return (
                    <PlanSection
                        key={x + y * yCount}
                        editable={editable}
                        plan={{ xCount, yCount, content }}
                        x={x}
                        y={y}
                        elem={elem}
                        onClick={onClick}
                    />
                );
            });
        });
    };

    useEffect(() => {
        document.documentElement.style.setProperty("--scale", 1.0);
        viewPortRef.current?.style.setProperty("--xCount", xCount);
        viewPortRef.current?.style.setProperty("--yCount", yCount);
    }, [xCount, yCount]);

    if (xCount && yCount && content)
        return (
            <div
                tabIndex={0}
                onKeyDown={onKeyDownListener}
                onKeyUp={onKeyUpListener}
                onMouseMove={onMouseMoveListener}
                onMouseDown={onMouseDownListener}
                onMouseUp={onMouseUpListener}
                onFocus={onFocusListener}
                onBlur={onFocusOutListener}
                onWheel={onScrollListener}
                className={twMerge(
                    "relative select-none w-full h-full bg-bg_gray overflow-hidden outline-none",
                    bg
                )}>
                <div
                    ref={viewPortRef}
                    className="absolute w-[calc(50px*var(--xCount))] h-[calc(50px*var(--yCount))] flex flex-wrap overflow-hidden scale-[var(--scale)] left-[calc((100%/2)-calc(25px*var(--xCount)))] top-[calc((100%/2)-calc(25px*var(--yCount)))]">
                    {buildPlan()}
                </div>

                <div className="absolute flex flex-row w-10 right-5 bottom-7 items-center space-x-2">
                    <div className="bg-black w-[2px] h-[50px] scale-y-[var(--scale)]"></div>
                    <span className="text-end">1 m</span>
                </div>
            </div>
        );
    else
        return (
            <div className="flex justify-center items-center w-full h-full bg-bg_gray overflow-hidden outline-none">
                <svg
                    aria-hidden="true"
                    className="w-12 h-12 mr-2 animate-spin fill-green1 text-gray0"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                    />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                    />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        );
};

export default PlanViewerPage;
