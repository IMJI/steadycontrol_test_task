import { load } from "cheerio";

class ForumCrawler {
    htmlPage = null;
    constructor(htmlPage) {
        this.htmlPage = htmlPage;
    }

    parseForum() {
        const topics = [];
        const $ = load(this.htmlPage);
        const topicElements = $(".hl-tr").get();
        for (let topic of topicElements) {
            if (($(topic).find("td:nth-child(3)").html().length > 1)) {
                let topicTitle = $(topic).find("td:nth-child(2)>.torTopic>.torTopic.bold.tt-text");
                topics.push({
                    name: topicTitle.text(),
                    url: `https://rutracker.org/forum/${topicTitle.prop("href")}`
                });
            }
        }
        return topics;
    }
}

export default ForumCrawler;