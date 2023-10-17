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
    bio = scrapy.Field()
    roles = scrapy.Field()
    primary_attribute = scrapy.Field()

class ItemItem(scrapy.Item):
    name = scrapy.Field()
    price = scrapy.Field()
    type = scrapy.Field()
    classification = scrapy.Field()
    stats = scrapy.Field()
    passive = scrapy.Field()
    active = scrapy.Field()
    components = scrapy.Field()
