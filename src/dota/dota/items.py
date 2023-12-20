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


class HeroMetaItem(scrapy.Item):
    name = scrapy.Field()
    herald_guardian_crusader_pick_percentage = scrapy.Field()
    herald_guardian_crusader_win_percentage = scrapy.Field()
    archon_pick_percentage = scrapy.Field()
    archon_win_percentage = scrapy.Field()
    legend_pick_percentage = scrapy.Field()
    legend_win_percentage = scrapy.Field()
    ancient_pick_percentage = scrapy.Field()
    ancient_win_percentage = scrapy.Field()
    divine_immortal_pick_percentage = scrapy.Field()
    divine_immortal_win_percentage = scrapy.Field()


class ItemMetaItem(scrapy.Item):
    name = scrapy.Field()
    uses = scrapy.Field()
    use_percentage = scrapy.Field()
    win_percentage = scrapy.Field()
