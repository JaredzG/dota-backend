import scrapy
import json
import os
from lotus.items import ItemMetaInfoItem


class ItemMetaSpider(scrapy.Spider):
    name = "item-meta"
    allowed_domains = ["www.dotabuff.com"]
    start_urls = ["https://www.dotabuff.com/items"]

    def parse(self, response):
        print(os.getcwd())
        no_container_file_path = "../../../data/items.json"
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
            item_name = row_values[0]
            if item_name in item_names or row_values[0] in [
                "Boots of Travel",
                "Boots of Travel 2",
                "Dagon",
                "Dagon (level 2)",
                "Dagon (level 3)",
                "Dagon (level 4)",
                "Dagon (level 5)",
            ]:
                if item_name in ["Boots of Travel"]:
                    item_meta["name"] = "Boots of Travel (Level 1)"
                elif item_name in ["Boots of Travel 2"]:
                    item_meta["name"] = "Boots of Travel (Level 2)"
                elif item_name in ["Dagon"]:
                    item_meta["name"] = "Dagon (Level 1)"
                elif item_name in ["Dagon (level 2)"]:
                    item_meta["name"] = "Dagon (Level 2)"
                elif item_name in ["Dagon (level 3)"]:
                    item_meta["name"] = "Dagon (Level 3)"
                elif item_name in ["Dagon (level 4)"]:
                    item_meta["name"] = "Dagon (Level 4)"
                elif item_name in ["Dagon (level 5)"]:
                    item_meta["name"] = "Dagon (Level 5)"
                else:
                    item_meta["name"] = item_name
                item_meta["uses"] = row_values[1]
                item_meta["percentages"] = row_values[2:]
                yield item_meta
