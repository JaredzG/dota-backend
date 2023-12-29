.PHONY: gen push drop upsert delete check

gen:
	@npm run migration:generate

push:
	@npm run migration:push

drop:
	@npm run migration:drop

upsert:
	@npx tsx src/db/operations/upsert_all.ts

delete:
	@npx tsx src/db/operations/delete_all.ts

check:
	@npx tsx src/db/operations/check_rows_sequences.ts