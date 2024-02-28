import axios from "axios";
import { decodeWin1251Response } from "./utils.js";

const win1251RequestOptions = {
    responseType: "arraybuffer",
    transformResponse: decodeWin1251Response
};

class Request {
    static async getForumPage(forumId, page) {
        const pageProp = page > 1 ? `&start=${(page - 1) * 50}` : "";
        return await axios.get(`https://rutracker.org/forum/viewforum.php?f=${forumId}${pageProp}`, win1251RequestOptions);
    }

    static async getMainPage() {
        return await axios.get("https://rutracker.org/forum/index.php", win1251RequestOptions);
    }
}

export default Request;