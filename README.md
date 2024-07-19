# Lambda in Docker Compose using SAM

This is a proof-of-concept to show 2 Lambda functions each running Nodejs runtimes. LambdaA receives an event from a client. LambdaA then calls LambdaB and receives a response. Then the LambdaA responds to the client with a confirmation message.

## Goal

The key to this POC is that we want to use Serverless Application Model (SAM) and AWS official build images to run the Lambda code locally on an "official" runtime. And we want to do that on Docker Compose.

## Example Usage

First, execute the environment in daemon mode:

```shell
docker compose up -d
```

Watch those logs and run the following:

```shell
docker compose run --rm awscli lambda invoke \
  --function-name PocSamLambdaFunctionA \
  --payload "$(printf '{ "message": "Hello world!", "from": "%s" }' "${HOSTNAME:-a_client}" | base64 )" \
  --endpoint-url http://function-poc-sam-lambda-a:3001 \
  /dev/stderr 1> stdout.log 2> stderr.log && cat stderr.log
```

You should see something like this in the output. The escape chars are expected.

```json
"{\"message\":\"Hello, a_client! LambdaB said: {\\\"message\\\": \\\"Hello, LambdaA!\\\"}\"}"
```

### Explained: 

```shell
docker compose run --rm awscli lambda invoke \
```

This invoke the lambda via the aws cli. We use a configured `awscli` service in our Docker Compose environment for this.

```shell
  --function-name PocSamLambdaFunctionA \
```

... We are calling the function called `PocSamLambdaFunctionA`

```shell
  --payload "$(printf '{ "message": "Hello world!", "from": "%s" }' "${HOSTNAME:-a_client}" | base64 )" \
```

... the JSON payload is sent in base64 encoded format. We're adding a `HOSTNAME` env var here to the input string and that defaults to `a_client` when this var is unavailable.

```shell
  --endpoint-url http://function-poc-sam-lambda-a:3001 \
```

... here's where it gets interesting: We are actually talking to the Docker Compose service called `function-poc-sam-lambda-a` from inside the Docker Compose network on port 3001.

```shell
  /dev/stderr 1> stdout.log 2> stderr.log && cat stderr.log
```

... the final argument instructs the output to be sent to our stderr, then the stdout and stderr are redirected

... finally the stderr.log is output for our viewing pleasure.