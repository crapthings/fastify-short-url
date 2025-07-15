## Requirement

- node 22.x
- mongodb

## ENV

```bash
PORT=3000 # server port
MONGO_URL=mongodb://localhost:27017/fastify-short-url # mongodb with dbname
DOMAIN=http://localhost:3000 # replace to your domain
SHORT_URL_LENGTH=12 # random id length
```

## How to

```bash
git clone
cd
npm i
npm run start
```

## Test

```bash
npm run test
```

## Test Get An Url

```bash
npm run generate # or node run.js
# http://localhost:3000/U6OM3m8n6vOQ
```
