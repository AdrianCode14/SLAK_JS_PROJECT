import { decode as atob, encode as btoa } from "base-64";

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

export function isTokenValid(token) {
    if (!token) return false;
    const decoded = parseJwt(token);
    if (decoded === null) return false;

    if (decoded.exp * 1000 < Date.now()) return false;

    return true;
}
