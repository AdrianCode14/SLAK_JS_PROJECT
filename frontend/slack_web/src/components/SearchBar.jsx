import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ OnSearchHandler }, ref) => {
    const { t } = useTranslation();
    const inputReference = ref ? ref : useRef();

    const OnKeyPress = (e) => {
        if (e.key === "Enter") {
            OnSearchHandler(inputReference.current.value);
            e.preventDefault();
        }
    };

    return (
        <>
            <input
                type="text"
                className="bg-bg_gray w-full h-12 focus:outline-none rounded-2xl ps-5 pe-10
                                            text-xl text-gray2 
                                            shadow-[inset_-5px_-5px_4px_0px_rgba(255,255,255,.5),inset_5px_5px_4px_0px_rgba(70,70,70,.12)]"
                autoFocus={true}
                onKeyDown={(e) => OnKeyPress(e)}
                ref={inputReference}
                placeholder={t("components.searchbar.placeholder")}
            />
            <FaSearch className="text-xl text-gray2 relative -top-9 -left-4" />
        </>
    );
};

export default React.forwardRef(SearchBar);
