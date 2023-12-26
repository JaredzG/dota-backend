.PHONY: upsert delete check

upsert:
	@npx tsx src/db/operations/upsert_all.ts

delete:
	@npx tsx src/db/operations/delete_all.ts

check:
	@npx tsx src/db/operations/check_rows_sequences.ts