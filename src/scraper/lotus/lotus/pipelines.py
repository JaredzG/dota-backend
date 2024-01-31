# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from scrapy.exceptions import DropItem
from lotus.items import HeroItem, ItemItem, HeroMetaInfoItem, ItemMetaInfoItem
import re


class HeroAliasPipeline:
    def process_item(self, item, spider):
        if isinstance(item, HeroItem):
            adapter = ItemAdapter(item)
            if adapter.get("alias"):
                adapter["alias"] = adapter["alias"].strip()
                return item
            else:
                raise DropItem(f"Missing alias in {item}.")
        else:
            return item


class HeroBiographyPipeline:
    def process_item(self, item, spider):
        if isinstance(item, HeroItem):
            adapter = ItemAdapter(item)
            if adapter.get("biography"):
                adapter["biography"] = re.sub(
                    r"(\w+)$",
                    r"\1.",
                    re.sub(
                        r"\.([A-Za-z])",
                        r". \1",
                        " ".join(adapter["biography"])
                        .replace('"', "`")
                        .replace("\n", " ")
                        .replace("’", "'"),
                    ),
                )
                return item
            else:
                raise DropItem(f"Missing biography in {item}.")
        else:
            return item


class HeroIdentityPipeline:
    def process_item(self, item, spider):
        if isinstance(item, HeroItem):
            adapter = ItemAdapter(item)
            if adapter.get("identity"):
                adapter["identity"] = re.sub(
                    r"(\w+)$", r"\1.", adapter["identity"].strip()
                )
                return item
            else:
                raise DropItem(f"Missing identity in {item}.")
        else:
            return item


class HeroDescriptionPipeline:
    def process_item(self, item, spider):
        if isinstance(item, HeroItem):
            adapter = ItemAdapter(item)
            if adapter.get("description"):
                adapter["description"] = re.sub(
                    r"(\w+)$",
                    r"\1.",
                    re.sub(
                        r"\.([A-Z])",
                        r". \1",
                        adapter["description"].strip().replace('"', "`"),
                    ),
                )
                return item
            else:
                raise DropItem(f"Missing description in {item}.")
        else:
            return item


