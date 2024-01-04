# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class HeroItem(scrapy.Item):
    name = scrapy.Field()
    biography = scrapy.Field()
    identity = scrapy.Field()
    description = scrapy.Field()
    complexity = scrapy.Field()
    attack_type = scrapy.Field()
    primary_attribute = scrapy.Field()
    roles = scrapy.Field()
    abilities = scrapy.Field()
    talents = scrapy.Field()


class ItemItem(scrapy.Item):
    name = scrapy.Field()
    lore = scrapy.Field()
    type = scrapy.Field()
    classification = scrapy.Field()
    stats = scrapy.Field()
    abilities = scrapy.Field()
    prices = scrapy.Field()
    components = scrapy.Field()


class HeroMetaInfoItem(scrapy.Item):
    name = scrapy.Field()
    percentages = scrapy.Field()


class ItemMetaInfoItem(scrapy.Item):
    name = scrapy.Field()
    uses = scrapy.Field()
    percentages = scrapy.Field()
