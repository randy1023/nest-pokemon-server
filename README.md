<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Clone file **.env.example** and rename like **.env**

## Run image docker to database on developer

```bash
# database on docker
$ docker-compose up -d

```

## Insert test data on databases from seed

```bash
http://localhost:3000/api/v2/seed

```

# Production build

1. create file `.env.prod `

2. full enviroment variable for production

3. Create new image on docker

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build

```

4. run `docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d` when remove image
