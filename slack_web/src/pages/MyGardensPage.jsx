import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Layout from "./Layout";
import ScrollView from "../components/ScrollView";
import Card from "../components/Card";
import CapsuleButton from "../components/CapsuleButton";
import GardenListItem from "../components/GardenListItem";
import axiosRetry from "axios-retry";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrent } from "../store/slice/navbar";
import { toast } from "react-toastify";
import { useAuth } from "../components/AuthProvider";
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

const MyGardensPage = () => {
    const { t } = useTranslation();
    const { setToken } = useAuth();
    const [ownGarden, setOwnGarden] = useState(undefined);
    const [affiliateGardens, setAffiliateGardens] = useState([]);
    const [loadingState, setLoadingState] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setCurrent(1));
        setLoadingState(true);
        axios
            .get(getApiUrl("/v1/garden/user-affiliated-gardens"))
            .then((response) => {
                setAffiliateGardens([...response.data]);
                setLoadingState(false);
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
                    navigate("/");
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

        axios
            .get(getApiUrl("/v1/garden/own-created-garden"))
            .then((response) => {
                if (response.data) setOwnGarden(response.data);
                setLoadingState(false);
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigate("/");
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_EXPIRED"
                ) {
                    navigate("/");
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_INVALID"
                ) {
                    setToken();
                } else if (reason.response.status === 404) {
                    setOwnGarden(undefined);
                    setLoadingState(false);
                } else if (reason.response.status !== 401) {
                    toast(t("components.notification.fetch"), {
                        type: "error",
                    });
                }
            });
    }, []);

    if (loadingState) {
        return (
            <Layout authRequired={true}>
                <div className="flex justify-center items-center w-full h-full bg-bg_gray overflow-hidden outline-none">
                    <svg
                        aria-hidden="true"
                        className="w-12 h-12 mr-2 animate-spin fill-green1 text-gray0"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </Layout>
        );
    }

    if (ownGarden) {
        return (
            <Layout authRequired={true}>
                <span className="w-full text-4xl font-medium text-gray1">
                    {t("pages.my-gardens.mine")}
                </span>
                <div className="flex flex-row pb-10 pt-8 px-8">
                    <Link to={`/my-garden/${ownGarden.id}`} className="w-full">
                        <GardenListItem
                            key={ownGarden.id}
                            garden={ownGarden}
                            isEditable={true}
                        />
                    </Link>
                </div>
                <span className="w-full text-4xl font-medium text-gray1">
                    {t("pages.my-gardens.my-affiliations")}
                </span>
                <div className="flex flex-row h-80 pb-10">
                    {affiliateGardens.length === 0 ? (
                        <div className="w-full h-full flex flex-row justify-center items-center pt-8">
                            {t("pages.my-gardens.no-affliated-gardens")}
                        </div>
                    ) : (
                        <ScrollView className="px-8 pt-8">
                            {affiliateGardens.map((garden) => (
                                <Link
                                    key={garden.id}
                                    to={`/my-garden/${garden.id}`}>
                                    <GardenListItem garden={garden} />
                                </Link>
                            ))}
                        </ScrollView>
                    )}
                </div>
            </Layout>
        );
    }

    return (
        <Layout className="flex flex-row" authRequired={true}>
            <section className="w-2/5 mx-4">
                <Card className="space-y-12 h-96 w-full flex flex-col justify-center">
                    <span className="font-bold text-xl text-center">
                        {t("browse.left.create-garden.title")}
                    </span>
                    <p className="text-normal font-normal text-justify pb-8">
                        {t("browse.left.create-garden.body1")} <br />{" "}
                        {t("browse.left.create-garden.body2")}
                    </p>
                    <CapsuleButton
                        title={t("browse.left.create-garden.btn")}
                        className="h-12 w-full"
                        onClick={() => navigate("/create-garden")}
                    />
                </Card>
            </section>
            <div className="flex-col flex w-full">
                <span className="w-full text-4xl font-medium text-gray1 ps-8">
                    {t("pages.my-gardens.my-affiliations")}
                </span>
                {affiliateGardens.length === 0 ? (
                    <div className="w-full h-full flex flex-row justify-center items-center pt-8">
                        {t("pages.my-gardens.no-affliated-gardens")}
                    </div>
                ) : (
                    <ScrollView className="px-8 pt-8">
                        {affiliateGardens.map((garden) => (
                            <GardenListItem key={garden.id} garden={garden} />
                        ))}
                    </ScrollView>
                )}
            </div>
        </Layout>
    );
};

export default MyGardensPage;
