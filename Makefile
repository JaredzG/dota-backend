.PHONY: hero

all: scrape

scrape:
	@cd src/dota && \
	scrapy crawl hero -O ../../data/hero.json && \
	scrapy crawl item -O ../../data/item.json