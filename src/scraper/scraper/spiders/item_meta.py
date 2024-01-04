import scrapy
import json
import os
from scraper.items import ItemMetaInfoItem


class ItemMetaSpider(scrapy.Spider):
    name = "item-meta"
    allowed_domains = ["www.dotabuff.com"]
    start_urls = ["https://www.dotabuff.com/items"]

    def parse(self, response):
        no_container_file_path = "../../../temp/data/items.json"
        container_file_path = "../../data/items.json"
        items_data = None
        if os.path.exists(no_container_file_path):
            with open(no_container_file_path, "r") as items_file:
                items_data = json.load(items_file)
        elif os.path.exists(container_file_path):
            with open(container_file_path, "r") as items_file:
                items_data = json.load(items_file)
        else:
            print("Items file does not exist.")
        item_names = [item["name"] for item in items_data]
        item_rows = response.xpath("//tbody/tr")
        for row in item_rows:
            item_meta = ItemMetaInfoItem()
            row_values = row.xpath("td[position()>0]/@data-value").getall()
            if row_values[0] in item_names:
                item_meta["name"] = row_values[0]
                item_meta["uses"] = row_values[1]
                item_meta["percentages"] = row_values[2:]
                yield item_meta
