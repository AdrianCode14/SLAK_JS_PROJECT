import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Layout from "./Layout";
import ScrollView from "../components/ScrollView";
import TasksList from "../components/TasksList";
import Card from "../components/Card";
import Modal from "../components/Modal";
import { useParams } from "react-router-dom";
import axiosRetry from "axios-retry";
import axios from "axios";
import CapsuleButton from "../components/CapsuleButton";
import InputField from "../components/InputField";
import { FaInfoCircle } from "react-icons/fa";
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

const ZonePage = () => {
    const { setToken } = useAuth();
    const [modalAddTaskOpened, setModalAddTaskOpened] = useState(false);
    const [modalAreaOpened, setModalAreaOpened] = useState(false);
    const [tasks, setTasks] = useState(undefined);
    const [selectedTask, setSelectedTask] = useState(
        tasks?.length > 0 ? tasks[0] : undefined
    );
    const [area, setArea] = useState(undefined);
    const [ownGarden, setOwnGarden] = useState(undefined);
    const [garden, setGarden] = useState(undefined);
    const params = useParams();
    const taskTitleRef = useRef();
    const taskDescriptionRef = useRef();
    const taskDeadlineRef = useRef();
    const [modalTaskErrorMessage, setModalTaskErrorMessage] = useState("");
    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrent(1));
        axios
            .get(getApiUrl(`/v1/area/from-area/${params.id}`))
            .then((response) => {
                setArea(response.data);
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

        getTasks();

        axios
            .get(getApiUrl("/v1/garden/own-created-garden"))
            .then((response) => {
                setOwnGarden(response.data);
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigate("/");
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

        axios
            .get(getApiUrl(`/v1/garden/fromArea/${params.id}`))
            .then((response) => {
                setGarden(response.data);
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigate("/");
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
                    setGarden(undefined);
                } else if (reason.response.status !== 401) {
                    toast(t("components.notification.fetch"), {
                        type: "error",
                    });
                }
            });
    }, []);

    const getTasks = () => {
        axios
            .get(getApiUrl(`/v1/task/${params.id}`))
            .then((response) => {
                setTasks(response.data);
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigate("/");
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
    };

    const validateTask = () => {
        if (!selectedTask) {
            return;
        }

        axios
            .patch(getApiUrl(`/v1/task/validate/${params.id}`), {
                taskID: selectedTask.id,
            })
            .then(() => {
                setTasks(tasks.filter((task) => task.id !== selectedTask.id));
                toast(t("pages.zonePage.error-messages.validateTask"), {
                    type: "success",
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

        setSelectedTask(undefined);
    };

    const addTask = () => {
        const title = taskTitleRef.current?.value;
        const description = taskDescriptionRef.current?.value;
        const deadline = taskDeadlineRef.current?.value;
        if (title && description && deadline) {
            const date = new Date(deadline);
            if (date < Date.now()) {
                setModalTaskErrorMessage(
                    t("pages.zonePage.error-messages.dateError")
                );
                return;
            }
            axios
                .post(getApiUrl(`/v1/task/add/${params.id}`), {
                    title: title,
                    description: description,
                    deadline: date.toISOString(),
                })
                .then(() => {
                    setModalTaskErrorMessage("");
                    setModalAddTaskOpened(false);
                    getTasks();
                    toast(t("pages.zonePage.error-messages.createdTasks"), {
                        type: "success",
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
                        toast(
                            t(
                                "pages.zonePage.error-messages.errorCreatingTask"
                            ),
                            { type: "error" }
                        );
                    }
                });
        } else {
            setModalTaskErrorMessage(
                t("pages.zonePage.error-messages.emptyFields")
            );
        }
    };

    if (!area) {
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
    } else
        return (
            <>
                <Layout className="justify-start" authRequired={true}>
                    <span className="w-full text-4xl text-gray font-bold">
                        {area?.name}
                        <button
                            className="ml-8 group align-bottom"
                            onClick={() => setModalAreaOpened(true)}>
                            <FaInfoCircle className="group-hover:fill-green1 group-hover:scale-90 scale-75 transition-all duration-200" />
                        </button>
                    </span>
                    <div className="w-full h-full flex flex-col flex-wrap">
                        <div className="flex flex-row flex-wrap w-2/3">
                            <span className="font-medium text-3xl text-gray1 w-4/6 pt-8">
                                {t("pages.zonePage.description")}
                            </span>
                            <Card className="h-[345px] mt-8 w-2/3 aspect-video focus-within:border-4 focus-within:border-green1">
                                <ScrollView className="break-words overflow-y-auto">
                                    {selectedTask?.description}
                                </ScrollView>
                            </Card>
                        </div>

                        <div className="w-1/3">
                            <div className="flex text-3xl font-medium text-gray1 pt-8 px-3">
                                <span>{t("pages.zonePage.task")}</span>
                                {ownGarden?.id === garden?.id ? (
                                    <div
                                        className="h-8 w-8  ml-auto rounded-3xl bg-gradient-to-r from-green1 to-green4 font-semibold text-xl text-white flex items-center justify-center cursor-pointer"
                                        onClick={() =>
                                            setModalAddTaskOpened(true)
                                        }>
                                        +
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="flex flex-col items-center">
                                {tasks?.length === 0 ? (
                                    <div className="w-full h-[345px] flex flex-row justify-center items-center pt-8">
                                        {t("pages.zonePage.tasksDone")}
                                    </div>
                                ) : (
                                    <ScrollView className="px-3 pt-8 pb-8 space-y-6 h-[345px]">
                                        {tasks?.map((task) => (
                                            <TasksList
                                                stateContext={{
                                                    value: selectedTask,
                                                    set: setSelectedTask,
                                                }}
                                                key={task.id}
                                                task={task}
                                            />
                                        ))}
                                    </ScrollView>
                                )}
                                <CapsuleButton
                                    title={t("pages.zonePage.validate")}
                                    className="w-full px-3 mt-3 rounded-5xl"
                                    onClick={validateTask}
                                />
                            </div>
                        </div>
                    </div>
                </Layout>

                <Modal
                    showModal={modalAreaOpened}
                    onCloseRequested={() => setModalAreaOpened(false)}
                    className="flex flex-col bg-bg_gray w-[500px] h-[420px]">
                    <div className="w-full border-b-[1px] border-green1/50">
                        <span className="w-full text-4xl font-bold">
                            {t("pages.zonePage.areaDescription")}
                        </span>
                    </div>
                    <div className="mt-4">{area?.description}</div>
                </Modal>

                <Modal
                    showModal={modalAddTaskOpened}
                    onCloseRequested={() => setModalAddTaskOpened(false)}
                    className="flex flex-col bg-bg_gray w-[500px] h-[420px]">
                    <div className="w-full border-b-[1px] border-green1/50">
                        <span className="w-full text-4xl font-bold">
                            {t("pages.zonePage.newTask")}
                        </span>
                    </div>
                    <div className="w-full flex flex-row flex-wrap items-center mt-4 justify-between">
                        <label
                            htmlFor="#title"
                            className="me-5 font-medium text-gray1 text-lg">
                            {t("pages.zonePage.title")}
                        </label>
                        <InputField
                            ref={taskTitleRef}
                            id="#title"
                            className="w-120"
                        />
                    </div>
                    <div className="w-full flex flex-row flex-wrap items-center mt-4 justify-between">
                        <label
                            htmlFor="#description"
                            className="me-5 font-medium text-gray1 text-lg">
                            {t("pages.zonePage.description")}
                        </label>
                        <InputField
                            ref={taskDescriptionRef}
                            id="#description"
                            className="w-120"
                        />
                    </div>
                    <div className="w-full flex flex-row flex-wrap items-center mt-4 justify-between">
                        <label
                            htmlFor="#deadline"
                            className="me-5 font-medium text-gray1 text-lg">
                            {t("pages.zonePage.deadline")}
                        </label>
                        <InputField
                            type="datetime-local"
                            ref={taskDeadlineRef}
                            id="#deadline"
                            className="w-120"
                        />
                    </div>

                    <span className="w-full text-center text-red mt-8 h-6">
                        {modalTaskErrorMessage}
                    </span>

                    <div className="w-full flex flex-row justify-center space-x-6 mt-8 place-self-end">
                        <button
                            onClick={addTask}
                            className="active:scale-90 transition-all duration-100 w-32 h-12 rounded-3xl bg-green2 text-white font-medium p-2">
                            {t("pages.zonePage.create")}
                        </button>

                        <button
                            onClick={() => setModalAddTaskOpened(false)}
                            className="active:scale-90 transition-all duration-100 w-32 h-12 rounded-3xl bg-red/80 text-white font-medium p-2">
                            {t("pages.zonePage.cancel")}
                        </button>
                    </div>
                </Modal>
            </>
        );
};

export default ZonePage;
