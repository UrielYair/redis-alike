var minimatch = require("minimatch");

class MyRedis {
    constructor() {
        this.db = {};
        console.log("db created.")
    }

    get(key) {
        if(this.db.hasOwnProperty(key)) {
            return this.db[key];
        }
        return "(nil)";
    }
    set(key, value) {
        this.db[key] = value;
        return "OK";
    }
    keys(pattern) {
        let matchedResults = [];
        for (const [key, value] of Object.entries(this.db)) {
            if (minimatch(key, pattern)) {
                matchedResults.push(key);
            }
        }
        return matchedResults;
    }
    expire(keyToExpire, seconds) {
        var _this = this;
        setTimeout(function() {
            if(_this.db.hasOwnProperty(keyToExpire)) {
                delete _this.db[keyToExpire];
                console.log(keyToExpire + " deleted.");
            }
        }, parseInt(seconds, 10) * 1000);
    }
    exist(keys) {
        let matchCounter = 0;
        for (let i = 0; i < keys.length; i++) {
            if(this.db.hasOwnProperty(keys[i])) {
                matchCounter += 1;
            }
        }
        return matchCounter;
    }
    del(keysToDelete) {
        let deletedCounter = 0;
        for (let i = 0; i < keysToDelete.length; i++) {
            if(this.db.hasOwnProperty(keysToDelete[i])) {
                delete this.db[keysToDelete[i]];
                deletedCounter += 1;
            }
        }
        return deletedCounter;
    }
}

module.exports = MyRedis