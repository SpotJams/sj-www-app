
var dbName = "sjDB";

var DBCONN = null;

sklad.open(dbName, {
    version: 1,
    migration: {
        '1': function (database) {
            // This migration part starts when your code runs first time in the browser.
            // This is a migration from "didn't exist" to "1" database version
            var objStore = database.createObjectStore('user');
        },
    }
}, function (err, conn) {
    // work with database connection
    console.log("CONNECTING TO DB: ", conn, err);
    DBCONN = conn;
});