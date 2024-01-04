.PHONY: dev serve watch dbgen dbpush dbdrop dbupsert dbdelete dbcheck

dev:
	@npm run dev

serve:
	@npm run serve

watch:
	@npm run watch

dbgen:
	@npm run generate

dbpush:
	@npm run push

dbdrop:
	@npm run drop

dbupsert:
	@npm run upsert

dbdelete:
	@npm run delete

dbcheck:
	@npm run check