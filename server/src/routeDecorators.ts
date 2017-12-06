import * as ServiceSpec from "./spec/service"
import { Errors } from "./errors"
import * as Leaf from "leaf-ts"

function GenRouteDec<T>(solver: (origin: Function, services: ServiceSpec.AllServices, option?: T) => void) {
    return function (option?: T) {
        return function (obj: any, name: string, descriptor: TypedPropertyDescriptor<Function>) {
            let fn = descriptor.value
            descriptor.value = function () {
                solver.call(this, fn.bind(this), this.services, option || {} as any)
            }
        }
    }
}

export const WithSessionUserInformation = GenRouteDec(function (origin, services, option: {

    optional: boolean
}) {
    if (!this.req || !this.req.session || !this.req.session.userId) {
        origin()
        return
    }
    const id = this.req.session.userId;
    if (id === "admin") {
        this.info.user = { id: "admin", username: "admin", password: "admin", role: "admin" };
        origin()
        return
    }
    services.UserService.getUserById({ id }, (err, user) => {
        if (!user) {
            this.error(new Errors.AuthorizationFailed("user id not found:" + id))
            return
        }
        this.info.user = user
        origin()
    })
})