/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    variants: {
        extend: {
            opacity: ["group-hover"],
        },
    },
    safelist: ["animate-[fade-in_1s_ease-in-out]"],
    theme: {
        borderRadius: {
            none: "0px",
            sm: "0.125rem",
            normal: "0.25rem",
            md: "0.375rem",
            lg: "0.5rem",
            xl: "0.75rem",
            "2xl": "1rem",
            "3xl": "1.5rem",
            "4xl": "2rem",
            "5xl": "2.5rem",
        },
        letterSpacing: {
            tightest: "-.075em",
            tighter: "-.05em",
            tight: "-.025em",
            normal: "0",
            wide: ".025em",
            wider: ".05em",
            widest: ".1em",
            widest: ".25em",
            logo: "1rem",
        },
        fontFamily: {
            sans: ["Montserrat"],
        },
        colors: {
            green1: "#009A61",
            green2: "#3AAF5C",
            green3: "#7AC357",
            green4: "#B6D752",
            greenShadow: "#31A95D",

            bg_gray: "#EEEEEE",
            gray0: "#C2C2C2",
            gray1: "#343434",
            gray2: "#626262",

            red: "#FF3333",
            red2: "#B83535",
            white: "#FFFFFF",
            black: "#000000",

            highlight_green: "#CFECE1",
            highlight_red: "#F5BABA",
        },
        extend: {},
    },
    plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
