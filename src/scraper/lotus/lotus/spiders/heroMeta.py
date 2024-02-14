import scrapy
from lotus.items import HeroMetaInfoItem


class HeroMetaSpider(scrapy.Spider):
    name = "hero-meta"
    allowed_domains = ["www.dotabuff.com"]
    start_urls = ["https://www.dotabuff.com/heroes/meta"]

    def parse(self, response):
        hero_rows = response.xpath("//tbody/tr")
        for row in hero_rows:
            hero_meta = HeroMetaInfoItem()
            row_values = row.xpath("td[position()>0]//@data-value").getall()
            hero_meta["name"] = row_values[0]
            hero_meta["percentages"] = row_values[1:]
            yield hero_meta
