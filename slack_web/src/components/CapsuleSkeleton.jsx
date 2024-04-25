import React from "react";

import Card from "../components/Card";

const CapsuleSkeletton = ({ count }) => {
    return (
        <>
            {[...Array(count ?? 3)].map((e, i) => (
                <Card
                    key={i}
                    className="animate-pulse flex flex-wrap w-full bg-white mb-12 h-16 justify-end items-start">
                    <div className="justify-self-start bg-gray2 mr-auto w-32 h-4 rounded-lg opacity-50"></div>
                    <div className="justify-self-end bg-gray2 w-32 h-4 rounded-lg opacity-50"></div>
                    <div className="w-full h-4 flex justify-end">
                        <div className="w-4 h-4 bg-gray2 opacity-50 rounded-lg "></div>
                    </div>
                </Card>
            ))}
        </>
    );
};

export default CapsuleSkeletton;
