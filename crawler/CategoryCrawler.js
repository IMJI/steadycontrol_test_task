import { load } from "cheerio";

class CategoryCrawler {
    htmlPage = null;
    constructor(htmlPage) {
        this.htmlPage = htmlPage;
    }

    parseCategories() {
        const $ = load(this.htmlPage);
        const crawler = this;
        const data = $(".category").map(function() {
            return crawler._getCategories(crawler, $, this);
        }).get();
        return data;
    }

    _getCategories(crawler, $, element) {
        return {
			name: $(element).children("h3").text(),
			link: `https://rutracker.org/forum/${$(element).find("h3 > a").prop("href")}`,
			children: $(element).find("td.row1:not(.f-icon-idx)").map(function() {
				return crawler._getForums(crawler, $, this);
			}).get()
        }
	}
      
	_getForums(crawler, $, element) {
		return {
			name: $(element).find("h4.forumlink").text(),
			link: `https://rutracker.org/forum/${$(element).find("h4 > a").prop("href")}`,
			children: $(element).find(".sf_title > a").map(function() {
				return crawler._getSubforums($, this);
			}).get()
		}
	}
      
	_getSubforums($, element) {
		return {
			name: $(element).text(),
			link: `https://rutracker.org/forum/${$(element).prop("href")}`,
			children: []
		}
	}
}

export default CategoryCrawler;