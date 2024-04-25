import React from "react";

import LogoSVG from "../../assets/images/logo.svg";
import "../css/core.css";
import { Link } from "react-router-dom";

const BasicLogo = () => {
    return (
        <Link to="/">
            <div className="absolute flex top-6 left-6 items-center space-x-5">
                <img src={LogoSVG} className="svglogo" />
                <span className="font-extrabold tracking-logo text-3xl ">
                    SLAK
                </span>
            </div>
        </Link>
    );
};

export default BasicLogo;
