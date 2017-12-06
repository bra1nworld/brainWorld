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
var SillyPagination = /** @class */ (function (_super) {
    __extends(SillyPagination, _super);
    function SillyPagination() {
        var _this = _super.call(this) || this;
        _this.value = {
            pageIndex: 0,
            pageTotal: 1,
        };
        _this.events = new Leaf.EventEmitter();
        return _this;
    }
    SillyPagination.prototype.setValue = function (value) {
        var pageTotal = value.pageTotal, pageIndex = value.pageIndex, pageSize = value.pageSize, pageLimit = value.pageLimit, total = value.total;
        var ellipsis;
        var pagination = this;
        pageLimit = pageLimit || this.value.pageLimit || 5;
        pageSize = pageSize || this.value.pageSize || 10;
        this.VM.pageTotal = pageTotal;
        this.VM.pageIndex = pageIndex + 1;
        this.VM.pageTotalNumber = total;
        var pageIndexTotal = total - pageIndex * pageSize;
        this.VM.pageIndexNumber = pageIndexTotal < pageSize ? pageIndexTotal : pageSize;
        this.pageIndexList.empty();
        this.value = { pageTotal: pageTotal, pageIndex: pageIndex, pageSize: pageSize, pageLimit: pageLimit };
        if (pageTotal == 0) {
            this.VM.empty = true;
            return;
        }
        this.VM.empty = false;
        function addIndexItems(start, end, current) {
            var _loop_1 = function (index) {
                var item = new PageIndexItem(index + 1);
                if (index == current) {
                    item.select();
                }
                item.events.listenBy(pagination, "click", function () {
                    pagination.events.emit("paging", index);
                });
                pagination.pageIndexList.push(item);
            };
            for (var index = start; index < end; index++) {
                _loop_1(index);
            }
        }
        function addEllipsisItem() {
            pagination.pageIndexList.push(new PageEllipsisItem());
        }
        ellipsis = pageTotal - pageLimit;
        if (ellipsis <= 0) {
            addIndexItems(0, pageTotal, pageIndex);
        }
        else {
            if (pageIndex < pageLimit - 1) {
                addIndexItems(0, pageLimit, pageIndex);
                addEllipsisItem();
            }
            else if (pageTotal - pageIndex < pageLimit) {
                addEllipsisItem();
                addIndexItems(pageTotal - pageLimit, pageTotal, pageIndex);
            }
            else {
                addEllipsisItem();
                addIndexItems(pageIndex - 1, pageIndex + pageLimit - 2, pageIndex);
                addEllipsisItem();
            }
        }
    };
    SillyPagination.prototype.getValue = function () {
        return this.value;
    };
    SillyPagination.prototype.clear = function () {
        this.pageIndexList.forEach(function (item) {
            if (isPageIndexItem(item)) {
                item.select(false);
            }
        });
    };
    SillyPagination.prototype.onClickGoFirst = function () {
        this.events.emit("paging", 0);
    };
    SillyPagination.prototype.onClickGoLast = function () {
        var pageIndex = this.getValue().pageTotal - 1;
        this.events.emit("paging", pageIndex);
    };
    SillyPagination.prototype.onClickGoPrev = function () {
        var pageIndex = this.getValue().pageIndex - 1;
        if (pageIndex < 0) {
            return;
        }
        this.events.emit("paging", pageIndex);
    };
    SillyPagination.prototype.onClickGoNext = function () {
        var pageIndex = this.getValue().pageIndex + 1;
        var pageTotal = this.getValue().pageTotal;
        if (pageIndex >= pageTotal) {
            return;
        }
        this.events.emit("paging", pageIndex);
    };
    return SillyPagination;
}(R.Base.SillyPagination));
exports.SillyPagination = SillyPagination;
var PageIndexItem = /** @class */ (function (_super) {
    __extends(PageIndexItem, _super);
    function PageIndexItem(index) {
        var _this = _super.call(this) || this;
        _this.VM.index = "" + index;
        return _this;
    }
    PageIndexItem.prototype.select = function (selected) {
        if (selected === void 0) { selected = true; }
        this.VM.selected = selected;
        this.events.emit("select", selected);
    };
    PageIndexItem.prototype.onClickNode = function () {
        this.events.emit("click");
    };
    return PageIndexItem;
}(R.Pagination.PageIndexItem));
var PageEllipsisItem = /** @class */ (function (_super) {
    __extends(PageEllipsisItem, _super);
    function PageEllipsisItem() {
        return _super.call(this) || this;
    }
    return PageEllipsisItem;
}(R.Pagination.PageEllipsisItem));
function isPageIndexItem(item) {
    return item.select !== undefined;
}
