# GraphQl Admin Template

Features:

- client and server monorepo
- typescript
- linting
- graphql
- client:
  - webpack dev server
  - typescript
  - react
  - material ui
  - admin interface / cms
- server
- ...

## Getting started

### Setting up database

```
yarn dev:db
```

- login to the database and run this query

```
echo "GRANT CREATE, ALTER, DROP, REFERENCES ON *.* TO 'my-app'@'%';" | mysql -h localhost -P 3306 --protocol=tcp -u root -ppassword
```

- _What to change to get started with a new project_
- Getting database setup

## Development

## Deployment
