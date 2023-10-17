import scrapy
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
        items = {}
        match url:
            case "https://dota2.fandom.com/wiki/Items":
                item_item = ItemItem()
                type = 'Purchasable'
                categories = response.xpath('//h3[position()!=12 and position()<15]/span/@id').getall()
                item_lists = response.xpath('//div[@class="itemlist"][position()<14]')
                for i in range(len(item_lists)):
                    classification = categories[i]
                    item_list_items = item_lists[i].xpath('./div/a[position() mod 2 = 0]/@href').getall()
                    for j in range(len(item_list_items)):
                        item_url = "https://dota2.fandom.com" + item_list_items[j]
                        item_meta = {
                            "item_item": item_item,
                            "type": type,
                            "classification": classification,
                        }
                        yield response.follow(item_url, callback=self.get_item_data, meta=item_meta)
            case "https://dota2.fandom.com/wiki/Neutral_Items":
                item_item = ItemItem()
                type = 'Neutral'
                tiers = response.xpath('//h3[position()>1 and position()<7]/span/text()').getall()
                item_lists = response.xpath('//div[@class="itemlist"][position()<6]')
                for i in range(len(item_lists)):
                    classification = tiers[i]
                    item_list_items = item_lists[i].xpath('./div/a[position() mod 2 = 0]/@href').getall()
                    for j in range(len(item_list_items)):
                        item_url = "https://dota2.fandom.com" + item_list_items[j]
                        item_meta = {
                            "item_item": item_item,
                            "type": type,
                            "classification": classification,
                        }
                        yield response.follow(item_url, callback=self.get_item_data, meta=item_meta)
                
    def get_item_data(self, response):
        item_item = response.meta["item_item"]
        type = response.meta["type"]
        classification = response.meta["classification"]
        
        name = self.get_item_name(response)
        item_item["name"] = name
        
        item_item["type"] = type
        
        item_item["classification"] = classification
        yield item_item
        
    def get_item_name(self, response):
        return response.xpath('//span[@class="mw-page-title-main"]/text()').get()
