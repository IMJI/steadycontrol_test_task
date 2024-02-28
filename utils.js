import iconv from "iconv-lite";

export function decodeWin1251Response(data) {
    data = iconv.decode(data, "win1251");
    return data;
}