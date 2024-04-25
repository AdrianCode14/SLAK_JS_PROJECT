import React from "react";

import BasicLogo from "../components/BasicLogo";
import Copyright from "../components/Copyright";
import Navbar from "../components/Navbar";
import "../css/core.css";

import ProtectedContentSecurity from "../components/ProtectedContentSecurity";

import { twMerge } from "tailwind-merge";

const Layout = ({ children, homeImage, className, authRequired }) => {
    return (
        <div className="bg">
            <main className="content">
                <BasicLogo />
                {homeImage && (
                    <>
                        {homeImage}
                        <div className="flex text-xl mb-16 space-x-10 h-36"></div>
                    </>
                )}
                {!homeImage && <Navbar />}

                <ProtectedContentSecurity authRequired={authRequired}>
                    <div
                        className={twMerge(
                            "flex flex-col justify-center ps-20 pe-20 h-[70%] mb-2",
                            className
                        )}>
                        {children}
                    </div>
                </ProtectedContentSecurity>

                <Copyright />
            </main>
        </div>
    );
};

export default Layout;
