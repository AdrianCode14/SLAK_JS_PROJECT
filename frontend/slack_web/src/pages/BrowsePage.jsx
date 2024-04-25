import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import axiosRetry from "axios-retry";
import axios from "axios";

import Layout from "./Layout";
import GardenListItem from "../components/GardenListItem";
import CapsuleButton from "../components/CapsuleButton";
import CapsuleSkeletton from "../components/CapsuleSkeleton";
import SearchBar from "../components/SearchBar";
import ScrollView from "../components/ScrollView";
import Card from "../components/Card";

import { useDispatch } from "react-redux";
import { setCurrent } from "../store/slice/navbar";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

const BrowsePage = () => {
    const { t } = useTranslation();
    const [gardenOpened, setGardenOpened] = useState(-1);
    const [loadingState, setLoadingState] = useState(false);
    const [gardens, setGardens] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setCurrent(0));
        setLoadingState(true);
        axios
            .get(getApiUrl("/v1/garden"))
            .then((response) => {
                setGardens(response.data);
                setLoadingState(false);
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigate("/");
                    toast(t("components.notification.timed-out"), {
                        type: "error",
                    });
                } else {
                    toast(t("components.notification.fetch"), {
                        type: "error",
                    });
                }
            });
    }, []);

    const OnSearch = async (query) => {
        setLoadingState(true);
        axios
            .post(getApiUrl("/v1/garden/search"), { query: query })
            .then((response) => {
                setGardens(response.data);
                setLoadingState(false);
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigate("/");
                    toast(t("components.notification.timed-out"), {
                        type: "error",
                    });
                } else {
                    toast(t("components.notification.fetch"), {
                        type: "error",
                    });
                }
            });
    };

    return (
        <Layout>
            <div className="w-2/6 self-end mx-4 mb-6 h-14 flex items-center flex-wrap flex-row-reverse">
                <SearchBar OnSearchHandler={OnSearch} />
                {!loadingState && (
                    <span className="font-normal text-xs text-gray2">
                        {gardens.length} {t("browse.status-xresults")}
                    </span>
                )}
                {loadingState && (
                    <span className="font-normal text-xs text-gray2">
                        {t("browse.loading-state-status")}
                    </span>
                )}
            </div>
            <div className="w-full flex flex-row h-full pb-10">
                <section className="w-2/5 mx-4">
                    <Card className="space-y-12 h-96 w-full flex flex-col justify-center">
                        <span className="font-bold text-xl text-center">
                            {t("browse.left.create-garden.title")}
                        </span>
                        <p className="text-normal font-normal text-justify pb-8">
                            {t("browse.left.create-garden.body1")} <br />{" "}
                            {t("browse.left.create-garden.body2")}
                        </p>
                        <Link to="/create-garden">
                            <CapsuleButton
                                title={t("browse.left.create-garden.btn")}
                                className="h-12 w-full"
                                href="/"
                            />
                        </Link>
                    </Card>
                </section>
                {!loadingState && (
                    <ScrollView className="px-5 pt-8">
                        {gardens.map((garden) => (
                            <GardenListItem
                                key={garden.id}
                                garden={garden}
                                stateContext={{
                                    value: gardenOpened,
                                    set: setGardenOpened,
                                }}
                                isJoinable={true}
                            />
                        ))}
                    </ScrollView>
                )}
                {loadingState && (
                    <ScrollView className="px-5 pt-8">
                        <CapsuleSkeletton count={5} />
                    </ScrollView>
                )}
            </div>
        </Layout>
    );
};

export default BrowsePage;
