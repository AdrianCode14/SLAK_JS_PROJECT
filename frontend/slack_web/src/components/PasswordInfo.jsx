import React, { useRef, useState } from "react";

import Card from "../components/Card";
import InputField from "../components/InputField";
import CapsuleButton from "./CapsuleButton";

const PasswordInfo = ({
    setCardPage,
    translation,
    setHasSwitched,
    isEmpty,
    register,
}) => {
    const password = useRef();
    const verifyPassword = useRef();
    const [passwordRequirementsNeeded, setPasswordRequirementsNeeded] =
        useState(false);
    const passwordRegExp = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,}$/g;
    const [errorMessage, setErrorMessage] = useState(undefined);
    function setUser() {
        setPasswordRequirementsNeeded(false);
        setErrorMessage(undefined);
        if (
            isEmpty(password.current.value) ||
            isEmpty(verifyPassword.current.value)
        ) {
            setErrorMessage(translation("register.error-field-empty"));
            return;
        }

        if (!passwordRegExp.test(password.current.value)) {
            setPasswordRequirementsNeeded(true);

            return;
        }

        if (!matchPassword()) {
            setErrorMessage(translation("register.error-match-password"));
            return;
        }

        register(password.current.value);
    }

    function matchPassword() {
        return password.current.value === verifyPassword.current.value;
    }

    const renderPasswordRequirements = () => {
        if (passwordRequirementsNeeded) {
            return (
                <>
                    <span className=" text-red font-bold mt-6">
                        {translation("register.error-password-title")}
                    </span>
                    <ul className="mb-4 text-red font-medium list-disc list-outside">
                        <li className="-ml-10">
                            {translation("register.error-password-0")}
                        </li>
                        <li className="-ml-10">
                            {translation("register.error-password-1")}
                        </li>
                        <li className="-ml-10">
                            {translation("register.error-password-2")}
                        </li>
                    </ul>
                </>
            );
        }

        return;
    };

    return (
        <Card className="w-4/6 mx-auto justify-self-center flex">
            <div className="flex flex-col items-center mx-auto">
                <span className="text-xl font-semibold pb-8">
                    {translation("register.register")}
                </span>
                <span className="pb-2">{translation("register.password")}</span>
                <InputField
                    key="password"
                    className="w-128"
                    ref={password}
                    type="password"></InputField>
                <span className="pb-2 pt-6">
                    {translation("register.verify-password")}
                </span>
                <InputField
                    key="verifyPassword"
                    id="verifyPassword"
                    className="w-128"
                    ref={verifyPassword}
                    type="password"></InputField>
                {renderPasswordRequirements()}
                <span className=" text-red font-bold mt-6">{errorMessage}</span>
                <div className="flex mt-10 space-x-3">
                    <CapsuleButton
                        className="h-9 w-44 text-base text-white"
                        title={translation("register.previous")}
                        onClick={() => {
                            setHasSwitched(true);
                            setCardPage(1);
                        }}></CapsuleButton>
                    <CapsuleButton
                        className="h-9 w-44 text-base text-white"
                        title={translation("register.create")}
                        onClick={() => setUser()}></CapsuleButton>
                </div>
            </div>
            <span>2/2</span>
        </Card>
    );
};

export default PasswordInfo;
