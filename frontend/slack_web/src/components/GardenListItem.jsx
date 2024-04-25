import React from "react";
import { FaPlus } from "react-icons/fa6";

import CapsuleCard from "./CapsuleCard";
import axiosRetry from "axios-retry";
import axios from "axios";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { parsePGDateFR } from "../utils/date";
import { useAuth } from "./AuthProvider";

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

const GardenListItem = ({ garden, stateContext, isEditable, isJoinable }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { setToken } = useAuth();

    const GetAddressSplitted = (address) => {
        return address.split("#");
    };

    const ChangeStateContext = () => {
        if (stateContext) {
            if (stateContext.value == garden.id) stateContext.set(-1);
            else stateContext.set(garden.id);
        }
    };

    const openGarden = () => {
        navigate(`/my-garden/${garden.id}`);
    };

    const editGarden = () => {
        navigate("/edit-garden");
    };

    const onAddGarden = (e) => {
        e.stopPropagation();
        axios
            .post(getApiUrl("/v1/garden/join"), {
                gardenID: garden.id,
            })
            .then(() => {
                toast(t("components.notification.affiliated"), {
                    type: "success",
                });
                navigate(`/my-garden/${garden.id}`);
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigate("/");
                    toast(t("components.notification.timed-out"), {
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
                } else if (reason.request.status === 401) {
                    navigate("/login");
                    toast(t("components.notification.must_be_logged_in"), {
                        type: "error",
                    });
                } else if (reason.request.status === 409) {
                    toast(t("components.notification.already_affiliated"), {
                        type: "warning",
                    });
                    navigate(`/my-garden/${garden.id}`);
                } else {
                    toast(t("components.notification.fetch"), {
                        type: "error",
                    });
                }
            });
    };

    const addressSplitted = GetAddressSplitted(garden.address);
    const dateString = parsePGDateFR(garden.date);

    if (isJoinable && stateContext.value == garden.id) {
        return (
            <article
                onClick={ChangeStateContext}
                className="cursor-pointer flex flex-wrap items-end w-full bg-highlight_green mb-12 h-52 rounded-5xl pe-8 ps-8 pb-2 pt-6 shadow-[0px_0px_30px_5px_rgba(49,169,93,.2)]">
                <span className="text-gray1 text-2xl font-bold w-5/6 self-center">
                    {garden.name}
                </span>
                <button
                    className="ml-auto w-12 h-12 rounded-5xl bg-green1 self-center flex items-center justify-center"
                    onClick={(e) => onAddGarden(e)}>
                    <FaPlus color="#fff" className="text-2xl" />
                </button>
                <div className="text-gray1 w-full -mt-6 self-center text-base font-normal">
                    {addressSplitted.map((a, index) => {
                        return (
                            <span key={index}>
                                {a}
                                <br />
                            </span>
                        );
                    })}
                </div>
                <span className="text-black text-start w-1/2 font-medium text-sm">
                    {dateString}
                </span>
                <span className="text-gray1 text-end w-1/2 font-medium text-sm">
                    {garden.id}
                </span>
            </article>
        );
    } else {
        return (
            <CapsuleCard
                onClickHandler={isJoinable ? ChangeStateContext : openGarden}
                gardenName={garden.name}
                meaningAddress={addressSplitted[1]}
                gardenID={garden.id}
                isEditable={isEditable}
                onEditClick={editGarden}
            />
        );
    }
};

export default GardenListItem;
