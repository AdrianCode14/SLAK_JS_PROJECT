import React from "react";
import Card from "../components/Card";
import { useTranslation } from "react-i18next";

const ErrorPage = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-row justify-center bg-bg_gray items-center fixed inset-0 outline-none focus:outline-none">
            <Card className="flex flex-col items-center flex-wrap w-1/2 h-[400px]">
                <h1 className="text-6xl font-semibold mt-16 text-center text-gray1 h-fit">
                    {t("404.error")}{" "}
                    <span className="font-bold text-red">404</span>
                </h1>
                <span className="text-3xl font-medium text-gray1 h-fit mt-20">
                    {t("404.not-found")}
                </span>
            </Card>
        </div>
    );
};

export default ErrorPage;
