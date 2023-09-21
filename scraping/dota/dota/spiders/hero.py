import scrapy
import re
from dota.items import HeroItem

class HeroSpider(scrapy.Spider):
  name = "hero"
  allowed_domains = ["dota2.fandom.com"]
  
  def start_requests(self):
    url = "https://dota2.fandom.com/wiki/Heroes"
    yield scrapy.Request(url)

  def parse(self, response):
    hero_pages = self.get_hero_pages(response)
    for hero in hero_pages:
      hero_item = HeroItem()
      hero_path = self.get_hero_path(hero)
      hero_url = 'https://dota2.fandom.com' + hero_path
      hero_meta = {'hero_item': hero_item}
      yield response.follow(hero_url, callback=self.get_hero_data, meta=hero_meta)
      
  def get_hero_data(self, response):
    hero_item = response.meta['hero_item']
    
    name = self.get_hero_name(response)
    hero_item['name'] = name
    
    abilities = self.get_abilities(response)
    hero_item['abilities'] = abilities
    
    descriptor = self.get_descriptor(response)
    hero_item['descriptor'] = descriptor
    
    description = self.get_description(response)
    description = self.clean_description(description, hero_item['name'])
    
    hero_item['description'] = description
    yield hero_item
    
  def get_hero_pages(self, response):
    return response.xpath('//table/tbody/tr/td/div/div/a')
    
  def get_hero_path(self, hero):
    return hero.xpath("./@href").get()
  
  def get_hero_name(self, response):
    return response.xpath('//div[@id="heroBio"]/div[1]/span/text()').get()
  
  def get_abilities(self, response):
    hero_abilities = []
    
    abilities = response.xpath('//div[@class="ability-background"]/div/div/span')
    for ability in abilities:
      ability_name = self.get_ability_name(ability)
      hero_abilities.append(ability_name)
    return hero_abilities
  
  def get_ability_name(self, ability):
    return ability.xpath('./text()').get()
  
  def get_descriptor(self, response):
    return response.xpath('//table[@class="infobox"]/following-sibling::table/tbody/tr[2]/td[1]/text()').get().strip()
  
  def get_description(self, response):
    return response.xpath('//table[@class="infobox"]/following-sibling::table/tbody/tr[3]/td[1]').get()
  
  def clean_description(self, description, hero_name):
    description.replace('"', "`")
    
    description_matches= []
    
    description_matches= re.findall("(<a(.*?)>(.*?)</a>)", description)
    for i in range(len(description_matches)):
      description = description.replace(description_matches[i][0], description_matches[i][-1])
      
    description_matches = re.findall("(<span(.*?)>(.*?)</span>)", description)
    for i in range(len(description_matches)):
      description = description.replace(description_matches[i][0], description_matches[i][-1])
      
    if hero_name == 'Alchemist':
      description_matches = re.findall("(<img(.*?)> )", description)
      for i in range(len(description_matches)):
        description = description.replace(description_matches[i][0], '').strip()
    elif hero_name in ['Invoker', 'Keeper of the Light', 'Lion']:
      description_matches = re.findall("(<span(.*?)>(.*?)</span>)", description)
      for i in range(len(description_matches)):
        description = description.replace(description_matches[i][0], description_matches[i][-1])
      description = description.replace('<br>', ' ')
      
    description = description[16:-5].strip()
    return description