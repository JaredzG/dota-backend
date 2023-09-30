import scrapy


class ItemSpider(scrapy.Spider):
    name = "item"
    allowed_domains = ['dota2.fandom.com']
    start_urls = ['https://dota2.fandom.com/wiki/Items', 'https://dota2.fandom.com/wiki/Neutral_Items']

    def parse(self, response):
        url = response.url
        items = {}
        match url:
            case 'https://dota2.fandom.com/wiki/Items':
                item_type = 'Buyable'
                categories = response.xpath('//h3[position()!=12 and position()<15]/span/@id').getall()
                item_lists = response.xpath('//div[@class="itemlist"][position()<14]')
                item = {}
                for i in range(len(item_lists)):
                    item_list_items = item_lists[i].xpath('./div/a[position() mod 2 = 0]/@href').getall()
                    item[f'{categories[i]}'] = item_list_items
                items[item_type] = item
                yield items
            case 'https://dota2.fandom.com/wiki/Neutral_Items':
                pass
