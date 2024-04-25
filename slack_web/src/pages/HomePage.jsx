import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../components/AuthProvider";
import "../css/core.css";

import TreeSVG from "../../assets/images/tree.svg";
import Layout from "./Layout";
import CapsuleButton from "../components/CapsuleButton";
import { isTokenValid } from "../utils/token";

const HomePage = () => {
    const { token } = useAuth();
    const { t } = useTranslation();
    const HomeImage = <img src={TreeSVG} className="svgtree" />;

    return (
        <Layout homeImage={HomeImage}>
            <div className="flex flex-col justify-center ps-20 h-[calc(100%-30px)]">
                <span className="font-medium text-xl tracking-widest">
                    {t("home.welcome")}
                </span>
                <span className="-mt-2 pb-8 font-black text-4xl max-w-xl">
                    {t("home.body1")} <br /> {t("home.body2")}
                </span>
                <Link to="/browse">
                    <CapsuleButton
                        title={t("home.btn-discover")}
                        href="/browse"
                    />
                </Link>
                <span className="hover:text-green2 pt-4 text-green3 font-semibold text-lg underline ">
                    <Link to={isTokenValid(token) ? "/my-gardens" : "/login"}>
                        {t("home.link-access-platform")}
                    </Link>
                </span>
            </div>
        </Layout>
    );
};

export default HomePage;
