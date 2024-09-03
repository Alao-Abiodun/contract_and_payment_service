# contract_and_payment_service
The project is implemented using the modular based architecture. The project is divided into modules, the profile(auth, user) module is responsilber for creating a profile on the application, the contract module and the job module. The contract module is responsible for creating, updating, and deleting contracts. The payment(job) module is responsible for creating, updating. The project uses the nestjs framework. The project uses the postgres database. The project uses the docker to run the database. The project uses the makefile to run the server, database, and migrate the database.

## Installation

## How to install from source
- Clone the repository - `git clone repo-link`
- `cd project-folder`
- You need to have valid mySQL or Postgres database connection
- Install dependencies - `pnpm install`
- Setup environment variable - `cp .env.example .env`
- Run development server `make server`

## Using docker with the database with migration
- Start docker container - `make start_db`
- Stop docker container - `make stop_db`
- Migrate the database - `make migrate`
- Rollback the database - `make rollback`

## Format code with Prettier
- After writing code, you can format it with Prettier using `yarn format`
- You can update your prettier config in `.prettierrc` file, the default setting uses 4 spaces for indentation

