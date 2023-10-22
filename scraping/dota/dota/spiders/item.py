import scrapy
import re
from dota.items import ItemItem


'''
Item Information:
- Name
- Price
- Type (Shop/Neutral)
- Classification (Category/Tier)
- Stats
- Passive
- Active
- Components
'''
class ItemSpider(scrapy.Spider):
    name = "item"
    allowed_domains = ["dota2.fandom.com"]
    start_urls = ["https://dota2.fandom.com/wiki/Items", "https://dota2.fandom.com/wiki/Neutral_Items"]

    def parse(self, response):
        url = response.url
        match url:
            case "https://dota2.fandom.com/wiki/Items":
                item = ItemItem()
                type = "Purchasable"
                categories = self.get_item_categories(response)
                category_item_lists = self.get_category_item_lists(response)
                for i in range(len(category_item_lists)):
                    classification = categories[i]
                    if classification == "Boss Rewards" or classification == "Collectibles":
                        type = "Non-Purchasable"
                    category_items = self.get_category_items(category_item_lists[i])
                    for j in range(len(category_items)):
                        item_url = "https://dota2.fandom.com" + category_items[j]
                        item_meta = {
                            "item": item,
                            "type": type,
                            "classification": classification,
                        }
                        yield response.follow(item_url, callback=self.get_item_data, meta=item_meta)
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
                        yield response.follow(item_url, callback=self.get_item_data, meta=item_meta)
                
    def get_item_data(self, response):
        item = response.meta["item"]
        
        name = self.get_item_name(response)
        item["name"] = name
        
        type = response.meta["type"]
        item["type"] = type
        
        classification = response.meta["classification"]
        item["classification"] = classification
        
        stats = self.get_item_stats(response)
        item["stats"] = stats
        
        abilities = self.get_abilities(response)
        item["abilities"] = abilities
        
        price = self.get_item_price(response, type)
        item["price"] = price
        
        components = self.get_components(response)
        item["components"] = components
        yield item
        
    def get_item_categories(self, response):
        categories = response.xpath('//h3[position()!=12 and position()<15]/span/@id').getall()
        for i in range(len(categories)):
            category = categories[i]
            if category == "Boss_Rewards":
                category = "Boss Rewards"
            elif category == "Collectible_Items":
                category = "Collectibles"
            categories[i] = category
        return categories
    
    def get_category_item_lists(self, response):
        return response.xpath('//div[@class="itemlist"][position()<14]')
    
    def get_category_items(self, category):
        return category.xpath('./div/a[position() mod 2 = 0]/@href').getall()
    
    def get_item_tiers(self, response):
        return response.xpath('//h3[position()>1 and position()<7]/span/text()').getall()
    
    def get_tier_item_lists(self, response):
        return response.xpath('//div[@class="itemlist"][position()<6]')
    
    def get_tier_items(self, tier):
        return tier.xpath('./div/a[position() mod 2 = 0]/@href').getall()

    def get_item_name(self, response):
        return response.xpath('//span[@class="mw-page-title-main"]/text()').get()
    
    def get_item_stats(self, response):
        stats = response.xpath('string(//table[@class="infobox"][1]//tr[th/span[contains(text(), "Bonus")]])').get().strip().split("+")[1:]
        stats = stats if stats else "None"
        if len(stats) >= 2:
            first_stat = stats[0]
            second_stat = stats[1]
            if "\n" in first_stat:
                new_first_stat = first_stat[0:first_stat.index("\n")]
                stats[0] = new_first_stat
                new_second_stat = re.sub("  ", " ", second_stat)
                stats[1] = new_second_stat
                new_stats = [" or ".join(stats)]
                stats = new_stats
            elif "-" in first_stat:
                split_first_stat = re.search(r"(.*?)([-].*)", first_stat)
                new_first_stat = split_first_stat.group(1)
                new_second_stat = split_first_stat.group(2)
                new_third_stat = stats[1].replace("/min", "per minute")
                stats[0] = new_first_stat
                stats[1] = new_second_stat
                stats.append(new_third_stat)
        return stats
    
    def get_item_price(self, response, type):
        price = {}
        if type == "Purchasable":
            purchase_details = response.xpath('string(//table[@class="infobox"][1]//tr[th[contains(text(), "Cost")]])').get().strip().replace("\n\n\n\n", "+").split("+")[1]
            sell = response.xpath('string(//table[@class="infobox"][1]//tr[th/a/span[contains(text(), "Sell Value")]])').get().strip().replace("\n\n\n\n", "+").split("+")[1].replace("  / Count", " per count").replace("  ", " ").strip()
            purchase_prices = purchase_details.split("  ")
            purchase = purchase_prices[0]
            price["purchase"] = purchase
            price["sell"] = sell
        else:
            price = "None"
        return price

    def get_abilities(self, response):
            abilities = {}
            item_abilities = response.xpath('//div[@class="ability-background"]/div')
            for ability in item_abilities:
                ability_name = self.get_ability_name(ability)
                ability_features = self.get_ability_features(ability)
                ability_description = self.get_ability_description(ability)
                abilities[ability_name] = {
                    "features": ability_features,
                    "description": ability_description,
                }
            abilities = abilities if abilities else "None"
            return abilities

    def get_ability_name(self, ability):
        return ability.xpath("./div/span/text()").get().strip()
    
    def get_ability_features(self, ability):
        features = {}
        ability_features = ability.xpath("string(./div[2]/div[2]/div[1])").get().strip()
        ability_features = ability_features.replace("\xa0", "")
        ability_features = ability_features.split("\n")
        for i in range(len(ability_features)):
            feature = ability_features[i]
            feature = re.sub(r"\(.*?\)", "", feature)
            feature = feature.replace("  ", " ")
            feature = feature.strip()
            if "Ability" in feature:
                feature_value = feature[7:]
                features["Ability"] = feature_value
            elif "Affects" in feature:
                feature_value = feature[7:]
                features["Affects"] = feature_value
            elif "Damage" in feature:
                feature_value = feature[6:]
                features["Damage"] = feature_value
            ability_features[i] = feature
        return features

    def get_ability_description(self, ability):
        description = "".join(
            ability.xpath("./div[2]/div[2]/div[2]//text()").getall()
        ).strip()
        description = description.replace("\n", "")
        description = description.replace('"', "`")
        description = re.sub(r"\.([A-Z])", r". \1", description)
        return description
    
    def get_components(self, response):
        components = {}
        item_components = response.xpath('//tr[preceding-sibling::tr[1]/th[contains(text(), "Recipe")]]/th/div[last()]/div/div/a/@title').getall()
        for i in range(len(item_components)):
            component = item_components[i]
            cost = re.findall(r"\((.*?)\)", component)[0]
            component = re.sub(r" \(.*?\)", "", component)
            components[component] = cost
        components = components if components else "None"
        return components