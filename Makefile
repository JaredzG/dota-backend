.PHONY: dev serve watch scrall scrh scri scrhm scrim scremp dbgen dbpush dbdrop dbupsert dbdelete dbcheck s3upload s3read

dev:
	@npm run dev

serve:
	@npm run serve

watch:
	@npm run watch

scrall: scrh scri scrhm scrim

scrh:
	@cd src/scraper/lotus && scrapy crawl hero -O ../../../data/heroes.json

scri:
	@cd src/scraper/lotus && scrapy crawl item -O ../../../data/items.json

scrhm:
	@cd src/scraper/lotus && scrapy crawl hero-meta -O ../../../data/heroes.meta.json

scrim:
	@cd src/scraper/lotus && scrapy crawl item-meta -O ../../../data/items.meta.json

scremp:
	@rm data/heroes.json data/items.json data/heroes.meta.json data/items.meta.json

dbgen:
	@npm run dbgen

dbpush:
	@npm run dbpush

dbdrop:
	@npm run dbdrop

dbupsert:
	@npm run dbupsert

dbdelete:
	@npm run dbdelete

dbcheck:
	@npm run dbcheck

s3upload:
	@npm run s3upload

s3read:
	@npm run s3read