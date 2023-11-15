.PHONY: scrape_heroes scrape_items

all: scrape_heroes scrape_items

scrape_heroes:
	@cd src/dota && \
	scrapy crawl hero -O ../../data/hero.json

scrape_items:
	@cd src/dota && \
	scrapy crawl item -O ../../data/item.json