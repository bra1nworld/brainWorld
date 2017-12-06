"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander = require("commander");
var pathModule = require("path");
var program = commander.option("--debug", "Enable debug mode")
    .option("--port <port>", "Specify the listening port instead of the default settings")
    .option("--host <host>", "Specify the listening host instead of the default setiings ")
    .option("--db-host <dataBaseHost>", "Specity database host")
    .option("--db-port <dataBasePort>", "Specity database port")
    .option("--db-name <dataBaseName>", "Specity database name")
    .option("--project-name <projectName>", "Specify the project name")
    .option("--project-domain <projectDomain>", "Specify the domain name")
    .option("--import-bag <bagInfo>", "Import bag file path")
    .option("--init-database", "Initialize database")
    .parse(process.argv)
    .option("--offline", "Don't listen to http-port, we will do something and then go offline")
    .option("--test", "Specify using test mode");
exports.project = {
    name: program["projectName"] || "AnonymouseProject",
    domain: program["projectDomain"] || "test.fusroda.io",
    debug: program["debug"] && true || false,
    test: program["test"] && true || false,
    offline: program["offline"]
};
exports.debug = program["debug"] && true || false;
exports.http = {
    port: parseInt(program["port"]) || 10096,
    host: program["host"] || "0.0.0.0",
    offline: program["offline"],
    session: {
        secret: "6d6af3ef1973b6f5"
    }
};
exports.staticRoot = exports.debug && pathModule.join(__dirname, "../../webapp/src") || pathModule.join(__dirname, "../../dist/webapp/");
exports.staticResources = [{
        path: exports.staticRoot,
        route: null
    }];
exports.user = {
    salt: "9c018e80a8c4b754",
    blacklist: ["offline", "admin", "share", "public", "private", "jitaku", "guest", "view", "dashboard", "markoff", "home", "setting", "settings", "config", "configs", "notebook", "login", "introduction", "stream", "config", "public", "private", "guest", "history", "note", "notes", "all", "reset", "bot", "api", "document", "organization"]
};
exports.database = {
    host: program["dbHost"] || "localhost",
    port: program["dbPort"] || 27017,
    name: program["dbName"] || exports.project.name + (exports.project.test && "-test" || "")
};
exports.email = {
    fromEmail: "test@" + exports.project.domain,
    fromName: "test",
    siteBase: "https://" + exports.project.domain + "/"
};
exports.page = {
    default: pathModule.join(exports.staticRoot, "index.template.html")
};
exports.initialize = {
    offline: program["offline"],
    importBag: program["importBag"]
};
//# sourceMappingURL=settings.js.map