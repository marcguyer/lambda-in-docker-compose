# Lambda in Docker Compose

```shell
docker compose up -d

docker compose run --rm awscli lambda invoke \
  --function-name PocSamLambdaFunctionA \
  --payload "$(printf '{ "message": "Hello world!", "from": "%s" }' "${HOSTNAME:-a_client}" | base64 )" \
  --endpoint-url http://function-poc-sam-lambda-a:3001 \
  /dev/stdout
```