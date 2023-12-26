.PHONY: all heroes items heroesm itemsm

all: heroes items heroesm itemsm

heroes:
	@cd src/dota && \
	scrapy crawl hero -O ../../data/heroes.json

items:
	@cd src/dota && \
	scrapy crawl item -O ../../data/items.json

heroesm:
	@cd src/dota && \
	scrapy crawl hero-meta -O ../../data/heroes.meta.json

itemsm:
	@cd src/dota && \
	scrapy crawl item-meta -O ../../data/items.meta.json