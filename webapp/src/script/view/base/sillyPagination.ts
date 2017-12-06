export class SillyPagination extends R.Base.SillyPagination {
    pageIndexList: Leaf.List<PageIndexItem | PageEllipsisItem>
    value: PaginationDefinition = {
        pageIndex: 0,
        pageTotal: 1,
    }
    events = new Leaf.EventEmitter<{
        paging: number
    }>()
    constructor() {
        super()
    }
    setValue(value: PaginationDefinition) {
        let { pageTotal, pageIndex, pageSize, pageLimit, total } = value
        let ellipsis: number
        let pagination = this
        pageLimit = pageLimit || this.value.pageLimit || 5
        pageSize = pageSize || this.value.pageSize || 10
        this.VM.pageTotal = pageTotal
        this.VM.pageIndex = pageIndex + 1
        this.VM.pageTotalNumber = total;
        let pageIndexTotal = total - pageIndex * pageSize;
        this.VM.pageIndexNumber = pageIndexTotal < pageSize ? pageIndexTotal : pageSize
        this.pageIndexList.empty()
        this.value = { pageTotal, pageIndex, pageSize, pageLimit }

        if (pageTotal == 0) {
            this.VM.empty = true
            return
        }
        this.VM.empty = false

        function addIndexItems(start: number, end: number, current: number) {
            for (let index = start; index < end; index++) {
                let item = new PageIndexItem(index + 1)
                if (index == current) {
                    item.select()
                }
                item.events.listenBy(pagination, "click", () => {
                    pagination.events.emit("paging", index)
                })
                pagination.pageIndexList.push(item)
            }
        }
        function addEllipsisItem() {
            pagination.pageIndexList.push(new PageEllipsisItem())
        }

        ellipsis = pageTotal - pageLimit
        if (ellipsis <= 0) {
            addIndexItems(0, pageTotal, pageIndex)
        } else {
            if (pageIndex < pageLimit - 1) {
                addIndexItems(0, pageLimit, pageIndex)
                addEllipsisItem()
            } else if (pageTotal - pageIndex < pageLimit) {
                addEllipsisItem()
                addIndexItems(pageTotal - pageLimit, pageTotal, pageIndex)
            } else {
                addEllipsisItem()
                addIndexItems(pageIndex - 1, pageIndex + pageLimit - 2, pageIndex)
                addEllipsisItem()
            }
        }
    }
    getValue() {
        return this.value
    }
    clear() {
        this.pageIndexList.forEach((item) => {
            if (isPageIndexItem(item)) {
                item.select(false)
            }
        })
    }
    onClickGoFirst() {
        this.events.emit("paging", 0)
    }
    onClickGoLast() {
        let pageIndex = this.getValue().pageTotal - 1
        this.events.emit("paging", pageIndex)
    }
    onClickGoPrev() {
        let pageIndex = this.getValue().pageIndex - 1
        if (pageIndex < 0) {
            return
        }
        this.events.emit("paging", pageIndex)
    }
    onClickGoNext() {
        let pageIndex = this.getValue().pageIndex + 1
        let pageTotal = this.getValue().pageTotal
        if (pageIndex >= pageTotal) {
            return
        }
        this.events.emit("paging", pageIndex)
    }
}

class PageIndexItem extends R.Pagination.PageIndexItem {
    events: Leaf.EventEmitter<{
        click,
        select: boolean
    }>
    constructor(index: number) {
        super()
        this.VM.index = `${index}`
    }
    select(selected: boolean = true) {
        this.VM.selected = selected
        this.events.emit("select", selected)
    }
    onClickNode() {
        this.events.emit("click")
    }
}
class PageEllipsisItem extends R.Pagination.PageEllipsisItem {
    constructor() {
        super()
    }
}

function isPageIndexItem(item: PageIndexItem | PageEllipsisItem): item is PageIndexItem {
    return (<PageIndexItem>item).select !== undefined
}

export type PaginationDefinition = {
    pageIndex: number,
    pageTotal?: number,
    pageSize?: number,
    pageLimit?: number,
    total?: number
}