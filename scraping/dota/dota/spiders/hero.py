import scrapy


class HeroSpider(scrapy.Spider):
    name = "hero"
    allowed_domains = ["dota2.fandom.com"]
    start_urls = ["https://dota2.fandom.com/wiki/Heroes"]

    def parse(self, response):
        pass
