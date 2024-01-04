.PHONY: scrape heroes items heroesm itemsm

scrape: heroes items heroesm itemsm

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
	scrapy crawl item-meta -O ../../data/item.PHONY: dev serve watch

dev:
	@npm run dev

serve:
	@npm run serve

watch:
	@npm run watch