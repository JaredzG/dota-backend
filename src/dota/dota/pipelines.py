# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from scrapy.exceptions import DropItem
from dota.items import HeroItem, ItemItem
import re


class HeroBioPipeline:
    def process_item(self, item, spider):
        if isinstance(item, HeroItem):
            adapter = ItemAdapter(item)
            if adapter.get("bio"):
                adapter["bio"] = (
                    " ".join(adapter["bio"])
                    .replace('"', "`")
                    .replace("\n", " ")
                    .replace("’", "'")
                )
                return item
            else:
                raise DropItem(f"Missing bio in {item}")
        else:
            return item


class HeroIdentityPipeline:
    def process_item(self, item, spider):
        if isinstance(item, HeroItem):
            adapter = ItemAdapter(item)
            if adapter.get("identity"):
                adapter["identity"] = adapter["identity"].strip()
                return item
            else:
                raise DropItem(f"Missing identity in {item}")
        else:
            return item


class HeroDescriptionPipeline:
    def process_item(self, item, spider):
        if isinstance(item, HeroItem):
            adapter = ItemAdapter(item)
            if adapter.get("description"):
                adapter["description"] = re.sub(
                    r"\.([A-Z])",
                    r". \1",
                    adapter["description"].strip().replace('"', "`"),
                )
                return item
            else:
                raise DropItem(f"Missing description in {item}")
        else:
            return item


class HeroAbilitiesPipeline:
    def process_item(self, item, spider):
        if isinstance(item, HeroItem):
            adapter = ItemAdapter(item)
            if adapter.get("abilities"):
                abilities = []
                old_abilities = adapter["abilities"]
                for ability in old_abilities:
                    old_name = ability["name"]
                    old_features = ability["features"]
                    old_description = ability["description"]
                    old_upgrades = ability["upgrades"]
                    new_name = old_name.strip()
                    new_features = self.get_ability_features(old_features)
                    new_description = self.get_ability_description(old_description)
                    new_upgrades = self.get_ability_upgrades(old_upgrades)
                    new_lore = ability["lore"].replace("‘", "'").replace("’", "'")
                    abilities.append(
                        {
                            "name": new_name,
                            "features": new_features,
                            "description": new_description,
                            "upgrades": new_upgrades,
                            "lore": new_lore,
                        }
                    )
                adapter["abilities"] = abilities
                return item
            else:
                raise DropItem(f"Missing abilities in {item}")
        else:
            return item

    def get_ability_features(self, old_features):
        features = {}
        features_list = ["ability_type", "affected_target", "damage_type"]
        new_features = old_features.strip().replace("\xa0", "").split("\n")
        for feature in new_features:
            feature = re.sub(r"\(.*?\)", "", feature).replace("  ", " ").strip()
            if "Ability" in feature:
                feature_value = feature[7:]
                features["ability_type"] = feature_value
            elif "Affects" in feature:
                feature_value = feature[7:]
                features["affected_target"] = feature_value
            elif "Damage" in feature:
                feature_value = feature[6:]
                features["damage_type"] = feature_value
        for feature in features_list:
            if feature not in features:
                features[feature] = "None"
        return features

    def get_ability_description(self, old_description):
        description = re.sub(
            r"\.([A-Z])",
            r". \1",
            "".join(old_description)
            .strip()
            .replace("\n", "")
            .replace('"', "`")
            .replace("/ ", "/")
            .replace(" /", "/")
            .replace("/", " / "),
        )
        return description

    def get_ability_upgrades(self, old_upgrades):
        if old_upgrades != "None":
            upgrades = []
            aghs_upgrades = list(
                filter(lambda item: item != "", old_upgrades.strip().split("\n"))
            )
            for i in range(0, len(aghs_upgrades), 2):
                if "Scepter" in aghs_upgrades[i]:
                    upgrades.append(
                        {
                            "type": "Aghanim's Scepter",
                            "description": aghs_upgrades[i + 1]
                            .replace("/ ", "/")
                            .replace(" /", "/")
                            .replace("/", " / "),
                        }
                    )

                if "Shard" in aghs_upgrades[i]:
                    upgrades.append(
                        {
                            "type": "Aghanim's Shard",
                            "description": aghs_upgrades[i + 1]
                            .replace("/ ", "/")
                            .replace(" /", "/")
                            .replace("/", " / "),
                        }
                    )
            return upgrades
        else:
            return old_upgrades


class HeroTalentsPipeline:
    def process_item(self, item, spider):
        if isinstance(item, HeroItem):
            adapter = ItemAdapter(item)
            if adapter.get("talents"):
                talents = []
                old_talents = adapter["talents"]
                for talent in old_talents:
                    talents.append(
                        {
                            "level": talent["level"],
                            "left_route": talent["left_route"]
                            .strip()
                            .replace("  ", " ")
                            .replace("/ ", "/")
                            .replace(" /", "/")
                            .replace("/", " / "),
                            "right_route": talent["right_route"]
                            .strip()
                            .replace("  ", " ")
                            .replace("/ ", "/")
                            .replace(" /", "/")
                            .replace("/", " / "),
                        }
                    )
                adapter["talents"] = talents
                return item
            else:
                raise DropItem(f"Missing talents in {item}")
        else:
            return item


class ItemLorePipeline:
    def process_item(self, item, spider):
        if isinstance(item, ItemItem):
            adapter = ItemAdapter(item)
            if adapter.get("lore"):
                new_lore = adapter["lore"].strip()
                adapter["lore"] = new_lore if new_lore else "None"
                return item
            else:
                raise DropItem(f"Missing lore in {item}")
        else:
            return item


