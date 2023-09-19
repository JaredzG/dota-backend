# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class HeroItem(scrapy.Item):
    name = scrapy.Field()
    abilities = scrapy.Field()
    descriptor = scrapy.Field()
    description = scrapy.Field()
    pass
