start_db:
	docker compose up -d

stop_db:
	docker compose down

migrate:
	db-migrate up

migrate-undo:
	db-migrate down

server:
	pnpm run start

.PHONEY: start_db stop_db server