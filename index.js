import ForumCategory from "./models/ForumCategory.js";
import Database from "./Database.js";
import Request from "./Request.js";
import CategoryCrawler from "./crawler/CategoryCrawler.js";
import TopicCrawler from "./crawler/TopicCrawler.js";
import ForumTopic from "./models/ForumTopic.js";
import Browser from "./Browser.js";
import ForumCrawler from "./crawler/ForumCrawler.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function recursiveInsertData(data) {
	const insertedIds = [];
	await data.forEach(async element => {
		if (element.children.length > 0) {
			await recursiveInsertData(element.children);
		}
		const result = await ForumCategory.collection.insertOne(element);
		insertedIds.push(result.insertedId);
	});
	return insertedIds;
}

async function getData() {
	try{
		const response = await Request.getMainPage();
		const crawler = new CategoryCrawler(response.data);
		const data = crawler.parseCategories();
		return data;
	}
	catch(e)
	{
		console.log(e);
	}
}

async function getTopicLinks() {
	try{
		let data = [];
		let page = 1;
		while (data.length < 100) {
			console.log(`Загрузка тем с ${page} страницы`);
			const response = await Request.getForumPage(54, page);
			const crawler = new ForumCrawler(response.data);
			data = [...data, ...crawler.parseForum()];
			console.log(`Всего найдено тем: ${data.length}`);
			page++;
		}
		return data;
	}
	catch(e) {
		console.log(e);
	}
}

function parsePage(html) {
	const crawler = new TopicCrawler(html);
	const topic = crawler.parseTopic();
	return topic;
}

async function crawlCategories() {
	console.log("Получение данных о форумах");
	const data = await getData();
	await recursiveInsertData(data);
	console.log("Данные о форумах записаны");
}

async function crawlTopics() {
	console.log("Получение данных о темах");
	const topics = await getTopicLinks();
	console.log("Начало сбора данных о темах");
	const browser = new Browser();
	await browser.init();
	await browser.auth();
	for (let topic of topics) {
		console.log(`Получение данных о теме ${topic.name}`);
		try {
			const html = await browser.loadHtmlFromUrl(topic.url);
			const topicItem = parsePage(html);
			await ForumTopic.collection.insertOne(topicItem);
		} catch (e) {
			console.log(e);
			continue;
		}
		console.log(`Данные о теме ${topic.name} собраны`);
	}
}

async function main() {
	try {
		await Database.connect();
		await crawlCategories();
		await crawlTopics();
	}catch(err) {
		console.log("Возникла ошибка");
		console.log(err);
	} finally {
		await Database.disconnect();
	}
}

main().catch(console.error);