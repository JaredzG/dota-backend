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
                tiers = response.xpath('//h3[position()>1 and position()<7]/span/text()').getall()
                tier_item_lists = response.xpath('//div[@class="itemlist"][position()<6]')
                for i in range(len(tier_item_lists)):
                    classification = tiers[i]
                    tier_items = tier_item_lists[i].xpath('./div/a[position() mod 2 = 0]/@href').getall()
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
        type = response.meta["type"]
        classification = response.meta["classification"]
        
        name = self.get_item_name(response)
        item["name"] = name
        
        item["type"] = type
        
        item["classification"] = classification
        
        stats = self.get_item_stats(response)
        item["stats"] = stats
        yield item
        
    def get_item_name(self, response):
        return response.xpath('//span[@class="mw-page-title-main"]/text()').get()
    
    def get_item_stats(self, response):
        stats = response.xpath('string(//table[@class="infobox"][1]//tr[th/span[contains(text(), "Bonus")]])').get().strip().split("+")[1:]
        stats = stats if stats else "N/A"
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
        return stats
    
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
