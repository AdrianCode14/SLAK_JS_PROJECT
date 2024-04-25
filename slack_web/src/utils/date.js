const ToUpperCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

export function parsePGDateEN(date) {
    return ToUpperCase(
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    );
}

export function parsePGDateFR(date) {
    return ToUpperCase(
        new Date(date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    );
}

export function parsePG(date) {
    return new Date(date)
        .toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
        .split("/")
        .reverse()
        .join("-");
}

export function parseDateTime(datetime) {
    const splitted = new Date(datetime).toLocaleString().split(" ");
    const date = splitted[0].split("/").reverse().join("-");

    return `${date}T${splitted[1]}`;
}