class ItemStatsPipeline:
    def process_item(self, item, spider):
        if isinstance(item, ItemItem):
            adapter = ItemAdapter(item)
            if adapter.get("stats"):
                old_stats = adapter["stats"].strip()
                if old_stats:
                    stats = old_stats.replace("+", ":+").split(":")[1:]
                    if len(stats) >= 2:
                        first_stat = stats[0]
                        second_stat = stats[1]
                        if "\n" in first_stat:
                            new_first_stat = first_stat[0 : first_stat.index("\n")]
                            stats[0] = new_first_stat
                            new_second_stat = re.sub("  ", " ", second_stat)
                            stats[1] = new_second_stat
                            new_stats = [" or ".join(stats)]
                            stats = new_stats
                        elif "-" in first_stat:
                            split_first_stat = re.search(r"(.*?)([-].*)", first_stat)
                            new_first_stat = split_first_stat.group(1)
                            new_second_stat = split_first_stat.group(2)
                            new_third_stat = stats[1].replace("/min", "per minute")
                            stats[0] = new_first_stat
                            stats[1] = new_second_stat
                            stats.append(new_third_stat)
                    for i in range(len(stats)):
                        stats[i] = (
                            stats[i]
                            .replace("  ", " ")
                            .replace("/ ", "/")
                            .replace(" /", "/")
                            .replace("/", " / ")
                        )
                    if not stats:
                        stats = "None"
                adapter["stats"] = stats
                return item
            else:
                raise DropItem(f"Missing stats in {item}")
        else:
            return item


class ItemAbilitiesPipeline:
    def process_item(self, item, spider):
        if isinstance(item, ItemItem):
            adapter = ItemAdapter(item)
            if adapter.get("abilities"):
                if adapter["abilities"] != "None":
                    abilities = []
                    old_abilities = adapter["abilities"]
                    for ability in old_abilities:
                        old_name = ability["name"]
                        old_features = ability["features"]
                        old_description = ability["description"]
                        new_name = old_name.strip()
                        new_features = self.get_ability_features(old_features)
                        new_description = self.get_ability_description(old_description)
                        abilities.append(
                            {
                                "name": new_name,
                                "features": new_features,
                                "description": new_description,
                            }
                        )
                    adapter["abilities"] = abilities
                return item
            else:
                raise DropItem(f"Missing abilities in {item}")
        else:
            return item

    def get_ability_features(self, old_features):
        features = {}
        features_list = ["ability_type", "affected_target", "damage_type"]
        new_features = old_features.strip().replace("\xa0", "").split("\n")
        for feature in new_features:
            feature = re.sub(r"\(.*?\)", "", feature).replace("  ", " ").strip()
            if "Ability" in feature:
                feature_value = feature[7:]
                features["ability_type"] = feature_value
            elif "Affects" in feature:
                feature_value = feature[7:]
                features["affected_target"] = feature_value
            elif "Damage" in feature:
                feature_value = feature[6:]
                features["damage_type"] = feature_value
        for feature in features_list:
            if feature not in features:
                features[feature] = "None"
        return features

    def get_ability_description(self, old_description):
        description = re.sub(
            r"\.([A-Z])",
            r". \1",
            "".join(old_description)
            .strip()
            .replace("\n", "")
            .replace('"', "`")
            .replace("/ ", "/")
            .replace(" /", "/")
            .replace("/", " / "),
        )
        return description


class ItemPricePipeline:
    def process_item(self, item, spider):
        if isinstance(item, ItemItem):
            adapter = ItemAdapter(item)
            if adapter.get("prices"):
                if adapter["prices"] != "None":
                    prices = []
                    old_prices = adapter["prices"]
                    for price in old_prices:
                        if price["type"] == "Purchase":
                            prices.append(
                                {
                                    "type": price["type"],
                                    "amount": re.sub(
                                        r"(\d+)",
                                        r"\1 Gold",
                                        price["amount"]
                                        .strip()
                                        .replace("\n\n\n\n", "+")
                                        .split("+")[1]
                                        .split("  ")[0]
                                        .replace("-", "0"),
                                    ),
                                }
                            )
                        else:
                            prices.append(
                                {
                                    "type": price["type"],
                                    "amount": re.sub(
                                        r"(\d+)",
                                        r"\1 Gold",
                                        price["amount"]
                                        .strip()
                                        .replace("\n\n\n\n", "+")
                                        .split("+")[1]
                                        .replace("  / Count", " per count")
                                        .replace("  ", " ")
                                        .strip()
                                        .replace("-", "0"),
                                    ),
                                }
                            )
                    adapter["prices"] = prices
                return item
            else:
                raise DropItem(f"Missing prices in {item}")
        else:
            return item


class ItemComponentsPipeline:
    def process_item(self, item, spider):
        if isinstance(item, ItemItem):
            adapter = ItemAdapter(item)
            if adapter.get("components"):
                if adapter["components"] != "None":
                    components = []
                    old_components = adapter["components"]
                    for component in old_components:
                        component_name = re.sub(r" \(.*?\)", "", component)
                        component_price = re.findall(r"\((.*?)\)", component)
                        component_price = (
                            component_price[0] if len(component_price) > 0 else "0"
                        )
                        component_names = [
                            new_component["name"] for new_component in components
                        ]
                        if component_name in component_names:
                            for new_component in components:
                                if new_component["name"] == component_name:
                                    new_component["amount"] = str(
                                        int(new_component["amount"]) + 1
                                    )
                        else:
                            components.append(
                                {
                                    "name": component_name,
                                    "amount": "1",
                                    "price": f"{component_price} Gold per count",
                                }
                            )
                    adapter["components"] = components
                return item
            else:
                raise DropItem(f"Missing components in {item}")
        else:
            return item
