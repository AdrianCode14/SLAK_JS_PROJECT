import React from "react";
import { useTranslation } from "react-i18next";
import Card from "./Card";

const CapsuleCard = ({
    onClickHandler,
    gardenName,
    meaningAddress,
    gardenID,
    isEditable,
    onEditClick,
}) => {
    const { t } = useTranslation();
    const editClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        onEditClick();
    };

    return (
        <Card
            onClickHandler={onClickHandler}
            className="cursor-pointer hover:bg-highlight_green flex flex-wrap w-full mb-12 h-16 pt-3 group">
            <span className="text-left text-xl text-gray1 font-medium mr-auto">
                {gardenName}
            </span>
            {isEditable && (
                <span
                    className="mr-6 text-green2 font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    onClick={editClick}>
                    {t("components.capsule-card.edit")}
                </span>
            )}
            <span className=" text-right text-base text-gray1 font-medium">
                {meaningAddress}
            </span>
            <span className="w-full text-right text-sm text-green2 font-medium group-hover:text-gray1">
                {gardenID}
            </span>
        </Card>
    );
};

export default CapsuleCard;
