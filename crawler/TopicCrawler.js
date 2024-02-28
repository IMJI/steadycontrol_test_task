import { load } from "cheerio";
import DateStringParser from "./DateStringParser.js";

class TopicCrawler {
    htmlPage = null;
    constructor(htmlPage) {
        this.htmlPage = htmlPage;
    }
    parseTopic() {
        const $ = load(this.htmlPage);
        const topic = $("tbody.row1").first().html();
        return {
            name: $(".maintitle>#topic-title").text(),
            author: $(topic).find("p.nick.nick-author").text(),
            createdAt: DateStringParser.toDate($(topic).find(".post-time>span>a").text()),
            description: this._findTopicDescription($, topic),
            magnetLink: $("a.med.magnet-link").prop("href"),
            torrentLink: `https://rutracker.org/forum/${$(".dl-stub.dl-link.dl-topic").prop("href")}`,
            thanks: $("#thx-list").find("a>b").map(function() {
                let d = $(this).find("i").text().replace(/\((.*)\)/g, "$1");
                return {
                    name: $(this).html().replace(/<u>.*<\/u>(.*)<i>.*<\/i>/g, "$1").replace(" ", ""),
                    date: DateStringParser.toDate(d)
                }
            }).get()
        }
    }

    _findTopicDescription($, element) {
        const descSpan = $(element)
            .find(".post_body")
            .html()
            .match(/.*<span class="post-b">Описание<\/span>: ([^<]*).*/g);
        return descSpan ? descSpan[0].replace(/.*<span class="post-b">Описание<\/span>: ([^<]*).*/gm, "$1") : "";            
    }
}

export default TopicCrawler;