const AWS = require('aws-sdk');

// Override the endpoint to point to the local Lambda server
AWS.config.update({
    endpoint: 'http://function-poc-sam-lambda-b:3001',
    region: 'eu-central-1'
});

const lambda = new AWS.Lambda();

exports.handler = async (event) => {
    console.debug('received event', event);

    const params = {
        FunctionName: 'PocSamLambdaFunctionB',
        Payload: JSON.stringify({ message: 'Hello from LambdaA!', from: 'LambdaA' }),
    };

    try {
        console.debug('Calling LambdaB with params:', params);
        const response = await lambda.invoke(params).promise();
        console.debug('Response from LambdaB:', response.Payload);

        if (event && event.from) {
            return JSON.stringify({ message: 'Hello, ' + event.from + '! LambdaB said: ' + response.Payload });
        }

        return JSON.stringify({ message: 'Hello, World! LambdaB said: ' + response.Payload });
    } catch (error) {
        console.error('Error invoking Lambda B:', error);
        throw error;
    }
};