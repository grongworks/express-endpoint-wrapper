module.exports = function ({
    callback = () => {},
    errors = [{
        httpStatusCode: undefined,
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
                    const byInstance = errors.find(e => (!!error.byInstance && error instanceof error.byInstance));

                    if (!byMessage && !byInstance) {
                        return next(error);
                    }

                    if (byMessage) {
                        return byMessage.errorCallback({
                            res: response,
                            httpStatusCode: byMessage.httpStatusCode
                        });
                    }

                    if (byInstance) {
                        return byInstance.errorCallback({
                            res: response,
                            httpStatusCode: byInstance.httpStatusCode
                        });
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
