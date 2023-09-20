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
    for hero in response.xpath('//table/tbody/tr/td/div/div/a'):
      hero_item = HeroItem()
      hero_item['name'] = hero.xpath('./@title').get()
      yield response.follow(f'https://dota2.fandom.com{hero.xpath("./@href").get()}', callback=self.get_hero_data, meta={'hero_item': hero_item})
      
  def get_hero_data(self, response):
    hero_item = response.meta['hero_item']
    hero_item['abilities'] = []
    for ability in response.xpath('//div[@class="ability-background"]/div/div/span'):
        hero_item['abilities'].append(ability.xpath('./text()').get())
    descriptor = response.xpath('//table[@class="infobox"]/following-sibling::table/tbody/tr[2]/td[1]/text()').get()
    hero_item['descriptor'] = descriptor.strip()
    description = response.xpath('//table[@class="infobox"]/following-sibling::table/tbody/tr[3]/td[1]').get()
    description = description.replace('"', "`")
    matches = []
    matches = re.findall("(<a(.*?)>(.*?)</a>)", description)
    for i in range(len(matches)):
      description = description.replace(matches[i][0], matches[i][-1])
    matches = re.findall("(<span(.*?)>(.*?)</span>)", description)
    for i in range(len(matches)):
      description = description.replace(matches[i][0], matches[i][-1])
    if hero_item['name'] == 'Alchemist':
      matches = re.findall("(<img(.*?)> )", description)
      for i in range(len(matches)):
        description = description.replace(matches[i][0], '').strip()
    elif hero_item['name'] in ['Invoker', 'Keeper of the Light', 'Lion']:
      matches = re.findall("(<span(.*?)>(.*?)</span>)", description)
      for i in range(len(matches)):
        description = description.replace(matches[i][0], matches[i][-1])
      description = description.replace('<br>', ' ')
    hero_item['description'] = description[16:-5].strip()
    yield hero_item
