const DATABASE_COOK_MENU = '259e0f30feca4788b1009673240e7689'
const DATABASE_INGREDIENT_GUIDE = '967759291f6a4c49bf84a620ad74a3ad'
const DATABASE_KITCHEN_INVENTORY = '26971d2e7d4142368f7b066387c609e0'

const { getDataBaseData } = require('./notion')

async function getAvailableMenus() {

	const inventory = await getDataBaseData(DATABASE_KITCHEN_INVENTORY, {
		filter: {
			or: [
				{
					property: 'LIVE',
					formula: {
						string: {
							does_not_contain: "过期"
						}
					}
				},
			],
		},
	});
	
	const inventoryList = inventory.map(i => i.properties.NAME.rollup.array.map(j => j.title[0].plain_text)[0]);
	
	const menu = await getDataBaseData(DATABASE_COOK_MENU)
	
	const menuList = menu.map(i => ({
		name: i.properties.NAME.title[0].plain_text,
		need: i.properties["NEED NAME"].rollup.array.map(j => j.title[0].plain_text)
	}))

	const result = menuList.reduce(
		(acc, menuItem) => {
			const missingItems = menuItem.need.filter(item => !inventoryList.includes(item));
			if (missingItems.length === 0) {
				acc.fullyAvailable.push(menuItem.name);
			} else {
				menuItem.need.length > 1 && acc.partiallyAvailable.push({ name: menuItem.name, missing: missingItems });
			}
			return acc;
		},
		{ fullyAvailable: [], partiallyAvailable: [] }
	);

	return [result.fullyAvailable, result.partiallyAvailable];
}

module.exports = { getAvailableMenus }


