import scrapy
import re
from dota.items import HeroItem


class HeroSpider(scrapy.Spider):
    name = "hero"
    allowed_domains = ["dota2.fandom.com"]
    start_urls = ['https://dota2.fandom.com/wiki/Heroes']

    def parse(self, response):
        hero_table = self.get_hero_table(response)
        for primary_attribute, hero_pages in hero_table.items():
            for hero_page in hero_pages:
                hero_item = HeroItem()
                hero_url = "https://dota2.fandom.com" + hero_page
                hero_meta = {
                    "hero_item": hero_item,
                    "primary_attribute": primary_attribute,
                }
                yield response.follow(
                    hero_url, callback=self.get_hero_data, meta=hero_meta
                )

    def get_hero_data(self, response):
        hero_item = response.meta["hero_item"]
        primary_attribute = response.meta["primary_attribute"]

        name = self.get_hero_name(response)
        hero_item["name"] = name

        bio = self.get_bio(response)
        hero_item["bio"] = bio

        hero_item["primary_attribute"] = primary_attribute

        roles = self.get_roles(response)
        hero_item["roles"] = roles

        descriptor = self.get_descriptor(response)
        hero_item["descriptor"] = descriptor

        description = self.get_description(response, hero_item["name"])
        hero_item["description"] = description

        abilities = self.get_abilities(response)
        hero_item["abilities"] = abilities
        yield hero_item

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

    def get_abilities(self, response):
        hero_abilities = {}
        abilities = response.xpath('//div[@class="ability-background"]/div')
        for ability in abilities:
            ability_name = self.get_ability_name(ability)
            ability_description = self.get_ability_description(ability)
            ability_upgrades = self.get_ability_upgrades(ability)
            ability_lore = self.get_ability_lore(ability)
            hero_abilities[ability_name] = {
                "description": ability_description,
                "upgrades": ability_upgrades if ability_upgrades else "N/A",
                "lore": ability_lore if ability_lore else "N/A",
            }
        return hero_abilities

    def get_ability_name(self, ability):
        return ability.xpath("./div/span/text()").get().strip()

    def get_ability_description(self, ability):
        description = "".join(
            ability.xpath("./div[2]/div[2]/div[2]//text()").getall()
        ).strip()
        description = description.replace("\n", "")
        description = description.replace('"', "`")
        description = re.sub(r"\.([A-Z])", r". \1", description)
        return description
    
    def get_ability_upgrades(self, ability):
        upgrades = {}
        aghs_upgrades = ability.xpath('string(.//div[(count(div)=4 and div[1]//div[contains(text(), "Aghanim")] and div[3]//div[contains(text(), "Aghanim")]) or (count(div)=2 and div[1]//div[contains(text(), "Aghanim")])])').get().strip().split('\n')
        aghs_upgrades = list(filter(lambda item: item != '', aghs_upgrades))
        for i in range(0, len(aghs_upgrades), 2):
            if 'Scepter' in aghs_upgrades[i]:
                upgrades["Aghanim's Scepter"] = aghs_upgrades[i + 1]
            elif 'Shard' in aghs_upgrades[i]:
                upgrades["Aghanim's Shard"] = aghs_upgrades[i + 1]
        return upgrades

    def get_ability_lore(self, ability):
        lore = ability.xpath('./div[3]/div[@class="ability-lore"]/div/i/text()').get()
        return lore

    def get_descriptor(self, response):
        return (
            response.xpath(
                '//table[@class="infobox"]/following-sibling::table/tbody/tr[2]/td[1]/text()'
            )
            .get()
            .strip()
        )

    def get_description(self, response, hero_name):
        description = response.xpath(
            '//table[@class="infobox"]/following-sibling::table[1]/tbody/tr[3]/td[1]'
        )
        description = description.xpath("string(.)").get().strip()
        description = description.replace('"', "`")
        description = re.sub(r"\.([A-Z])", r". \1", description)
        return description

    def get_bio(self, response):
        bio = " ".join(
            response.xpath('//div[@id="heroBio"]/div[3]/div[1]/div[2]/text()').getall()
        )
        bio = bio.replace('"', "`")
        bio = bio.replace("\n", " ")
        return bio

    def get_roles(self, response):
        return response.xpath(
            '//th[text()="Roles:\n"]/following-sibling::td/a[@title="Role"]/text()'
        ).getall()
