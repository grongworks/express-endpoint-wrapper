# express-endpoint-wrapper
This package provides a wrapper to avoid try-catch blocks in each express-endpoint. It detects errors byInstance or byMessage.

### basic usage
```javascript
const express = require("express");
const router = express.Router({mergeParams: true});
const eew = require("express-endpoint-wrapper");

module.exports = function () {
    router.get("/", eew({
        callback: (req, res) => {
            // controller belongs here - anything you would do inside a normal express-route
        },
    }));

    return router;
};
```

### usage with errors detected by message
```javascript
const express = require("express");
const router = express.Router({mergeParams: true});
const eew = require("express-endpoint-wrapper");

module.exports = function () {
    router.get("/", eew({
        callback: (req, res) => {
            // controller belongs here - anything you would do inside a normal express-route
        },
        errors: [
            {
                status: 400, byMessage: "message-that-should-be-detected",
                errorCallback: ({res, status, message}) => {    // is fully optional; if not provide -> console.log
                    // do something with the error...
                    res.status(status).json({ error: message }); // for example
                }
            }
        ]
    }));

    return router;
};
```

### usage with errors detected by instance
```javascript
const express = require("express");
const router = express.Router({mergeParams: true});
const eew = require("express-endpoint-wrapper");

module.exports = function () {
    router.get("/", eew({
        callback: (req, res) => {
            // controller belongs here - anything you would do inside a normal express-route
        },
        errors: [
            {
                status: 400, byInstance: SuperFancyCustomError,
                errorCallback: ({res, status, message}) => {    // is fully optional; if not provide -> console.log
                    // do something with the error...
                    res.status(status).json({ error: message }); // for example
                }
            }
        ]
    }));

    return router;
};
```
