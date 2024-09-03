# contract_and_payment_service

## Installation

```bash
$ clone the repository
```

```bash
$ pnpm install
```

## Running the app with the makefile

```bash
# development
$ make server
```

## Running the database with docker and makefile

```bash
# To start the database
$ make start_db 

# To stop the database
$ make stop_db
```

## Migrate the database with makefile

```bash
# To migrate the database
$ make migrate

# To rollback the database
$ make rollback
```

## Test
```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
