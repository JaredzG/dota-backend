import scrapy
from lotus.items import ItemItem


class ItemSpider(scrapy.Spider):
    name = "item"
    allowed_domains = ["dota2.fandom.com"]
    start_urls = [
        "https://dota2.fandom.com/wiki/Items",
        "https://dota2.fandom.com/wiki/Neutral_Items",
    ]

    def parse(self, response):
        url = response.url
        match url:
            case "https://dota2.fandom.com/wiki/Items":
                item = ItemItem()
                categories = self.get_item_categories(response)
                category_item_lists = self.get_category_item_lists(response)
                for i in range(len(category_item_lists)):
                    type = "Basic" if i < 5 else "Upgrade"
                    classification = categories[i]
                    category_items = self.get_category_items(category_item_lists[i])
                    if classification in ["Consumables"]:
                        category_items.append("/wiki/Observer_and_Sentry_Wards")
                    elif classification in ["Miscellaneous"]:
                        category_items.append("/wiki/Void_Stone")
                    elif classification in ["Accessories"]:
                        category_items.append("/wiki/Boots_of_Travel_2")
                    elif classification in ["Magical"]:
                        category_items.extend(
                            [
                                "/wiki/Dagon_2",
                                "/wiki/Dagon_3",
                                "/wiki/Dagon_4",
                                "/wiki/Dagon_5",
                            ]
                        )
                    for j in range(len(category_items)):
                        item_url = "https://dota2.fandom.com" + category_items[j]
                        item_meta = {
                            "item": item,
                            "type": type,
                            "classification": classification,
                        }
                        yield response.follow(
                            item_url, callback=self.get_item_data, meta=item_meta
                        )
            case "https://dota2.fandom.com/wiki/Neutral_Items":
                item = ItemItem()
                type = "Neutral"
                tiers = self.get_item_tiers(response)
                tier_item_lists = self.get_tier_item_lists(response)
                for i in range(len(tier_item_lists)):
                    classification = tiers[i]
                    tier_items = self.get_tier_items(tier_item_lists[i])
                    for j in range(len(tier_items)):
                        item_url = "https://dota2.fandom.com" + tier_items[j]
                        item_meta = {
                            "item": item,
                            "type": type,
                            "classification": classification,
                        }
                        yield response.follow(
                            item_url, callback=self.get_item_data, meta=item_meta
                        )

    def get_item_data(self, response):
        item = response.meta["item"]
        item["name"] = self.get_item_name(response)
        item["lore"] = self.get_item_lore(response)
        item["type"] = response.meta["type"]
        item["classification"] = response.meta["classification"]
        item["stats"] = self.get_item_stats(response)
        item["abilities"] = self.get_item_abilities(response)
        item["prices"] = self.get_item_prices(response, response.meta["type"])
        item["component_tree"] = self.get_item_component_tree(response, item["name"])
        yield item

    def get_item_categories(self, response):
        return response.xpath("//h3[position()<12]/span/@id").getall()

    def get_category_item_lists(self, response):
        return response.xpath('//div[@class="itemlist"][position()<12]')

    def get_category_items(self, category):
        return category.xpath("./div/a[position() mod 2 = 0]/@href").getall()

    def get_item_tiers(self, response):
        return response.xpath(
            "//h3[position()>1 and position()<7]/span/text()"
        ).getall()

    def get_tier_item_lists(self, response):
        return response.xpath('//div[@class="itemlist"][position()<6]')

    def get_tier_items(self, tier):
        return tier.xpath("./div/a[position() mod 2 = 0]/@href").getall()

    def get_item_name(self, response):
        return response.xpath('//span[@class="mw-page-title-main"]/text()').get()

    def get_item_lore(self, response):
        return response.xpath(
            'string(//table[@class="infobox"][1]/tbody[count(tr)>2]/tr[position()=count(../tr)-1])'
        ).get()

    def get_item_stats(self, response):
        return response.xpath(
            'string(//table[@class="infobox"][1]//tr[th/span[contains(text(), "Bonus")]])'
        ).get()

    def get_item_abilities(self, response):
        item_abilities = response.xpath('//div[@class="ability-background"]/div')
        if item_abilities:
            abilities = []
            for ability in item_abilities:
                ability_name = ability.xpath("./div/span/text()").get()
                ability_features = ability.xpath("string(./div[2]/div[2]/div[1])").get()
                ability_description = ability.xpath(
                    "./div[2]/div[2]/div[2]//text()"
                ).getall()
                abilities.append(
                    {
                        "name": ability_name,
                        "features": ability_features,
                        "description": ability_description,
                    }
                )
            return abilities
        else:
            return "None"

    def get_item_prices(self, response, type):
        if type == "Basic" or type == "Upgrade":
            prices = []
            purchase_amount = response.xpath(
                'string(//table[@class="infobox"][1]//tr[th[contains(text(), "Cost")]])'
            ).get()
            refund_amount = response.xpath(
                'string(//table[@class="infobox"][1]//tr[th/a/span[contains(text(), "Sell Value")]])'
            ).get()
            prices.append({"type": "Purchase", "amount": purchase_amount})
            prices.append({"type": "Refund", "amount": refund_amount})
            return prices
        else:
            return "None"

    def get_item_component_tree(self, response, name):
        component_containers = response.xpath(
            "//tr[preceding-sibling::tr[1]/th[contains(text(), 'Recipe')]]/th/div"
        )
        component_levels = [
            container.xpath(".//@title").getall() for container in component_containers
        ]
        component_tree = None
        if len(component_levels) == 3:
            component_tree = {
                "buildup": component_levels[0],
                "base": component_levels[2],
            }
        elif len(component_levels) == 2:
            if name in component_levels[0][0]:
                component_tree = {"buildup": None, "base": component_levels[1]}
            else:
                component_tree = {"buildup": component_levels[0], "base": None}
        return component_tree if component_tree else "None"
