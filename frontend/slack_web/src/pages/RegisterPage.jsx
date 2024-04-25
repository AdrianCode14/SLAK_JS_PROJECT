import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosRetry from "axios-retry";
import axios from "axios";

import UserInfo from "../components/UserInfo";
import PasswordInfo from "../components/PasswordInfo";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";
import { Zoom, toast } from "react-toastify";

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

const RegisterPage = () => {
    const { t } = useTranslation();
    const [currentCard, setCurrentCard] = useState(1);
    const [userInfoCard, setUserInfoCard] = useState({});
    const [hasSwitched, setHasSwitched] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getUserInfoCard = () => {
        return userInfoCard;
    };

    useEffect(() => {
        dispatch(setCurrent(2));
    }, []);

    const register = async (password) => {
        const { email, firstName, lastName } = userInfoCard;

        axios
            .post(getApiUrl("/v1/user/register"), {
                email: email,
                name: lastName,
                firstName: firstName,
                password: password,
            })
            .then(() => {
                toast(t("components.notification.register"), {
                    type: "success",
                    autoclose: 3000,
                    transition: Zoom,
                });
                navigate("/login");
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigate("/");
                    toast(t("components.notification.timed-out"), {
                        type: "error",
                    });
                } else if (reason.response.status === 409) {
                    toast(t("components.notification.already-exist"), {
                        type: "warning",
                    });
                } else {
                    toast(t("components.notification.fetch"), {
                        type: "error",
                    });
                }
            });
    };

    function isEmpty(value) {
        return value === "";
    }

    return (
        <Layout>
            {currentCard === 1 ? (
                <UserInfo
                    setUserInfoCard={setUserInfoCard}
                    getUserInfoCard={getUserInfoCard}
                    setCardPage={setCurrentCard}
                    hasSwitched={hasSwitched}
                    translation={t}
                    isEmpty={isEmpty}
                />
            ) : (
                <PasswordInfo
                    setCardPage={setCurrentCard}
                    translation={t}
                    setHasSwitched={setHasSwitched}
                    isEmpty={isEmpty}
                    register={register}
                />
            )}
        </Layout>
    );
};

export default RegisterPage;
