"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ServiceSpec = require("../spec/service");
var errors_1 = require("../errors");
var dbPaginateQuery_1 = require("../util/dbPaginateQuery");
var UserService = /** @class */ (function (_super) {
    __extends(UserService, _super);
    function UserService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "UserService";
        _this.dependencies = ["MongodbService", "IncrementalIdService"];
        return _this;
    }
    UserService.prototype.initialize = function (done) {
        this.UserCollection = this.services.MongodbService.db.collection("user");
        this.UserPaginator = new dbPaginateQuery_1.DbPaginateQuery(this.UserCollection);
        this.UserCollection.createIndex({ id: 1 }, { unique: true });
        this.services.IncrementalIdService.ensure({ name: "user", offset: 1000 }, function () {
        });
        done();
    };
    UserService.prototype.createUser = function (option, callback) {
    };
    UserService.prototype.updateUser = function (option, callback) {
    };
    UserService.prototype.getUserById = function (option, callback) {
        this.UserCollection.findOne({ id: option.id }, function (err, result) {
            if (err || !result) {
                callback(new errors_1.Errors.NotFound(), null);
                return;
            }
            callback(null, result);
        });
    };
    UserService.prototype.getUser = function (option, callback) {
        this.UserCollection.findOne({
            password: option.password,
            username: option.username
        }, function (err, user) {
            if (err || !user) {
                callback(new errors_1.Errors.NotFound());
                return;
            }
            callback(null, user);
        });
    };
    UserService.prototype.createTestData = function (callback) {
        var _this = this;
        var users = [
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
        ];
        this.UserCollection.drop(function () {
            _this.UserCollection.insertMany(users, function (err, result) {
                if (err) {
                    console.log(err);
                    callback(err);
                    return;
                }
                callback(null, true);
            });
        });
    };
    return UserService;
}(ServiceSpec.Service));
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map