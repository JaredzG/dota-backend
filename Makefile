.PHONY: all scrape_heroes scrape_items scrape_heroes_meta scrape_items_meta

all: scrape_heroes scrape_items scrape_heroes_meta scrape_items_meta

scrape_heroes:
	@cd src/dota && \
	scrapy crawl hero -O ../../data/heroes.json

scrape_items:
	@cd src/dota && \
	scrapy crawl item -O ../../data/items.json

scrape_heroes_meta:
	@cd src/dota && \
	scrapy crawl hero-meta -O ../../data/heroes.meta.json

scrape_items_meta:
	@cd src/dota && \
	scrapy crawl item-meta -O ../../data/items.meta.json