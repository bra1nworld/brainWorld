
export class TestRunner {
    public pathes: string[]
    constructor(...pathes: string[]) {
        this.pathes = pathes
        let mocha = document.querySelector("#mocha")
        if (!mocha) {
            let div = document.createElement("div") as HTMLDivElement
            div.id = "mocha"
            document.body.appendChild(div)
        }
    }
    run(pathes: string[] = this.pathes) {
        mocha["suite"].suites = [];
        mocha.setup("bdd")
        mocha.checkLeaks()
        for (let path of pathes) {
            let test = require(path)
            test.run()
        }
        mocha.run()
    }
}
