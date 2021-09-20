# Summary

Project using NodeJs, Express, Typescript, GraphQL and LowDB

## Structure

    /
    ├── src
    │ ├── graphql
    │ │ ├── db
    │ │ ├── resolvers
    │ │ ├── schemas
    │ │ └── utils
    │ └── index.ts
    └── db.json

## Starting

```
npm install

npm run initDB

npm run start:dev
```

## Scripts

To generate types from graphql schemas use:

```
npm run codegen
```
