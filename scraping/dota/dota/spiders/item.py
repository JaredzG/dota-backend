import scrapy


class ItemSpider(scrapy.Spider):
    name = "item"
    allowed_domains = ['dota2.fandom.com']
    start_urls = ['https://dota2.fandom.com/wiki/Items']

    def parse(self, response):
        url = response.url
        match url:
            case 'https://dota2.fandom.com/wiki/Items':
                categories = response.xpath('//h3[position()!=12 and position()<15]/span/@id').getall()
                item_lists = response.xpath('//div[@class="itemlist"][position()<14]')
                item = {}
                for i in range(len(item_lists)):
                    items = item_lists[i].xpath('./div/a[position() mod 2 = 0]/@href').getall()
                    item[f'{categories[i]}'] = items
                yield item
