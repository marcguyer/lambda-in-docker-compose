exports.handler = async (event) => {
    console.debug('received event', event);
    JSON.stringify({ message: 'Hello, ' + event.from + '!' });
};