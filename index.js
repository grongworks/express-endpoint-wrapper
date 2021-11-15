const isInstanceOf = require("instance-of");

module.exports = function ({
    callback = () => {},
    errors = [{
        status: undefined,
        message: undefined,
        byInstance: undefined,
        byMessage: undefined,
        errorCallback: ({res, status, message}) => console.error(`[ERROR] ${status}:${message}`),
    }]
}) {
    return async function (request, response, next) {
        try {
            await callback(request, response, next);
        } catch (error) {
            if (errors instanceof Array) {
                if (errors.length > 0) {
                    const byMessage = errors.find(e => e.byMessage === error.message);
                    const byInstance = errors.find(e => (!!e.byInstance && isInstanceOf(error, e.byInstance)));

                    if (!byMessage && !byInstance) {
                        return next(error);
                    }

                    if (byMessage) {
                        if (!byMessage.errorCallback) byMessage.errorCallback = ({status, message}) => console.error(`[ERROR] ${status}:${message}`);
                        return byMessage.errorCallback({
                            res: response,
                            status: byMessage.status,
                            ...(!!byMessage.message && { message: byMessage.message })
                        });
                    }

                    if (byInstance) {
                        if (!byInstance.errorCallback) byInstance.errorCallback = ({status, message}) => console.error(`[ERROR] ${status}:${message}`);
                        return byInstance.errorCallback({
                            res: response,
                            status: byInstance.status,
                            ...(!!error.message && { message: error.message })
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
