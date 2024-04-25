import React from "react";
import { twMerge } from "tailwind-merge";

const TasksList = ({ stateContext, task, className, onClick }) => {
    const changeStateContext = () => {
        if (onClick) onClick();

        if (stateContext) {
            stateContext.set(task);
        }
    };

    const getTimeDifferenceInDays = (start_date, deadline_date) => {
        const startDate = new Date(start_date);
        const deadlineDate = new Date(deadline_date);
        const timeDiff = deadlineDate.getTime() - startDate.getTime();
        const diffDays = timeDiff / (1000 * 3600 * 24);

        return Math.round(diffDays + 1);
    };

    const isSelected = stateContext.value?.id === task?.id;
    const isDeadlineNear =
        getTimeDifferenceInDays(new Date(), task.deadline_date) < 2;
    const shadowStyles = `rounded-5xl ps-8 pt-3 pb-4 w-full h-14 flex flex-col cursor-pointer ${
        isDeadlineNear
            ? isSelected
                ? "shadow-[0px_4px_10px_5px_rgba(169,49,49,.2)] bg-red2"
                : "shadow-[0px_4px_10px_5px_rgba(169,49,49,.2)] bg-highlight_red"
            : isSelected
              ? "shadow-[0px_4px_10px_5px_rgba(49,169,93,.2)] bg-green1"
              : "shadow-[0px_4px_10px_5px_rgba(49,169,93,.2)] bg-highlight_green"
    }`;
    const infoStyles = `text-sm font-medium mr-6 -mt-3 ml-auto mb-6 ${
        isDeadlineNear
            ? isSelected
                ? ""
                : "text-red"
            : isSelected
              ? ""
              : "text-green2"
    }`;

    return (
        <div
            className={twMerge(
                shadowStyles,
                "overflow-hidden text-ellipsis whitespace-nowrap"
            )}
            onClick={changeStateContext}>
            <span className="text-gray1 text-2xl font-normal mb-1">
                {task.title}
            </span>
            <span className={infoStyles}>
                {getTimeDifferenceInDays(new Date(), task.deadline_date)} jours
                restants
            </span>
        </div>
    );
};

export default TasksList;
