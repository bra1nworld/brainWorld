import * as Meta from "../script/meta"

export function run() {
    describe("Example test to read meta", () => {
        it("Get meta", (done) => {
            console.log(Meta)
            done()
        })
    })


}
