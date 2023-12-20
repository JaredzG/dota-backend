import scrapy
from dota.items import HeroMetaItem


class HeroMetaSpider(scrapy.Spider):
    name = "hero-meta"
    allowed_domains = ["www.dotabuff.com"]
    start_urls = ["https://www.dotabuff.com/heroes/meta"]

    def parse(self, response):
        hero_rows = response.xpath("//tbody/tr")
        for row in hero_rows:
            hero_meta = HeroMetaItem()
            row_values = row.xpath("td[position()>0]//@data-value").getall()
            hero_meta["name"] = row_values[0]
            hero_meta["herald_guardian_crusader_pick_percentage"] = row_values[1]
            hero_meta["herald_guardian_crusader_win_percentage"] = row_values[2]
            hero_meta["archon_pick_percentage"] = row_values[3]
            hero_meta["archon_win_percentage"] = row_values[4]
            hero_meta["legend_pick_percentage"] = row_values[5]
            hero_meta["legend_win_percentage"] = row_values[6]
            hero_meta["ancient_pick_percentage"] = row_values[7]
            hero_meta["ancient_win_percentage"] = row_values[8]
            hero_meta["divine_immortal_pick_percentage"] = row_values[9]
            hero_meta["divine_immortal_win_percentage"] = row_values[10]
            yield hero_meta
