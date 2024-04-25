import React from "react";
import colors from "../utils/colors";
import { TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import GlobalStyles from "../styles/GlobalStyles";

const TaskItem = ({ task, onTaskSelect, selectedTask }) => {
    const { t } = useTranslation();
    const [isSelected, setIsSelected] = useState(false);
    const getTimeDifferenceInDays = (start_date, deadline_date) => {
        const startDate = new Date(start_date);
        const deadlineDate = new Date(deadline_date);
        const timeDiff = deadlineDate.getTime() - startDate.getTime();
        const diffDays = timeDiff / (1000 * 3600 * 24);

        return Math.ceil(diffDays);
    };

    const deadLineTime = getTimeDifferenceInDays(
        new Date(),
        task.deadline_date
    );

    const handleTaskSelect = () => {
        setIsSelected(!isSelected);
        onTaskSelect(task);
    };

    const handleTaskInfo = (e) => {
        alert(descriptionTask);
    };

    const descriptionTask = task.description;

    return (
        <TouchableOpacity
            style={[
                GlobalStyles.capsuleContainer,
                {
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    backgroundColor:
                        selectedTask === task.id ? colors.green0 : colors.white,
                },
            ]}
            onPress={handleTaskInfo}
            onLongPress={handleTaskSelect}>
            <Text
                style={{
                    color: colors.black,
                    fontFamily: font.medium,
                    fontSize: 22,
                }}>
                {task.title}
            </Text>
            <Text
                style={{
                    color: deadLineTime <= 1 ? colors.red : colors.green0,
                    fontSize: 12,
                    marginTop: 35,
                    marginLeft: "auto",
                }}>
                {deadLineTime} {t("pages.zonePage.dayUntilDeadline")}
            </Text>
        </TouchableOpacity>
    );
};

export default TaskItem;
