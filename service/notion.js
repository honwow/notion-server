
const { Client } = require("@notionhq/client");

const notion = new Client({
	auth: 'secret_Tgf33BmBQKUFbjBSI46AE35cTscljHBoO9M97WsZyb6'
});

async function getDataBaseData(database_id, options) {
	const response = await notion.databases.query({
		database_id,
		...options,
	});
	return response.results;
}

module.exports = { getDataBaseData }