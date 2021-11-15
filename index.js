module.exports = function ({
    callback = () => {},
    errors = [{
        statusCode: undefined,
        message: undefined,
        byInstance: undefined,
        byMessage: undefined,
        errorCallback: () => {},
    }]
}) {
    return async function (request, response, next) {
        try {
            await callback(request, response, next);
        } catch (error) {
            if (errors instanceof Array) {
                if (errors.length > 0) {
                    const byMessage = errors.find(e => e.byMessage === error.message);
                    const byInstance = errors.find(e => error instanceof error.byInstance);

                    if (!byMessage && !byInstance) {
                        return next(error);
                    }

                    if (byMessage) {
                        return byMessage.errorCallback({ httpStatusCode: byMessage.statusCode });
                    }

                    if (byInstance) {
                        return byInstance.errorCallback({ httpStatusCode: byInstance.statusCode });
                    }
                } else {
                    return next(error);
                }
            } else {
                return next(error);
            }
        }
    }
}
