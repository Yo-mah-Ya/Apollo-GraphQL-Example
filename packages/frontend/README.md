1. Development

prepare `.env` file in the same directory of this file like shown below.

```.env
CDN_ENDPOINT=http://localhost:3000/graphql
LOG_LEVEL=DEBUG
```

```sh
./dev.sh start
```

2. Production

```sh
yarn compile
```
