exports.handler = async (event) => {
    console.debug('received event', event);
    return { message: 'Hello, ' + event.from + '!' };
};