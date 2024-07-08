# Lambda in Docker Compose

```shell
docker compose run --rm function-poc-sam-lambda \
  sam local invoke PocSamLambdaFunction -e test/event.json
```