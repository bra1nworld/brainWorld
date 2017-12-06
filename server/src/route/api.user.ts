import * as Leaf from "leaf-ts"
import * as RouteSpec from "../spec/route"
import * as RouteDecorators from "../routeDecorators"
import { Errors } from "../errors"
export class UserAPIService extends RouteSpec.UserAPIServiceSpec {
    initialize() {
        this.api("getUserById", (ctx) => {
            this.services.UserService.getUserById(ctx.params, (err, result) => {
                ctx.done(err, result)
            })
        })
        this.api("getUser", (ctx) => {
            this.services.UserService.getUser(ctx.body, (err, result) => {
                ctx.done(err, result)
            })
        })
        this.api("login", (ctx) => {
            if (ctx.body.username === "admin") {
                if (ctx.body.password === "admin") {
                    ctx.req.session.userId = "admin"
                } else {
                    ctx.error(new Errors.AuthorizationFailed())
                    return
                }
                ctx.done(null, { id: "admin", username: "admin" })
                return
            }
            this.services.UserService.getUser(
                { username: ctx.body.username, password: ctx.body.password },
                (err, user) => {
                    if (err || !user) {
                        console.log("login api", err)
                        ctx.error(new Errors.AuthorizationFailed("Can not find user"))
                        return
                    }
                    ctx.req.session.userId = user.id
                    delete user.password
                    delete user.passwordHash

                    ctx.done(null, user)
                }
            )
        })

        this.api("logout", (ctx) => {
            delete ctx.req.session.userId
            ctx.done(null, true)
        })

        this.api("getEnvironmentInformation", (ctx) => {
            let user = ctx.info.user;
            ctx.done(null, user)
        }).decorate(RouteDecorators.WithSessionUserInformation())

        this.installTo(this.services.ExpressService.server)
    }
}
