import React from "react";
import { useSelector } from "react-redux";

import "../css/core.css";
import SilhouetteSVG from "../../assets/images/silhouette.svg";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { isTokenValid } from "../utils/token";
import { useAuth } from "./AuthProvider";

const Navbar = () => {
    const { t } = useTranslation();
    const current = useSelector((state) => state.navbar.current);
    const { token } = useAuth();
    return (
        <nav className="flex justify-end items-end pt-20 h-auto mr-28 space-x-10 mb-16 text-gray1 font-semibold text-xl ">
            <Link
                to="/browse"
                className={
                    current == 0 ? "border-b-4 border-green1 -mb-1" : ""
                }>
                {t("components.searchbar.placeholder")}
            </Link>
            <Link
                to={isTokenValid(token) ? "/my-gardens" : "/login"}
                className={
                    current == 1 ? "border-b-4 border-green1 -mb-1" : ""
                }>
                {t("components.navbar.my-gardens")}
            </Link>

            <Link
                to={isTokenValid(token) ? "/account" : "/login"}
                className={"-mb-1"}>
                <img
                    src={SilhouetteSVG}
                    alt="Silhouette"
                    className={
                        current == 2 ? "border-b-4 border-green1 pb-1" : "mb-2"
                    }
                />
            </Link>
        </nav>
    );
};

export default Navbar;
