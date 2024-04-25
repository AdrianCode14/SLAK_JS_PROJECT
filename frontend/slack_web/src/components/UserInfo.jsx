import React from "react";
import { useRef } from "react";
import { toast } from "react-toastify";

import Card from "../components/Card";
import InputField from "../components/InputField";
import CapsuleButton from "./CapsuleButton";

const UserInfo = ({
    setUserInfoCard,
    getUserInfoCard,
    setCardPage,
    hasSwitched,
    translation,
    isEmpty,
}) => {
    const email = useRef();
    const firstName = useRef();
    const lastName = useRef();
    const emailRegExp = /^[a-zA-Z0-9_.+-âàéèêùûî]+@[a-zA-Z0-9-]+\.[\w-]{2,4}$/g;
    let userInfo = "";

    if (hasSwitched) {
        userInfo = getUserInfoCard();
    }

    function switchPage() {
        if (
            isEmpty(email.current.value) ||
            isEmpty(firstName.current.value) ||
            isEmpty(lastName.current.value)
        ) {
            toast(translation("register.error-field-empty"), { type: "error" });
            return;
        }

        if (!emailRegExp.test(email.current.value)) {
            toast(translation("register.error-email-invalid"), {
                type: "error",
            });
            return;
        }

        setUserInfoCard({
            email: email.current.value,
            firstName: firstName.current.value,
            lastName: lastName.current.value,
        });
        setCardPage(2);
    }

    return (
        <Card className="w-4/6 mx-auto justify-self-center flex">
            <div className="flex flex-col items-center mx-auto">
                <span className="text-xl font-semibold pb-8">
                    {translation("register.register")}
                </span>
                <span className="pb-2">
                    {translation("register.email-address")}
                </span>
                <InputField
                    key="email"
                    className="w-128"
                    ref={email}
                    defaultValue={userInfo.email ?? ""}></InputField>
                <span className="pb-2 pt-6">
                    {translation("register.first-name")}
                </span>
                <InputField
                    key="firstName"
                    className="w-128"
                    ref={firstName}
                    defaultValue={userInfo.firstName ?? ""}></InputField>
                <span className="pb-2 pt-6">
                    {translation("register.last-name")}
                </span>
                <InputField
                    key="lastName"
                    className="w-128"
                    ref={lastName}
                    defaultValue={userInfo.lastName ?? ""}></InputField>
                <span className="pt-10"></span>
                <CapsuleButton
                    className="h-9 w-44 text-base text-white"
                    title={translation("register.next")}
                    onClick={() => switchPage()}></CapsuleButton>
            </div>
            <span>1/2</span>
        </Card>
    );
};

export default UserInfo;
