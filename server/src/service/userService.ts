import * as ServiceSpec from "../spec/service"
import * as mongodb from "mongodb"
import { Errors } from "../errors"
import { DbPaginateQuery } from "../util/dbPaginateQuery"
import { transform } from "async";

export class UserService extends ServiceSpec.Service implements ServiceSpec.UserService {
    readonly name = "UserService"
    dependencies = ["MongodbService", "IncrementalIdService"]
    private UserCollection: mongodb.Collection
    private UserPaginator: DbPaginateQuery<User>
    initialize(done) {
        this.UserCollection = this.services.MongodbService.db.collection("user")
        this.UserPaginator = new DbPaginateQuery(this.UserCollection)
        this.UserCollection.createIndex({ id: 1 }, { unique: true })
        this.services.IncrementalIdService.ensure({ name: "user", offset: 1000 }, () => {
        })
        done()
    }
    createUser(
        option: Partial<User>, callback: Callback<User>
    ) {

    }
    updateUser(option: {
        id: ID,
        updates: Partial<User>
    }, callback: Callback<User>) {

    }
    getUserById(option: {
        id: ID
    }, callback: Callback<User>) {
        this.UserCollection.findOne({ id: option.id }, (err, result) => {
            if (err || !result) {
                callback(new Errors.NotFound(), null)
                return
            }
            callback(null, result)
        })
    }
    getUser(
        option: {
            username: string
            password: string
        },
        callback: Callback<User>
    ) {
        this.UserCollection.findOne(
            {
                password: option.password,
                username: option.username
            },
            (err, user) => {
                if (err || !user) {
                    callback(new Errors.NotFound())
                    return
                }
                callback(null, user)
            }
        )
    }


    createTestData(callback: Callback<boolean>) {
        let users = [
            {
                id: "1",
                username: "worker1",
                password: "worker1",
                role: "worker",
            }, {
                id: "2",
                username: "worker2",
                password: "worker2",
                role: "worker",
            }, {
                id: "3",
                username: "worker3",
                password: "worker3",
                role: "worker",
            }, {
                id: "4",
                username: "worker4",
                password: "worker4",
                role: "worker",
            }, {
                id: "5",
                username: "worker5",
                password: "worker5",
                role: "worker",
            }, {
                id: "6",
                username: "worker6",
                password: "worker6",
                role: "worker",
            }, {
                id: "7",
                username: "worker7",
                password: "worker7",
                role: "worker",
            }, {
                id: "8",
                username: "worker8",
                password: "worker8",
                role: "worker",
            }, {
                id: "9",
                username: "worker9",
                password: "worker9",
                role: "worker",
            }, {
                id: "10",
                username: "worker10",
                password: "worker10",
                role: "worker",
            }, {
                id: "11",
                username: "checker1",
                password: "checker1",
                role: "checker",
            }, {
                id: "12",
                username: "checker2",
                password: "checker2",
                role: "checker",
            }, {
                id: "13",
                username: "checker3",
                password: "checker3",
                role: "checker",
            }, {
                id: "14",
                username: "checker4",
                password: "checker4",
                role: "checker",
            }, {
                id: "15",
                username: "checker5",
                password: "checker5",
                role: "checker",
            }, {
                id: "16",
                username: "checker6",
                password: "checker6",
                role: "checker",
            }, {
                id: "17",
                username: "checker7",
                password: "checker7",
                role: "checker",
            }, {
                id: "18",
                username: "checker8",
                password: "checker8",
                role: "checker",
            }, {
                id: "19",
                username: "checker9",
                password: "checker9",
                role: "checker",
            }, {
                id: "20",
                username: "checker10",
                password: "checker10",
                role: "checker",
            }, {
                id: "111",
                username: "admin1",
                password: "admin1",
                role: "admin",
            }, {
                id: "admin",
                username: "admin",
                password: "admin",
                role: "admin",
            }
        ]
        this.UserCollection.drop(() => {
            this.UserCollection.insertMany(users, (err, result) => {
                if (err) {
                    console.log(err)
                    callback(err)
                    return
                }
                callback(null, true)
            })
        })
    }
}