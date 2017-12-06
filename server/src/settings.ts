import * as commander from "commander"
import * as pathModule from "path"
let program = commander.option("--debug", "Enable debug mode")
    .option("--port <port>", "Specify the listening port instead of the default settings")
    .option("--host <host>", "Specify the listening host instead of the default setiings ")

    .option("--db-host <dataBaseHost>", "Specity database host")
    .option("--db-port <dataBasePort>", "Specity database port")
    .option("--db-name <dataBaseName>", "Specity database name")

    .option("--project-name <projectName>", "Specify the project name")
    .option("--project-domain <projectDomain>", "Specify the domain name")

    .option("--import-bag <bagInfo>", "Import bag file path")
    // init
    .option("--init-database", "Initialize database")
    .parse(process.argv)



    // etc
    .option("--offline", "Don't listen to http-port, we will do something and then go offline")
    .option("--test", "Specify using test mode")

declare const __dirname: string
export const project = {
    name: program["projectName"] || "AnonymouseProject",
    domain: program["projectDomain"] || "test.fusroda.io",
    debug: program["debug"] && true || false,
    test: program["test"] && true || false,
    offline: program["offline"]
}
export const debug: boolean = program["debug"] && true || false


export const http = {
    port: parseInt(program["port"]) || 10096,
    host: program["host"] || "0.0.0.0",
    offline: program["offline"],
    session: {
        secret: "6d6af3ef1973b6f5"
    }
}

export const staticRoot = debug && pathModule.join(__dirname, "../../webapp/src") || pathModule.join(__dirname, "../../dist/webapp/")
export const staticResources: {
    path: string
    route: string
}[] = [{
    path: staticRoot,
    route: null
}]

export const user = {
    salt: "9c018e80a8c4b754",
    blacklist: ["offline", "admin", "share", "public", "private", "jitaku", "guest", "view", "dashboard", "markoff", "home", "setting", "settings", "config", "configs", "notebook", "login", "introduction", "stream", "config", "public", "private", "guest", "history", "note", "notes", "all", "reset", "bot", "api", "document", "organization"]
}

export const database = {
    host: program["dbHost"] || "localhost",
    port: program["dbPort"] || 27017,
    name: program["dbName"] || project.name + (project.test && "-test" || "")
}
export const email = {
    fromEmail: "test@" + project.domain,
    fromName: "test",
    siteBase: `https://${project.domain}/`
}


export const page = {
    default: pathModule.join(staticRoot, "index.template.html")
}

export const initialize = {
    offline: program["offline"],
    importBag: program["importBag"]
}
