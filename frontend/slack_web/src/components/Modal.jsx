import React from "react";

import Card from "../components/Card";
import { twMerge } from "tailwind-merge";

const Modal = ({ children, showModal, onCloseRequested, className }) => {
    const close = () => {
        if (onCloseRequested) onCloseRequested();
    };

    return (
        <>
            {showModal ? (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/30 outline-none focus:outline-none backdrop-blur-md"
                        onClick={close}></div>

                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none pointer-events-none">
                        <Card
                            className={twMerge(
                                "w-1/2 aspect-video opacity-100 pointer-events-auto",
                                className
                            )}>
                            {children}
                        </Card>
                    </div>
                </>
            ) : null}
        </>
    );
};

export default Modal;
