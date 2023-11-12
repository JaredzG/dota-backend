import scrapy
import re
from dota.items import HeroItem


class HeroSpider(scrapy.Spider):
    name = "hero"
    allowed_domains = ["dota2.fandom.com"]
    start_urls = ["https://dota2.fandom.com/wiki/Heroes"]

    def parse(self, response):
        hero_table = self.get_hero_table(response)
        for primary_attribute, hero_pages in hero_table.items():
            for hero_page in hero_pages:
                hero = HeroItem()
                hero_url = "https://dota2.fandom.com" + hero_page
                hero_meta = {
                    "hero": hero,
                    "primary_attribute": primary_attribute,
                }
                yield response.follow(
                    hero_url, callback=self.get_hero_data, meta=hero_meta
                )

    def get_hero_data(self, response):
        hero = response.meta["hero"]

        name = self.get_hero_name(response)
        hero["name"] = name

        bio = self.get_hero_bio(response)
        hero["bio"] = bio

        descriptor = self.get_hero_descriptor(response)
        hero["descriptor"] = descriptor

        description = self.get_hero_description(response)
        hero["description"] = description

        primary_attribute = response.meta["primary_attribute"]
        hero["primary_attribute"] = primary_attribute

        roles = self.get_hero_roles(response)
        hero["roles"] = roles

        abilities = self.get_hero_abilities(response)
        hero["abilities"] = abilities

        talents = self.get_hero_talents(response)
        hero["talents"] = talents
        yield hero

    def get_hero_table(self, response):
        rows = response.xpath("//table/tbody/tr")
        table = {}
        for i in range(0, len(rows), 2):
            primary_attribute = self.get_primary_attribute(rows[i])
            hero_pages = self.get_hero_pages(rows[i + 1])
            table[primary_attribute] = hero_pages
        return table

    def get_primary_attribute(self, response):
        return response.xpath("./th/span/a[2]/text()").get()

    def get_hero_pages(self, response):
        return response.xpath("./td/div/div/a/@href").getall()

    def get_hero_name(self, response):
        return response.xpath('//div[@id="heroBio"]/div[1]/span/text()').get()

    def get_hero_abilities(self, response):
        abilities = {}
        hero_abilities = response.xpath('//div[@class="ability-background"]/div')
        for ability in hero_abilities:
            ability_name = ability.xpath("./div/span/text()").get()

            ability_features = ability.xpath("string(./div[2]/div[2]/div[1])").get()

            ability_description = ability.xpath(
                "./div[2]/div[2]/div[2]//text()"
            ).getall()

            ability_upgrades = ability.xpath(
                'string(.//div[(count(div)=4 and div[1]//div[contains(text(), "Aghanim")] and div[3]//div[contains(text(), "Aghanim")]) or (count(div)=2 and div[1]//div[contains(text(), "Aghanim")])])'
            ).get()

            ability_lore = ability.xpath(
                './div[3]/div[@class="ability-lore"]/div/i/text()'
            ).get()

            abilities[ability_name] = {
                "features": ability_features,
                "description": ability_description,
                "upgrades": ability_upgrades if ability_upgrades else "None",
                "lore": ability_lore if ability_lore else "None",
            }
        return abilities

    def get_hero_descriptor(self, response):
        return response.xpath(
            '//table[@class="infobox"]/following-sibling::table/tbody/tr[2]/td[1]/text()'
        ).get()

    def get_hero_description(self, response):
        return response.xpath(
            'string(//table[@class="infobox"]/following-sibling::table[1]/tbody/tr[3]/td[1])'
        ).get()

    def get_hero_bio(self, response):
        return response.xpath(
            '//div[@id="heroBio"]/div[3]/div[1]/div[2]/text()'
        ).getall()

    def get_hero_roles(self, response):
        return response.xpath(
            '//th[text()="Roles:\n"]/following-sibling::td/a[@title="Role"]/text()'
        ).getall()

    def get_hero_talents(self, response):
        talents = {}
        levels = ["Expert", "Advanced", "Intermediate", "Novice"]
        talents_list = response.xpath(
            '(//table[@class="wikitable"]/tbody[tr[1]/th/a/span[contains(text(), "Hero Talents")]])[1]/tr[position()>1]'
        )
        for i in range(len(talents_list) - 1, -1, -1):
            talent = talents_list[i]
            left = talent.xpath("string(td[1])").get()
            right = talent.xpath("string(td[2])").get()
            talents[levels[i]] = {
                "left": left,
                "right": right,
            }
        return talents
