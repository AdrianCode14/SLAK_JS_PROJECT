import React, { useEffect, useRef, useState } from "react";

import Container from "../Container";
import Card from "../Card";
import Modal from "../Modal";
import InputField from "../InputField";
import { BiSolidErrorAlt } from "react-icons/bi";
import axiosRetry from "axios-retry";
import axios from "axios";
import { twMerge } from "tailwind-merge";
import { parsePGDateEN, parsePG, parseDateTime } from "../../utils/date";

import { FaTrash } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../Pagination";
import ScrollView from "../ScrollView";
import { useTranslation } from "react-i18next";
import getApiUrl from "../../utils/url";
import SearchBar from "../SearchBar";

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

const AdminLayout = ({ descriptor }) => {
    const minCellWidth = 30;
    const paginationRow = 5;
    const [currentTab, setCurrentTab] = useState(0);
    const [rows, setRows] = useState(undefined);
    const [selection, setSelection] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const tableElement = useRef(null);
    const [errorMessage, setErrorMessage] = useState("");
    const optionColumnWidth = 100;
    const [currentPage, setCurrentPage] = useState(1);
    const [entries, setEntries] = useState(undefined);
    const [modalData, setModalData] = useState({
        opened: false,
        errorMessage: "",
        saveFunction: () => {},
        type: "",
        row: {},
    });
    const searchFieldRef = useRef();
    const navigate = useNavigate();

    const { t } = useTranslation();

    for (let tab = 0; tab < descriptor.length; tab++) {
        for (let col of descriptor[tab].columns) {
            if (!("hidden" in col)) col.ref = useRef();

            if ("id" in col && !("required" in col)) continue;

            col.fieldRef = useRef();
        }
    }

    const removeSelectionIfPresent = (id) => {
        if (selection.includes(id)) {
            setSelection(selection.filter((e) => e !== id));
            return true;
        }
        return false;
    };

    const addNewSelection = (id) => {
        setSelection([...selection, id]);
    };

    const getIDFromRow = (row, columns) => {
        let ids = {};

        for (let col of columns) {
            if ("id" in col) {
                ids[col.name] = row[col.name];
            }
        }

        return ids;
    };

    const getIDStringFromRow = (row, columns) => {
        let ids = "";

        for (let col of columns) {
            if ("id" in col) {
                ids += row[col.name];
            }
        }

        return ids;
    };

    const getIdsFromSelection = () => {
        let toDeletePayload = [];
        for (let select of selection) {
            toDeletePayload.push(
                getIDFromRow(rows[select], descriptor[currentTab].columns)
            );
        }
        return toDeletePayload;
    };

    const deleteSelection = (event) => {
        const payload = getIdsFromSelection();
        deleteRows(payload);
    };

    const deleteRows = async (payload) => {
        if (payload.length === 0) return;

        await axios
            .delete(getApiUrl(`/v1/${descriptor[currentTab].route}`), {
                data: payload,
            })
            .then((response) => {
                //update table
                toast("Deleted !", { type: "success" });
                resetTab();
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigate("/");
                    toast(t("components.notification.timed-out"), {
                        type: "error",
                    });
                } else if (reason.response.status === 401) {
                    toast("you're not logged in", { type: "error" });
                    navigate("/login");
                } else if (reason.response.status === 403) {
                    toast(reason.response.data, { type: "error" });
                } else {
                    toast("An error happened", { type: "error" });
                }
            });
    };

    //---------------------------Columns Resizing-----------------------------

    const mouseMove = (e) => {
        const visibleColumns = descriptor[currentTab].columns.filter(
            (col) => !("hidden" in col)
        );
        let gridColumns = visibleColumns.map((col, i) => {
            if (i === activeIndex) {
                const width = e.clientX - col.ref.current.offsetLeft;

                if (width >= minCellWidth) {
                    let difference = col.ref.current.offsetWidth - width;
                    if (i < visibleColumns.length) {
                        const neighborRef = visibleColumns[i + 1].ref;

                        if (
                            neighborRef.current.offsetWidth + difference <=
                            minCellWidth
                        ) {
                            const rest =
                                neighborRef.current.offsetWidth +
                                difference -
                                minCellWidth;
                            neighborRef.calculatedWidth =
                                neighborRef.current.offsetWidth +
                                difference -
                                rest;
                            difference = rest;
                        } else {
                            neighborRef.calculatedWidth =
                                neighborRef.current.offsetWidth + difference;
                            difference = 0;
                        }
                    }
                    return width + difference;
                }
            }

            if (col.ref.calculatedWidth) {
                const retVal = col.ref.calculatedWidth;
                delete col.ref.calculatedWidth;
                return retVal;
            }

            // Otherwise return the previous width (no changes)
            return col.ref.current.offsetWidth;
        });

        gridColumns.push(`${optionColumnWidth}px`);

        // Assign the px values to the table
        tableElement.current.style.gridTemplateColumns = `${gridColumns.join(
            "px "
        )}`;
    };

    const removeListeners = () => {
        window.removeEventListener("mousemove", mouseMove);
        //window.removeEventListener('touchmove', mouseMove);
        window.removeEventListener("mouseup", removeListeners);
    };

    const mouseUp = () => {
        setActiveIndex(null);
        removeListeners();
    };

    const mouseDown = (index) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        if (activeIndex !== null) {
            window.addEventListener("mousemove", mouseMove);
            window.addEventListener("mouseup", mouseUp);
        }

        return () => {
            removeListeners();
        };
    }, [activeIndex, mouseMove, mouseUp, removeListeners]);

    //--------------------------------Table resizing------------------------------------

    useEffect(() => {
        window.addEventListener("resize", onResize);
    }, [currentTab]);

    const onResize = () => {
        resetTableGridColumns();
    };

    const resetTableGridColumns = () => {
        if (tableElement.current) {
            let tableWidth = tableElement.current.offsetWidth;
            const visibleColumns = descriptor[currentTab].columns.filter(
                (col) => !("hidden" in col)
            );
            const colCount = visibleColumns.length;
            tableWidth -= optionColumnWidth;
            let array = [];
            for (let i = 0; i < colCount; i++) {
                array.push(tableWidth / colCount);
            }
            array.push(`${optionColumnWidth}px`);

            tableElement.current.style.gridTemplateColumns = `${array.join(
                "px "
            )}`;
        }
    };

    //----------------------------Admin Core----------------------------------

    const resetTab = async () => {
        setRows(undefined);
        setEntries(0);

        const route = descriptor[currentTab].route;
        await fetchCount(route).then(() => {
            if (currentPage === 1) {
                fetchRows(route);
                setSelection([]);
            } else setCurrentPage(1);
        });
    };

    useEffect(() => {
        if (searchFieldRef.current) {
            searchFieldRef.current.value = "";
        }
        resetTab();
    }, [currentTab]);

    useEffect(() => {
        setSelection([]);
        fetchRows(descriptor[currentTab].route);
    }, [currentPage]);

    useEffect(() => {
        resetTableGridColumns();
    }, [rows]);

    const fetchCount = async (route) => {
        if (searchFieldRef.current?.value) {
            await axios
                .post(getApiUrl(`/v1/${route}/count-search`), {
                    query: searchFieldRef.current.value,
                })
                .then((response) => {
                    setEntries(response.data);
                })
                .catch((reason) => {
                    setRows([]);
                    setErrorMessage(
                        `Error ${reason.response.status} with message: ${reason.response.statusText}`
                    );
                });
        } else {
            await axios
                .get(getApiUrl(`/v1/${route}/count`))
                .then((response) => {
                    setEntries(response.data);
                })
                .catch((reason) => {
                    setRows([]);
                    setErrorMessage(
                        `Error ${reason.response.status} with message: ${reason.response.statusText}`
                    );
                });
        }
    };

    const fetchRows = async (route) => {
        if (searchFieldRef.current?.value) {
            await axios
                .post(getApiUrl(`/v1/${route}/page-search/${currentPage}`), {
                    query: searchFieldRef.current.value,
                })
                .then((response) => {
                    setRows(response.data);
                })
                .catch((reason) => {
                    setRows([]);
                    setErrorMessage(
                        `Error ${reason.response.status} with message: ${reason.response.statusText}`
                    );
                });
        } else {
            await axios
                .get(getApiUrl(`/v1/${route}/page/${currentPage}`))
                .then((response) => {
                    setRows(response.data);
                })
                .catch((reason) => {
                    setRows([]);
                    setErrorMessage(
                        `Error ${reason.response.status} with message: ${reason.response.statusText}`
                    );
                });
        }
    };

    const onSearch = async (query) => {
        setSelection([]);
        const route = descriptor[currentTab].route;
        fetchCount(route);

        if (currentPage === 1) fetchRows(route);
        else setCurrentPage(1);
    };

    const renderTabs = () => {
        return descriptor.map((tab, index) => {
            if (tab.name) {
                if (index === currentTab)
                    return (
                        <span
                            key={tab.name}
                            className="text-xl font-bold text-green3 w-full cursor-pointer select-none">
                            {tab.name}
                        </span>
                    );
                else
                    return (
                        <span
                            key={tab.name}
                            className="text-xl text-gray1 w-full hover:font-medium cursor-pointer select-none"
                            onClick={() => setCurrentTab(index)}>
                            {tab.name}
                        </span>
                    );
            }
        });
    };

    const renderTableHeader = () => {
        if (descriptor[currentTab].columns) {
            return descriptor[currentTab].columns.map((col, index) => {
                if ("hidden" in col) return;

                if (index === descriptor[currentTab].columns.length - 1) {
                    return (
                        <th
                            key={col.headerName}
                            ref={col.ref}
                            className="relative bg-green2 h-10 border-bg_gray border-solid border-r-2">
                            <span className="text-base font-normal text-white whitespace-nowrap text-ellipsis overflow-hidden block my-2  select-none">
                                {col.headerName}
                            </span>
                        </th>
                    );
                } else
                    return (
                        <th
                            key={col.headerName}
                            ref={col.ref}
                            className="relative bg-green2 h-10 first:rounded-tl-md border-bg_gray border-solid border-r-2">
                            <span className="text-base font-normal text-white whitespace-nowrap text-ellipsis overflow-hidden block my-2 select-none">
                                {col.headerName}
                            </span>
                            <div
                                className="absolute flex w-[5px] h-10 cursor-col-resize group top-0 right-0"
                                onMouseDown={() => mouseDown(index)}>
                                <div className="group-active:bg-gray1 group-hover:bg-gray2 w-[3px] ms-auto rounded-5xl"></div>
                            </div>
                        </th>
                    );
            });
        }
        return <span>No Columns</span>;
    };

    const renderTableRows = () => {
        const onRowClick = (rowIndex) => {
            if (!removeSelectionIfPresent(rowIndex)) addNewSelection(rowIndex);
        };

        const onClickEditRow = (event, rowIndex) => {
            event.stopPropagation();
            openModal("Edit", onEdit, rows[rowIndex]);
        };

        const onClickDeleteRow = (event, rowIndex) => {
            event.stopPropagation();
            removeSelectionIfPresent(rowIndex);

            const id = [
                getIDFromRow(rows[rowIndex], descriptor[currentTab].columns),
            ];
            deleteRows(id);
        };

        if (rows !== undefined && Array.isArray(rows) && rows.length > 0) {
            return rows.map((row, rowIndex) => {
                return (
                    <tr
                        className="contents group select-none"
                        key={rowIndex}
                        onClick={() => onRowClick(rowIndex)}>
                        {descriptor[currentTab].columns.map((col, index) => {
                            if ("hidden" in col) return;
                            return renderTableCell(row, col, index, rowIndex);
                        })}
                        <td
                            className={twMerge(
                                "transition-colors duration-100 ease-out cursor-pointer py-1 px-3 bg-white border-b-bg_gray border-b-2 whitespace-nowrap flex justify-center space-x-5 items-center",
                                selection.includes(rowIndex)
                                    ? "bg-highlight_green"
                                    : ""
                            )}>
                            <FaEdit
                                className="scale-125 fill-green3 hover:scale-150"
                                onClick={(e) => onClickEditRow(e, rowIndex)}
                            />
                            <FaTrash
                                className="scale-110 fill-gray2 hover:scale-125"
                                onClick={(e) => onClickDeleteRow(e, rowIndex)}
                            />
                        </td>
                    </tr>
                );
            });
        }
    };

    const renderTableCell = (row, column, index, rowIndex) => {
        const type = column.type;
        let data = row[column.name];

        let className =
            "overflow-hidden group-hover:font-bold transition-all duration-100 ease-out cursor-pointer text-ellipsis py-1 px-3 bg-white border-r-2 border-r-bg_gray border-b-2 border-b-bg_gray whitespace-nowrap";

        if ("id" in column && column.id) className += " text-red font-medium";
        else className += " text-gray1";

        if (selection.includes(rowIndex))
            className = twMerge(className, " bg-highlight_green");

        if (data === undefined) return;

        const idString = getIDStringFromRow(
            row,
            descriptor[currentTab].columns
        );

        switch (type) {
            case "json": {
                const beautyfullJson = JSON.stringify(data, null, 2);
                data = JSON.stringify(data);

                return (
                    <td
                        key={`${idString}-${index}`}
                        className={className}
                        title={beautyfullJson}>
                        {data}
                    </td>
                );
            }
            case "datetime":
            case "date": {
                data = parsePGDateEN(data);
                return (
                    <td
                        key={`${idString}-${index}`}
                        className={className}
                        title={data}>
                        {data}
                    </td>
                );
            }
            case "boolean": {
                return (
                    <td
                        key={`${idString}-${index}`}
                        className={className + " justify-center flex"}
                        title={data.toString()}>
                        <input
                            type="checkbox"
                            className="group-hover:scale-110 appearance-none w-5 h-5 rounded-normal bg-gray0 checked:bg-green3 peer border-bg_gray border-[1px] checked:border-0 pointer-events-none"
                            defaultChecked={data}
                        />
                        <svg
                            className="absolute w-4 h-4 mt-[3px] hidden peer-checked:block text-white pointer-events-none"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </td>
                );
            }
            default:
                return (
                    <td
                        key={`${idString}-${index}`}
                        className={className}
                        title={data}>
                        {data}
                    </td>
                );
        }
    };

    const onCreate = async (payload) => {
        if (!payload) return;

        await axios
            .post(getApiUrl(`/v1/${descriptor[currentTab].route}`), payload)
            .then((response) => {
                toast(response.data, { type: "success" });
                closeModal();
                resetTab();
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigate("/");
                    toast(t("components.notification.timed-out"), {
                        type: "error",
                    });
                } else if (reason.response.status === 401) {
                    toast("you're not logged in", { type: "error" });
                    navigate("/login");
                } else if (
                    reason.response.status === 403 ||
                    reason.response.status === 409 ||
                    reason.response.status === 400
                ) {
                    toast(reason.response.data, { type: "error" });
                } else {
                    toast("An error happened", { type: "error" });
                }
            });
    };

    const onEdit = async (payload) => {
        if (!payload) return;

        await axios
            .patch(getApiUrl(`/v1/${descriptor[currentTab].route}`), payload)
            .then((response) => {
                toast(response.data, { type: "success" });
                closeModal();
                resetTab();
            })
            .catch((reason) => {
                if (reason.code === "ERR_NETWORK") {
                    navigate("/");
                    toast(t("components.notification.timed-out"), {
                        type: "error",
                    });
                } else if (reason.response.status === 401) {
                    toast("you're not logged in", { type: "error" });
                    navigate("/login");
                } else if (
                    reason.response.status === 403 ||
                    reason.response.status === 400
                ) {
                    toast(reason.response.data, { type: "error" });
                } else {
                    toast("An error happened", { type: "error" });
                }
            });
    };

    const createModalFields = (mode, tabDescriptor, row) => {
        const hasDefaultValues = row !== undefined;

        return tabDescriptor.columns.map((col) => {
            if ("id" in col && !("required" in col)) return;
            if ("hidden" in col && mode === "Edit") return;
            if ("readonly" in col && !("required" in col)) return;
            else if ("readonly" in col && "required" in col && mode === "Edit")
                return;
            if ("autogenerated" in col && mode === "New") return;

            return createModalField(
                mode,
                col,
                col.type,
                col.name,
                col.headerName,
                col.fieldRef,
                hasDefaultValues ? row[col.name] : undefined
            );
        });
    };

    const renderStringField = (
        mode,
        col,
        id,
        headerName,
        ref,
        defaultValue
    ) => {
        const isReadOnly = "id" in col && mode === "Edit";

        if ("selection" in col) {
            //render selection list
            return (
                <div
                    key={headerName}
                    className="flex flex-col space-y-3 w-full items-center">
                    <label htmlFor={id}>{headerName}</label>
                    <select
                        ref={ref}
                        name={headerName}
                        id={id}
                        className="bg-bg_gray w-3/5 h-12 focus:outline-none rounded-2xl px-5
                                text-xl text-gray2 
                                shadow-[inset_-5px_-5px_4px_0px_rgba(255,255,255,.5),inset_5px_5px_4px_0px_rgba(70,70,70,.12)]">
                        {col.selection.map((value) => {
                            return (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            );
                        })}
                    </select>
                </div>
            );
        }

        return (
            <div
                key={headerName}
                className="flex flex-col space-y-3 w-full items-center">
                <label htmlFor={id}>{headerName}</label>
                {isReadOnly && (
                    <InputField
                        id={id}
                        defaultValue={defaultValue}
                        ref={ref}
                        className="w-3/5 pointer-events-none border-4 border-highlight_red"
                    />
                )}
                {!isReadOnly && (
                    <InputField
                        id={id}
                        defaultValue={defaultValue}
                        ref={ref}
                        className="w-3/5"
                    />
                )}
            </div>
        );
    };

    const renderAddressField = (col, id, headerName, ref, defaultValue) => {
        return (
            <div
                key={headerName}
                className="flex flex-col space-y-3 w-full items-center">
                <label htmlFor={id}>{headerName}</label>
                <textarea
                    ref={ref}
                    defaultValue={defaultValue?.replaceAll("#", "\n")}
                    className="resize-none bg-bg_gray focus:outline-none rounded-2xl px-5 py-3 text-xl text-gray2 shadow-[inset_-5px_-5px_4px_0px_rgba(255,255,255,.5),inset_5px_5px_4px_0px_rgba(70,70,70,.12)] w-3/5 h-28"></textarea>
            </div>
        );
    };

    const renderJsonField = (col, id, headerName, ref, defaultValue) => {
        return (
            <div
                key={headerName}
                className="flex flex-col space-y-3 w-full items-center">
                <label htmlFor={id}>{headerName}</label>
                <textarea
                    ref={ref}
                    defaultValue={JSON.stringify(defaultValue, null, 2)}
                    className="resize-none bg-bg_gray focus:outline-none rounded-2xl px-5 py-3 text-xl text-gray2 shadow-[inset_-5px_-5px_4px_0px_rgba(255,255,255,.5),inset_5px_5px_4px_0px_rgba(70,70,70,.12)] w-3/5 h-96 scrollbar-thumb-gray0 scrollbar-track-bg_gray scrollbar-thin scrollbar-thumb-rounded-5xl"></textarea>
            </div>
        );
    };

    const renderDateField = (col, id, headerName, ref, defaultValue) => {
        const localDate = parsePG(defaultValue);

        return (
            <div
                key={headerName}
                className="flex flex-col space-y-3 w-full items-center">
                <label htmlFor={id}>{headerName}</label>
                <InputField
                    id={id}
                    defaultValue={localDate}
                    ref={ref}
                    type="date"
                    className="w-3/5"
                />
            </div>
        );
    };

    const renderDateTimeField = (col, id, headerName, ref, defaultValue) => {
        const localDate = parseDateTime(defaultValue);

        return (
            <div
                key={headerName}
                className="flex flex-col space-y-3 w-full items-center">
                <label htmlFor={id}>{headerName}</label>
                <InputField
                    id={id}
                    defaultValue={localDate}
                    ref={ref}
                    type="datetime-local"
                    className="w-3/5"
                />
            </div>
        );
    };

    const renderNumberField = (
        mode,
        col,
        id,
        headerName,
        ref,
        defaultValue
    ) => {
        const isReadOnly = "id" in col && mode === "Edit";

        return (
            <div
                key={headerName}
                className="flex flex-col space-y-3 w-full items-center">
                <label htmlFor={id}>{headerName}</label>
                {isReadOnly && (
                    <InputField
                        readOnly={isReadOnly}
                        id={id}
                        defaultValue={defaultValue}
                        key={id}
                        ref={ref}
                        type="number"
                        className="w-3/5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pointer-events-none border-4 border-highlight_red"
                    />
                )}
                {!isReadOnly && (
                    <InputField
                        readOnly={isReadOnly}
                        id={id}
                        defaultValue={defaultValue}
                        key={id}
                        ref={ref}
                        type="number"
                        className="w-3/5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                )}
            </div>
        );
    };

    const createModalField = (
        mode,
        col,
        type,
        id,
        headerName,
        ref,
        defaultValue
    ) => {
        switch (type) {
            case "string":
                return renderStringField(
                    mode,
                    col,
                    id,
                    headerName,
                    ref,
                    defaultValue
                );
            case "number":
                return renderNumberField(
                    mode,
                    col,
                    id,
                    headerName,
                    ref,
                    defaultValue
                );
            case "json":
                return renderJsonField(col, id, headerName, ref, defaultValue);
            case "date":
                return renderDateField(col, id, headerName, ref, defaultValue);
            case "datetime":
                return renderDateTimeField(
                    col,
                    id,
                    headerName,
                    ref,
                    defaultValue
                );
            case "boolean":
                return (
                    <div
                        key={headerName}
                        className="flex flex-row flex-wrap space-x-3 w-full justify-center my-7">
                        <label htmlFor={id}>{headerName}</label>
                        <div className="flex relative justify-center">
                            <input
                                id={id}
                                type="checkbox"
                                className="group-hover:scale-110 appearance-none w-5 h-5 rounded-normal bg-gray0 checked:bg-green3 peer border-bg_gray border-[1px] checked:border-0"
                                defaultChecked={defaultValue}
                                ref={ref}
                            />
                            <svg
                                className="absolute w-4 h-4 mt-[3px] hidden peer-checked:block text-white pointer-events-none"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                );
            case "address":
                return renderAddressField(
                    col,
                    id,
                    headerName,
                    ref,
                    defaultValue
                );
            default:
                return <>{type} not implemented yet</>;
        }
    };

    const parseFieldValue = (type, input) => {
        switch (type) {
            case "json":
            case "string":
                return input.value;
            case "number":
                return parseInt(input.value);
            case "datetime":
            case "date":
                return input.value
                    ? new Date(input.value).toISOString()
                    : undefined;
            case "boolean":
                return input.checked;
            case "address":
                return input.value?.replaceAll("\n", "#");
            default:
                return undefined;
        }
    };

    const isEmptyOrInvalid = (type, value) => {
        if (type === "json") {
            try {
                const parsed = JSON.parse(value);
                return false;
            } catch (exception) {
                //In case or error it is invalid
                return true;
            }
        }
        switch (type) {
            case "address":
            case "string":
                return value === "";
            case "number":
                return isNaN(value);
            case "datetime":
            case "date":
                return value === undefined;
            case "boolean":
                return false;
            default:
                return false;
        }
    };

    const checkAndPackFields = () => {
        const tabDescriptor = descriptor[currentTab];
        let data = {};
        const mode = modalData.type;

        for (let col of tabDescriptor.columns) {
            //If id are auto generated don't need to get it from refs
            if ("id" in col && !("required" in col)) {
                if (mode === "Edit")
                    //If we are in edit mode we need the id tho
                    data[col.name] = modalData.row[col.name];

                continue;
            }
            if ("hidden" in col && mode === "Edit") continue;
            if ("readonly" in col && !("required" in col)) continue;
            else if ("readonly" in col && "required" in col && mode === "Edit")
                continue;
            if ("autogenerated" in col && mode === "New") continue;

            data[col.name] = parseFieldValue(col.type, col.fieldRef.current);
        }

        for (let col of tabDescriptor.columns) {
            if ("id" in col && !("required" in col))
                //Don't need to check auto generated values
                continue;
            if ("hidden" in col && mode === "Edit") continue;
            if ("readonly" in col && !("required" in col)) continue;
            else if ("readonly" in col && "required" in col && mode === "Edit")
                continue;
            if ("autogenerated" in col && mode === "New") continue;

            if (
                !("optional" in col) &&
                isEmptyOrInvalid(col.type, data[col.name])
            ) {
                setModalErrorMessage(
                    `Property '${col.headerName}' was invalid or empty`
                );
                return;
            }

            if ("checks" in col) {
                //Do special checks
                const checks = col.checks;

                for (let check of checks) {
                    switch (check.type) {
                        case "regex": {
                            if (col.type !== "string") break; //Don't need to go further regex can't be without strings values

                            const regExp = new RegExp(
                                check.regex,
                                check.scope ?? ""
                            );
                            if (!regExp.test(data[col.name])) {
                                setModalErrorMessage(check.error_msg);
                                return;
                            }
                            continue;
                        }
                        case "greater": {
                            let arg0;
                            let arg1;
                            if (col.type === "number") {
                                arg0 =
                                    check.arg0.type === "litteral"
                                        ? check.arg0.value
                                        : data[check.arg0.name];
                                arg1 =
                                    check.arg1.type === "litteral"
                                        ? check.arg1.value
                                        : data[check.arg1.name];
                            } else if (col.type === "datetime") {
                                arg0 = new Date(
                                    check.arg0.type === "litteral"
                                        ? check.arg0.value
                                        : data[check.arg0.name]
                                );
                                arg1 = new Date(
                                    check.arg1.type === "litteral"
                                        ? check.arg1.value
                                        : data[check.arg1.name]
                                );
                            } else break;

                            if (arg0 <= arg1) {
                                setModalErrorMessage(check.error_msg);
                                return;
                            }

                            continue;
                        }

                        case "greaterEq": {
                            if (col.type === "number") {
                                const arg0 =
                                    check.arg0.type === "litteral"
                                        ? check.arg0.value
                                        : data[check.arg0.name];
                                const arg1 =
                                    check.arg1.type === "litteral"
                                        ? check.arg1.value
                                        : data[check.arg1.name];

                                if (arg0 < arg1) {
                                    setModalErrorMessage(check.error_msg);
                                    return;
                                }
                            } else break;

                            continue;
                        }
                    }
                }
            }
        }

        setModalErrorMessage("");

        if (modalData.saveFunction) modalData.saveFunction(data);
    };

    const openModal = (type, saveFunction, row) => {
        setModalData({
            opened: true,
            errorMessage: "",
            saveFunction: saveFunction,
            type: type,
            row: row,
        });
    };

    const closeModal = () => {
        setModalData({
            opened: false,
            errorMessage: "",
            saveFunction: () => {},
            type: "",
            row: {},
        });
    };

    const setModalErrorMessage = (msg) => {
        setModalData((oldModalData) => {
            return {
                opened: oldModalData.opened,
                errorMessage: msg,
                saveFunction: oldModalData.saveFunction,
                type: oldModalData.type,
                row: oldModalData.row,
            };
        });
    };

    if (descriptor === undefined) {
        return (
            <div className="flex flex-col flex-wrap justify-start w-screen h-screen bg-bg_gray overflow-hidden outline-none relative">
                <nav className="w-full top-0 bg-green2 h-28 flex justify-center items-center rounded-b-3xl shadow-[0_4px_4px_2px_rgba(0,0,0,.25)] absolute z-10">
                    <span className="text-5xl font-extrabold text-white tracking-logo">
                        SLAK
                    </span>
                </nav>
                <div className="flex flex-wrap flex-row justify-center w-1/5 h-full bg-bg_gray shadow-[15px_0_8px_0px_rgba(255,255,255,.5)] pt-28 px-6">
                    <section className="h-fit max-h-[400px] w-full mt-40">
                        <div className="h-60 flex flex-row justify-center">
                            <span className="text-red font-semibold text-lg text-center max-lg:text-base">
                                Error loading tabs
                            </span>
                        </div>
                    </section>

                    <div className="mt-auto mb-12 w-10/12 bg-bg_gray h-12 shadow-[-8px_-8px_15px_0px_rgba(255,255,255,.5),8px_8px_10px_0px_rgba(70,70,70,.12)] rounded-5xl"></div>
                </div>

                <div className="w-4/5 h-[calc(100%-7rem)] mt-28 pb-24 pt-14 px-14 ">
                    <Container className="w-full h-full flex flex-row items-center">
                        <div className="w-full flex flex-row justify-center items-center">
                            <Card className="w-4/6 mx-auto flex flex-row flex-wrap h-[300px] pb-6">
                                <div className="w-1/4 flex flex-row flex-wrap items-center border-r-2 border-highlight_red justify-center pe-8">
                                    <BiSolidErrorAlt className="fill-[#ff3333df] scale-150 text-9xl" />
                                </div>
                                <div className="w-3/4 px-8 flex flex-col justify-around items-center">
                                    <span className="w-full text-center font-black text-gray1 max-lg:text-lg text-2xl">
                                        Descriptor cannot be empty
                                    </span>
                                </div>
                            </Card>
                        </div>
                    </Container>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-wrap justify-start w-screen h-screen bg-bg_gray overflow-hidden outline-none relative">
            <nav className="w-full top-0 bg-green2 h-28 flex justify-center items-center rounded-b-3xl shadow-[0_4px_4px_2px_rgba(0,0,0,.25)] absolute z-10">
                <span
                    className="block text-5xl font-extrabold text-white tracking-logo cursor-pointer"
                    onClick={() => navigate("/")}>
                    SLAK
                </span>
            </nav>
            <div className="flex flex-wrap flex-row justify-center w-1/5 h-full bg-bg_gray shadow-[15px_0_8px_0px_rgba(255,255,255,.5)] pt-28 px-6">
                <section className="flex flex-row flex-wrap h-fit max-h-[400px] w-full mt-40 px-3">
                    {renderTabs()}
                </section>

                <div className="flex justify-center items-center mt-auto mb-12 w-10/12 bg-bg_gray h-12 shadow-[-8px_-8px_15px_0px_rgba(255,255,255,.5),8px_8px_10px_0px_rgba(70,70,70,.12)] rounded-5xl">
                    Backend
                    <span className="text-green1 font-bold"> V1</span>
                </div>
            </div>

            <div className="w-4/5 h-[calc(100%-7rem)] mt-28 pb-32 pt-10 px-14">
                <div className="flex items-center flex-wrap flex-row-reverse w-full">
                    <SearchBar
                        ref={searchFieldRef}
                        OnSearchHandler={onSearch}
                    />
                </div>
                <Container className="w-full h-[90%] flex flex-col overflow-hidden">
                    {!rows && (
                        <div className="flex justify-center items-center w-full h-full outline-none">
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
                    )}

                    <table
                        className={twMerge(
                            "table-fixed w-full grid",
                            !rows ? "invisible" : ""
                        )}
                        ref={tableElement}>
                        <thead className="contents">
                            <tr className="contents select-none">
                                {renderTableHeader()}
                                <th className="bg-green2 h-10 rounded-tr-md">
                                    <span className="text-base font-normal text-white whitespace-nowrap text-ellipsis overflow-hidden block my-2">
                                        Options
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="contents">
                            {rows && !rows.length == 0 && renderTableRows()}
                        </tbody>
                    </table>

                    {rows && rows.length == 0 && (
                        <div className="flex justify-center items-center w-full h-full outline-none z-20">
                            <span className="text-red font-semibold text-xl">
                                {errorMessage ? errorMessage : "Empty"}
                            </span>
                        </div>
                    )}
                </Container>
                {entries && (
                    <Pagination
                        className={twMerge(
                            "mt-8 scale-125",
                            !rows ? "invisible" : ""
                        )}
                        currentPageState={[currentPage, setCurrentPage]}
                        rows={paginationRow}
                        itemCount={entries}
                    />
                )}

                <span
                    className={twMerge(
                        "mt-2 text-gray1 font-light",
                        !rows ? "invisible" : ""
                    )}>
                    {entries} entries found
                </span>

                <button
                    onClick={deleteSelection}
                    className="h-16 aspect-square flex items-center justify-center active:scale-90 transition-all duration-100 z-20 absolute bottom-8 right-36 bg-white rounded-[100rem] shadow-[0_4px_8px_2px_rgba(0,0,0,.25)]">
                    <FaTrashAlt className="fill-red scale-[1.5]" />
                </button>
                <button
                    onClick={() => openModal("New", onCreate)}
                    className="h-16 aspect-square flex items-center justify-center active:scale-90 transition-all duration-100 z-20 absolute bottom-8 right-14 bg-white rounded-[100rem] shadow-[0_4px_8px_2px_rgba(0,0,0,.25)]">
                    <FaPlus className="fill-gray1 scale-[1.5]" />
                </button>
            </div>

            <Modal
                className="w-[680px] aspect-square flex-col flex-wrap"
                showModal={modalData.opened}
                onCloseRequested={() => closeModal()}>
                <div className="h-16 w-ful flex items-center justify-center font-bold text-3xl text-gray1">
                    {modalData.type} {descriptor[currentTab].name}
                </div>

                <div className="h-[444px] w-full">
                    <ScrollView className="w-full flex flex-col space-y-5 mt-8">
                        {createModalFields(
                            modalData.type,
                            descriptor[currentTab],
                            modalData.row
                        )}
                    </ScrollView>
                </div>

                <div className="h-48 w-full flex flex-row flex-wrap justify-center items-center">
                    <span className="w-full text-center text-red font-medium">
                        {modalData.errorMessage}
                    </span>
                    <button
                        onClick={() => checkAndPackFields()}
                        className="active:scale-90 transition-all duration-100 w-40 h-16 rounded-5xl bg-green2 text-white font-medium text-lg p-2">
                        Save
                    </button>

                    <button
                        onClick={() => closeModal()}
                        className=" ml-12 active:scale-90 transition-all duration-100 w-40 h-16 rounded-5xl bg-red/80 text-white font-medium text-lg p-2">
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminLayout;
