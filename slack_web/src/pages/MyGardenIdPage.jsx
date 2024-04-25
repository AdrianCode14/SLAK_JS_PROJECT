import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "./Layout";
import PlanViewer from "../components/PlanViewer";
import ScrollView from "../components/ScrollView";
import ZoneList from "../components/ZoneList";
import Card from "../components/Card";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosRetry from "axios-retry";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCurrent } from "../store/slice/navbar";
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

const MyGardenIdPage = () => {
    const { setToken } = useAuth();
    const [xCount, setXCount] = useState(undefined);
    const [yCount, setYCount] = useState(undefined);
    const [content, setContent] = useState(undefined);
    const [garden, setGarden] = useState(undefined);
    const [areas, setAreas] = useState(undefined);
    const [ownGarden, setOwnGarden] = useState(undefined);
    const params = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrent(1));
        axios
            .get(getApiUrl(`/v1/garden/byID/${params.id}`))
            .then((response) => {
                const gardenData = response.data;
                setGarden(gardenData);
                setXCount(gardenData.plan.meta.sizeX);
                setYCount(gardenData.plan.meta.sizeY);
                setContent(gardenData.plan.content);
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
                    toast(t("pages.myGardenIdPage.fetch-data"), {
                        type: "error",
                    });
                }
            });

        axios
            .get(getApiUrl(`/v1/area/${params.id}`))
            .then((response) => {
                setAreas(response.data);
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
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_INVALID"
                ) {
                    setToken();
                } else if (reason.response.status !== 401) {
                    toast(t("components.notification.fetch"), {
                        type: "error",
                    });
                }
            });

        axios
            .get(getApiUrl("/v1/garden/own-created-garden"))
            .then((response) => {
                setOwnGarden(response.data);
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
                } else if (
                    reason.response.status === 401 &&
                    reason.response.data == "TOKEN_INVALID"
                ) {
                    setToken();
                } else if (reason.response.status === 404) {
                    setOwnGarden(undefined);
                } else if (reason.response.status !== 401) {
                    toast(t("components.notification.fetch"), {
                        type: "error",
                    });
                }
            });
    }, []);

    if (garden === undefined) {
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
    } else {
        return (
            <Layout className="justify-start" authRequired={true}>
                <div className=" flex flex-wrap space-y-0">
                    <span className="w-full text-4xl font-medium text-gray1">
                        {garden.name}{" "}
                        {ownGarden?.id === garden?.id ? (
                            <button
                                className="ml-8 group align-baseline"
                                onClick={() => navigate("/edit-garden")}>
                                <FaRegEdit className="group-hover:fill-green1 group-hover:scale-110 transition-all duration-200" />
                            </button>
                        ) : (
                            ""
                        )}
                    </span>
                    <span className="font-medium text-3xl text-gray1 w-4/6 pt-8">
                        {t("pages.myGardenIdPage.map")}
                    </span>
                    <span className="text-3xl font-medium text-gray1 w-2/6 pt-8 px-1">
                        {t("pages.myGardenIdPage.areas")}
                    </span>
                    <div className="w-4/6 bg-gray-300 pr-20">
                        <Card className="w-full aspect-video mt-8 focus-within:border-4 focus-within:border-green1">
                            <PlanViewer
                                editable={false}
                                contentState={[content, setContent]}
                                xCount={xCount}
                                yCount={yCount}
                                bg="bg-white"
                            />
                        </Card>
                    </div>
                    <div className="w-2/6 bg-gray-500">
                        {areas?.length === 0 ? (
                            <div className="w-full h-full flex flex-row justify-center items-center pt-8">
                                {t("pages.myGardenIdPage.noAreas")}
                            </div>
                        ) : (
                            <ScrollView className="px-1 pt-8 space-y-6">
                                {areas &&
                                    areas.map((zone) => (
                                        <Link
                                            key={zone.id}
                                            to={`/area/${zone.id}`}
                                            className="block">
                                            <ZoneList zone={zone} />
                                        </Link>
                                    ))}
                            </ScrollView>
                        )}
                    </div>
                </div>
            </Layout>
        );
    }
};

export default MyGardenIdPage;
