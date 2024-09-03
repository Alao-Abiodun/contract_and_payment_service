start_db:
	docker compose up -d

stop_db:
	docker compose down

migrate:
	db-migrate up

rollback:
	db-migrate down

server:
	pnpm run start:dev

.PHONEY: start_db stop_db server