class HeroComplexityPipeline:
    def process_item(self, item, spider):
        if isinstance(item, HeroItem):
            adapter = ItemAdapter(item)
            if adapter.get("complexity"):
                match adapter["complexity"]:
                    case "1.0":
                        adapter["complexity"] = "Simple"
                    case "2.0":
                        adapter["complexity"] = "Moderate"
                    case "3.0":
                        adapter["complexity"] = "Complex"
                return item
            else:
                raise DropItem(f"Missing complexity in {item}.")
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
                    new_lore = (
                        ability["lore"].replace("‘", "'").replace("’", "'")
                        if ability["lore"] != "None"
                        else None
                    )
                    if "Alchemist" in adapter["name"]:
                        if new_name in ["Aghanim's Scepter Synth"]:
                            continue
                    elif "Arc Warden" in adapter["name"]:
                        if new_name in ["Tempest"]:
                            continue
                        elif new_name in ["Flux", "Magnetic Field", "Spark Wraith"]:
                            split_description = [
                                v.strip()
                                for v in re.split(
                                    "Arc Warden:|Tempest Double:", new_description
                                )
                            ]
                            abilities.append(
                                {
                                    "name": new_name,
                                    "features": new_features,
                                    "description": f"{f'{split_description[0]} ' if new_name in ['Flux'] else ''}{split_description[1]}",
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                            abilities.append(
                                {
                                    "name": f"{new_name} (Tempest Double)",
                                    "features": new_features,
                                    "description": f"{split_description[2]}",
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                            continue
                    elif "Beastmaster" in adapter["name"]:
                        if new_name in ["Dive Bomb"]:
                            new_name += " (Hawk)"
                        elif new_name in ["Poison"]:
                            new_name += " (Boar)"
                        elif new_name in ["Max Health Aura", "Movespeed Aura"]:
                            continue
                    elif "Brewmaster" in adapter["name"]:
                        if new_name in ["Drunken Brawler"]:
                            stances = [
                                stance[0]
                                for stance in re.findall(
                                    "((Earth|Storm|Fire|Void) Stance)", new_description
                                )
                            ]
                            split_description = [
                                value.strip()
                                for value in re.split(
                                    "(Earth Stance - |Storm Stance - |Fire Stance |Void Stance - )",
                                    new_description,
                                )
                            ]
                            stance_descriptions = [
                                re.sub(r"(\w+)$", r"\1.", split_description[i])
                                for i in range(len(split_description))
                                if i % 2 == 0 and i != 0
                            ]
                            abilities.append(
                                {
                                    "name": new_name,
                                    "features": new_features,
                                    "description": split_description[0],
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                            for i in range(len(stances)):
                                abilities.append(
                                    {
                                        "name": f"{new_name} ({stances[i]})",
                                        "features": new_features,
                                        "description": stance_descriptions[i],
                                        "upgrades": new_upgrades,
                                        "lore": new_lore,
                                    }
                                )
                            continue
                        elif new_name in ["Primal Companion"]:
                            stances = [
                                "Earth Stance",
                                "Storm Stance",
                                "Fire Stance",
                                "Void Stance",
                            ]
                            for stance in stances:
                                abilities.append(
                                    {
                                        "name": f"{new_name} ({stance})",
                                        "features": new_features,
                                        "description": f"Summon {stance}.",
                                        "upgrades": new_upgrades,
                                        "lore": new_lore,
                                    }
                                )
                        elif new_name in [
                            "Debuff Immunity",
                            "Demolish",
                            "Hurl Boulder",
                        ]:
                            abilities.append(
                                {
                                    "name": f"{new_name} (Earth Brewling)",
                                    "features": new_features,
                                    "description": new_description,
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                            continue
                        elif new_name in ["Cyclone", "Dispel Magic", "Wind Walk"]:
                            abilities.append(
                                {
                                    "name": f"{new_name} (Storm Brewling)",
                                    "features": new_features,
                                    "description": new_description,
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                            continue
                        elif new_name in ["Permanent Immolation", "Permanent Phase"]:
                            abilities.append(
                                {
                                    "name": f"{new_name} (Fire Brewling)",
                                    "features": new_features,
                                    "description": new_description,
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                            continue
                        elif new_name in ["Astral Pull"]:
                            abilities.append(
                                {
                                    "name": f"{new_name} (Void Brewling)",
                                    "features": new_features,
                                    "description": new_description,
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                            continue
                    elif "Doom" in adapter["name"]:
                        if new_name in ["Devoured Ability 1", "Devoured Ability 2"]:
                            continue
                    elif "Elder Titan" in adapter["name"]:
                        if new_name in [
                            "Return Astral Spirit",
                            "Echo Stomp",
                            "Natural Order",
                        ]:
                            abilities.append(
                                {
                                    "name": f"{new_name} (Astral Spirit)",
                                    "features": new_features,
                                    "description": new_description,
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                            if new_name in ["Echo Stomp"]:
                                abilities.append(
                                    {
                                        "name": f"{new_name} (Upgraded)",
                                        "features": new_features,
                                        "description": f"{new_description} {new_upgrades[0]['description']}",
                                        "upgrades": None,
                                        "lore": new_lore,
                                    }
                                )
                    elif "Faceless Void" in adapter["name"]:
                        if new_name in ["Backtrack"]:
                            continue
                    elif "Invoker" in adapter["name"]:
                        if new_name in ["Melting Strike"]:
                            abilities.append(
                                {
                                    "name": f"{new_name} (Forged Spirit)",
                                    "features": new_features,
                                    "description": new_description,
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                            continue
                    elif "Io" in adapter["name"]:
                        if new_name in ["Io Innate"]:
                            continue
                    elif "Lone Druid" in adapter["name"]:
                        duplicate_ability = False
                        for new_ability in abilities:
                            if new_ability["name"] == new_name:
                                new_name += " (Spirit Bear)"
                                break
                        if new_name == "Universal Unit":
                            continue
                    elif "Lycan" in adapter["name"]:
                        if new_name in ["Cripple", "Invisibility"]:
                            abilities.append(
                                {
                                    "name": f"{new_name} (Lycan Wolf)",
                                    "features": new_features,
                                    "description": new_description,
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                            continue
                    elif "Meepo" in adapter["name"]:
                        if new_name in ["Pack Rat"]:
                            continue
                    elif "Morphling" in adapter["name"]:
                        if new_name in ["Morph"]:
                            abilities.append(
                                {
                                    "name": f"{new_name} (Upgraded)",
                                    "features": new_features,
                                    "description": f"{new_description} {'. '.join(new_upgrades[0]['description'].split('. ')[1:])}",
                                    "upgrades": None,
                                    "lore": new_lore,
                                }
                            )
                    elif "Pangolier" in adapter["name"]:
                        if new_name in ["Pangolier Innate"]:
                            continue
                    elif "Razor" in adapter["name"]:
                        if new_name in ["Static Link"]:
                            abilities.append(
                                {
                                    "name": f"{new_name} (Upgraded)",
                                    "features": new_features,
                                    "description": f"{new_description} Also pulls {re.split('.*?pull ', new_upgrades[0]['description'])[1]}",
                                    "upgrades": None,
                                    "lore": new_lore,
                                }
                            )
                    elif "Rubick" in adapter["name"]:
                        if new_name in [
                            "Stolen Spell 1",
                            "Stolen Spell 2",
                        ]:
                            continue
                    elif "Sven" in adapter["name"]:
                        if new_name in ["Storm Hammer"]:
                            desc_string = (
                                "Sven follows along the Storm Hammer. "
                                + re.sub(
                                    r"(\w+)$",
                                    r"\1.",
                                    ". ".join(
                                        new_upgrades[0]["description"].split(". ")[1:-1]
                                    ),
                                )
                            )
                            abilities.append(
                                {
                                    "name": f"{new_name} (Upgraded)",
                                    "features": new_features,
                                    "description": f"{new_description} {desc_string}",
                                    "upgrades": None,
                                    "lore": new_lore,
                                }
                            )
                    elif "Techies" in adapter["name"]:
                        if new_name in ["Invisibility"]:
                            continue
                    elif "Templar Assassin" in adapter["name"]:
                        duplicate_ability = False
                        for new_ability in abilities:
                            if new_ability["name"] == new_name:
                                duplicate_ability = True
                                break
                        if duplicate_ability:
                            abilities.append(
                                {
                                    "name": f"{new_name} (Psionic Trap)",
                                    "features": new_features,
                                    "description": new_description,
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                            continue
                    elif "Troll Warlord" in adapter["name"]:
                        if new_name in ["Berserker's Rage"]:
                            abilities.append(
                                {
                                    "name": f"{new_name} (Active)",
                                    "features": new_features,
                                    "description": new_description,
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                    elif "Underlord" in adapter["name"]:
                        if new_name in ["Warp"]:
                            continue
                    elif "Undying" in adapter["name"]:
                        if new_name in ["Deathlust"]:
                            abilities.append(
                                {
                                    "name": f"{new_name} (Undying Zombie)",
                                    "features": new_features,
                                    "description": new_description,
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                            continue
                        elif new_name in ["Spell Immunity"]:
                            continue
                    elif "Viper" in adapter["name"]:
                        if new_name in ["Become Universal"]:
                            continue
                    elif "Visage" in adapter["name"]:
                        duplicate_ability = False
                        for new_ability in abilities:
                            if new_ability["name"] == new_name:
                                duplicate_ability = True
                                break
                        if duplicate_ability:
                            abilities.append(
                                {
                                    "name": f"{new_name} (Familiar)",
                                    "features": new_features,
                                    "description": new_description,
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                            continue
                        elif new_name in ["Familiar Talents"]:
                            continue
                    elif "Warlock" in adapter["name"]:
                        if new_name in ["Permanent Immolation", "Flaming Fists"]:
                            abilities.append(
                                {
                                    "name": f"{new_name} (Warlock Golem)",
                                    "features": new_features,
                                    "description": new_description,
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                            continue
                        elif new_name in ["Eldritch Explosion"]:
                            abilities.append(
                                {
                                    "name": f"{new_name} (Minor Imp)",
                                    "features": new_features,
                                    "description": new_description,
                                    "upgrades": new_upgrades,
                                    "lore": new_lore,
                                }
                            )
                            continue
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
                raise DropItem(f"Missing abilities in {item}.")
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
                features[feature] = None
        return features

    def get_ability_description(self, old_description):
        description = re.sub(
            r"(\w+)$",
            r"\1.",
            re.sub(
                r"\.([A-Z])",
                r". \1",
                "".join(old_description)
                .strip()
                .replace("\n", "")
                .replace('"', "`")
                .replace("/ ", "/")
                .replace(" /", "/")
                .replace("/", " / "),
            ),
        )
        return description

    def get_ability_upgrades(self, old_upgrades):
        if old_upgrades != "None":
            upgrades = []
            aghs_upgrades = list(
                filter(lambda item: item != "", old_upgrades.strip().split("\n"))
            )
            for i in range(0, len(aghs_upgrades), 2):
                if "Shard" in aghs_upgrades[i]:
                    upgrades.append(
                        {
                            "type": "Shard Upgrade",
                            "description": re.sub(
                                r"(\w+)$",
                                r"\1.",
                                re.sub(
                                    r"\.([A-Za-z])",
                                    r". \1",
                                    aghs_upgrades[i + 1]
                                    .replace("/ ", "/")
                                    .replace(" /", "/")
                                    .replace("/", " / "),
                                ),
                            ),
                        }
                    )
                if "Scepter" in aghs_upgrades[i]:
                    upgrades.append(
                        {
                            "type": "Scepter Upgrade",
                            "description": re.sub(
                                r"(\w+)$",
                                r"\1.",
                                re.sub(
                                    r"\.([A-Za-z])",
                                    r". \1",
                                    aghs_upgrades[i + 1]
                                    .replace("/ ", "/")
                                    .replace(" /", "/")
                                    .replace("/", " / "),
                                ),
                            ),
                        }
                    )
            return upgrades
        else:
            return None


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
                            "type": talent["type"],
                            "effect": talent["effect"]
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
                raise DropItem(f"Missing talents in {item}.")
        else:
            return item


class ItemNamePipeline:
    def process_item(self, item, spider):
        if isinstance(item, ItemItem):
            adapter = ItemAdapter(item)
            if adapter.get("name"):
                name = adapter["name"]
                if name in ["Boots of Travel"]:
                    name = "Boots of Travel (Level 1)"
                elif name in ["Boots of Travel 2"]:
                    name = "Boots of Travel (Level 2)"
                elif name in ["Dagon"]:
                    name = "Dagon (Level 1)"
                elif name in ["Dagon 2"]:
                    name = "Dagon (Level 2)"
                elif name in ["Dagon 3"]:
                    name = "Dagon (Level 3)"
                elif name in ["Dagon 4"]:
                    name = "Dagon (Level 4)"
                elif name in ["Dagon 5"]:
                    name = "Dagon (Level 5)"
                adapter["name"] = name
                return item
            else:
                raise DropItem(f"Missing name in {item}.")
        else:
            return item


class ItemLorePipeline:
    def process_item(self, item, spider):
        if isinstance(item, ItemItem):
            adapter = ItemAdapter(item)
            if adapter.get("lore"):
                lore = re.sub(r"(\w+)$", r"\1.", adapter["lore"].strip())
                adapter["lore"] = lore if lore else None
                return item
            else:
                raise DropItem(f"Missing lore in {item}.")
        else:
            return item


class ItemClassificationPipeline:
    def process_item(self, item, spider):
        if isinstance(item, ItemItem):
            adapter = ItemAdapter(item)
            if adapter.get("classification"):
                classification = adapter["classification"]
                if adapter["name"] in ["Void Stone"]:
                    classification = "Miscellaneous"
                elif adapter["name"] in ["Ring of Tarrasque", "Tiara of Selemene"]:
                    classification = "Secret"
                elif adapter["name"] in ["Helm of the Overlord"]:
                    classification = "Armor"
                adapter["classification"] = classification
                return item
            else:
                raise DropItem(f"Incorrect classification in {item}.")
        else:
            return item


class ItemStatsPipeline:
    def process_item(self, item, spider):
        if isinstance(item, ItemItem):
            adapter = ItemAdapter(item)
            if adapter.get("stats"):
                old_stats = adapter["stats"].strip()
                stats = None
                if old_stats:
                    stats = old_stats.replace("+", ":+").split(":")[1:]
                    if adapter["name"] in [
                        "Apex",
                        "Pupil's Gift",
                        "Philosopher's Stone",
                    ]:
                        first_stat = stats[0]
                        second_stat = stats[1]
                        if adapter["name"] in [
                            "Apex",
                            "Pupil's Gift",
                        ]:
                            new_first_stat = first_stat[0 : first_stat.index("\n")]
                            stats[0] = new_first_stat
                            new_second_stat = (
                                re.sub("  ", " ", second_stat) + " (Universal Heroes)"
                            )
                            stats[1] = new_second_stat
                            new_stats = [" or ".join(stats)]
                            stats = new_stats
                        elif adapter["name"] in [
                            "Philosopher's Stone",
                        ]:
                            split_first_stat = re.search(r"(.*?)([-].*)", first_stat)
                            new_first_stat = split_first_stat.group(1)
                            new_second_stat = split_first_stat.group(2)
                            new_third_stat = stats[1].replace("/min", "per minute")
                            stats[0] = new_first_stat
                            stats[1] = new_second_stat
                            stats.append(new_third_stat)
                    elif adapter["name"] in ["Vambrace"]:
                        stats = ["+8 Main Attribute", "+2 Other Attributes"]
                    elif adapter["name"] in ["Dagon (Level 1)"]:
                        new_stats = []
                        for stat in stats:
                            value = re.split("/", stat)[0]
                            property = (
                                re.search(r"[A-Za-z()\s]+$", stat).group().strip()
                            )
                            new_stats.append(f"{value} {property}")
                        stats = new_stats
                    for i in range(len(stats)):
                        stats[i] = (
                            stats[i]
                            .replace("  ", " ")
                            .replace("/ ", "/")
                            .replace(" /", "/")
                            .replace("/", " / ")
                        )
                    if not stats:
                        stats = None
                adapter["stats"] = stats
                return item
            else:
                raise DropItem(f"Missing stats in {item}.")
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
                        new_description = self.get_ability_description(
                            old_description, adapter["name"]
                        )
                        abilities.append(
                            {
                                "name": new_name,
                                "features": new_features,
                                "description": new_description,
                            }
                        )
                    adapter["abilities"] = abilities
                else:
                    adapter["abilities"] = None
                return item
            else:
                raise DropItem(f"Missing abilities in {item}.")
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
                features[feature] = None
        return features

    def get_ability_description(self, old_description, item_name):
        description = re.sub(
            r"(\w+)$",
            r"\1.",
            re.sub(
                r"\.([A-Z])",
                r". \1",
                "".join(old_description)
                .strip()
                .replace("\n", "")
                .replace('"', "`")
                .replace("/ ", "/")
                .replace(" /", "/")
                .replace("/", " / "),
            ),
        )
        if item_name in ["Boots of Travel"]:
            description = re.split(r"(Boots of Travel:?)( \d:)?", description)[
                3
            ].strip()
        elif item_name in ["Vambrace"]:
            description = "Provides one of the following, based on the Vambrace's main attribute: Strength - +8% Magic Resistance; Agility - +10 Attack Speed; Intelligence - +6% Spell Amp."
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
                                        r"(\d+\.?\d*)",
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
                                        r"(\d+\.?\d*)",
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
                else:
                    adapter["prices"] = None
                return item
            else:
                raise DropItem(f"Missing prices in {item}.")
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
                            if component_name in ["Boots of Travel 1"]:
                                components.append(
                                    {
                                        "name": "Boots of Travel (Level 1)",
                                        "amount": "1",
                                        "price": f"{component_price} Gold per count",
                                    }
                                )
                                continue
                            elif component_name in ["Dagon 1"]:
                                components.append(
                                    {
                                        "name": "Dagon (Level 1)",
                                        "amount": "1",
                                        "price": f"{component_price} Gold per count",
                                    }
                                )
                                continue
                            elif component_name in ["Dagon 2"]:
                                components.append(
                                    {
                                        "name": "Dagon (Level 2)",
                                        "amount": "1",
                                        "price": f"{component_price} Gold per count",
                                    }
                                )
                                continue
                            elif component_name in ["Dagon 3"]:
                                components.append(
                                    {
                                        "name": "Dagon (Level 3)",
                                        "amount": "1",
                                        "price": f"{component_price} Gold per count",
                                    }
                                )
                                continue
                            elif component_name in ["Dagon 4"]:
                                components.append(
                                    {
                                        "name": "Dagon (Level 4)",
                                        "amount": "1",
                                        "price": f"{component_price} Gold per count",
                                    }
                                )
                                continue
                            components.append(
                                {
                                    "name": component_name,
                                    "amount": "1",
                                    "price": f"{component_price} Gold per count",
                                }
                            )
                    adapter["components"] = components
                else:
                    adapter["components"] = None
                return item
            else:
                raise DropItem(f"Missing components in {item}.")
        else:
            return item


class HeroMetaInfoPipeline:
    def process_item(self, item, spider):
        if isinstance(item, HeroMetaInfoItem):
            adapter = ItemAdapter(item)
            if adapter.get("name"):
                percentages = []
                old_percentages = adapter["percentages"]
                ranks = [
                    "Herald / Guardian / Crusader",
                    "Archon",
                    "Legend",
                    "Ancient",
                    "Divine / Immortal",
                ]
                types = ["Pick Percentage", "Win Percentage"]
                for i in range(0, len(old_percentages), 2):
                    percentages.append(
                        {
                            "rank": ranks[i // 2],
                            "type": types[i % 2],
                            "percentage": old_percentages[i],
                        }
                    )
                    percentages.append(
                        {
                            "rank": ranks[(i + 1) // 2],
                            "type": types[(i + 1) % 2],
                            "percentage": old_percentages[i + 1],
                        }
                    )
                adapter["percentages"] = percentages
                return item
            else:
                raise DropItem(f"Missing name in {item} meta information.")
        else:
            return item


class ItemMetaInfoPipeline:
    def process_item(self, item, spider):
        if isinstance(item, ItemMetaInfoItem):
            adapter = ItemAdapter(item)
            if adapter.get("name"):
                percentages = []
                old_percentages = adapter.get("percentages")
                types = ["Use Percentage", "Win Percentage"]
                for i in range(len(old_percentages)):
                    percentages.append(
                        {"type": types[i], "percentage": old_percentages[i]}
                    )
                adapter["percentages"] = percentages
                return item
            else:
                raise DropItem(f"Missing name in {item} meta information.")
        else:
            return item
