import React, { useEffect, useRef, useState } from "react";
import "../css/core.css";
import axiosRetry from "axios-retry";
import axios from "axios";
import Layout from "./Layout";
import CapsuleButton from "../components/CapsuleButton";
import Card from "../components/Card";
import InputField from "../components/InputField";
import { useTranslation } from "react-i18next";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { toast, Zoom } from "react-toastify";

import { useDispatch } from "react-redux";
import { setCurrent } from "../store/slice/navbar";
import getApiUrl from "../utils/url";

axiosRetry(axios, {
    retries: 3,
    retryCondition(error) {
        switch (error.response.status) {
            case 500:
                return true;
            default:
                return false;
        }
    },
    retryDelay: axiosRetry.exponentialDelay,
});

const AccountPage = () => {
    const { i18n, t } = useTranslation();
    const { setToken } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [showModalModifyAccount, setShowModalModifyAccount] = useState(false);
    const newName = useRef();
    const newFirstName = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrent(2));
    }, []);

    const languageChange = (event) => {
        const newLanguage = event.target.value;
        i18n.changeLanguage(newLanguage);
    };

    const getUserData = () => {
        axios
            .get(getApiUrl("/v1/user/userdata"))
            .then((reponse) => {
                setUserData(reponse.data);
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigate("/");
                    toast(t("components.notification.timed-out"), {
                        type: "error",
                    });
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_EXPIRED"
                ) {
                    navigate("/login");
                    toast(t("components.notification.must_be_logged_in"), {
                        type: "error",
                    });
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_INVALID"
                ) {
                    setToken();
                    navigate("/login");
                    toast(t("components.notification.must_be_logged_in"), {
                        type: "error",
                    });
                } else if (reason.response.status !== 401) {
                    toast(t("components.notification.fetch"), {
                        type: "error",
                    });
                }
            });
    };

    const disconnect = () => {
        setToken();
        toast(t("components.notification.disconnected"), { type: "success" });
        navigate("/");
    };

    const saveNewInformation = (payload) => {
        if (!payload.newName || !payload.newFirstName) {
            toast(t("components.notification.empty-fields"), { type: "error" });
            return;
        }

        axios
            .patch(getApiUrl("/v1/user/updateUserData"), payload)
            .then(() => {
                setShowModalModifyAccount(false);
                getUserData();
                toast(t("components.notification.modify-complete"), {
                    type: "success",
                    autoclose: 3000,
                    transition: Zoom,
                });
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigate("/");
                    toast(t("components.notification.timed-out"), {
                        type: "error",
                    });
                } else if (
                    reason.response.status === 401 &&
                    reason.response.message == "TOKEN_EXPIRED"
                ) {
                    navigate("/login");
                    toast(t("components.notification.must_be_logged_in"), {
                        type: "error",
                    });
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_INVALID"
                ) {
                    setToken();
                    navigate("/login");
                    toast(t("components.notification.must_be_logged_in"), {
                        type: "error",
                    });
                } else if (reason.response.status !== 401) {
                    toast(t("components.notification.fetch"), {
                        type: "error",
                    });
                }
            });
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <>
            <Layout authRequired={true}>
                <Card className="relative w-full h-full flex flex-col items-center justify-end">
                    <select
                        className="absolute top-2 right-2 mt-6 mr-6 bg-bg_gray w-1/6 h-8 focus:outline-none rounded-xl px-5 text-xl text-gray2 shadow-[inset_-5px_-5px_4px_0px_rgba(255,255,255,.5),inset_5px_5px_4px_0px_rgba(70,70,70,.12)]"
                        name="language"
                        id="language-select"
                        onChange={languageChange}
                        defaultValue={i18n.language}>
                        <option value="en">English</option>
                        <option value="fr">Francais</option>
                    </select>
                    <div className="flex flex-row w-1/3 justify-left">
                        {t("account.name-firstname")}:
                        <span className="text-green2 ml-auto">
                            {userData.name + " " + userData.first_name}
                        </span>
                    </div>
                    <div className="flex flex-row w-1/3 justify-left mt-12">
                        {t("account.email")}:
                        <span className="text-green2 ml-auto">
                            {userData.email}
                        </span>
                    </div>
                    <div className="flex flex-row space-x-16 mt-32 mb-24">
                        <CapsuleButton
                            className="h-12 w-44 text-base"
                            title={t("account.btn-modify")}
                            onClick={() => setShowModalModifyAccount(true)}
                        />
                        <CapsuleButton
                            className="h-12 w-44 text-base"
                            title={t("account.btn-disconnect")}
                            onClick={() => disconnect()}
                        />
                    </div>
                </Card>
            </Layout>
            <Modal
                className="w-1/3"
                showModal={showModalModifyAccount}
                onCloseRequested={() => setShowModalModifyAccount(false)}>
                <div className="w-full border-b-[1px] border-green1/50">
                    <span className="flex w-full text-2xl font-bold justify-center">
                        {t("account.title-modify")}
                    </span>
                </div>
                <div className="flex flex-col flex-wrap items-center space-y-6">
                    <div className="w-full flex flex-row items-center mt-4 justify-center">
                        <label
                            htmlFor="#street"
                            className="w1/3 me-5 font-medium text-gray1 text-lg">
                            {t("account.name")}
                        </label>
                        <InputField
                            ref={newName}
                            id="#street"
                            className="w-2/3 text-center ml-auto"
                        />
                    </div>
                    <div className="w-full flex flex-row mt-4 justify-center">
                        <label
                            htmlFor="#street"
                            className="w1/3 font-medium text-gray1 text-lg">
                            {t("account.first-name")}
                        </label>
                        <InputField
                            ref={newFirstName}
                            id="#street"
                            className="w-2/3 text-center ml-auto"
                        />
                    </div>
                    <CapsuleButton
                        className="h-12 w-44 text-base text-white"
                        title={t("account.btn-save")}
                        onClick={() =>
                            saveNewInformation({
                                newName: newName.current.value,
                                newFirstName: newFirstName.current.value,
                            })
                        }></CapsuleButton>
                </div>
            </Modal>
        </>
    );
};

export default AccountPage;
