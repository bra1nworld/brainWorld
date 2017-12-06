export class Pagination extends R.Pagination {
    pageIndexList: Leaf.List<PageIndexItem | PageEllipsisItem>
    value: PaginationDefinition = {
        pageIndex: 0,
        pageTotal: 1
    }
    constructor() {
        super()
    }
    setValue(value: PaginationDefinition) {
        let { pageTotal, pageIndex, pageSize, pageLimit } = value
        let ellipsis: number
        let pagination = this
        pageLimit = pageLimit || this.value.pageLimit || 5
        pageSize = pageSize || this.value.pageSize || 10
        this.VM.pageTotal = pageTotal
        this.VM.pageIndex = pageIndex + 1
        this.pageIndexList.empty()
        this.value = { pageTotal, pageIndex, pageSize, pageLimit }

        function addIndexItems(start: number, end: number, current: number) {
            for (let index = start; index < end; index++) {
                let item = new PageIndexItem(index + 1)
                if (index == current) {
                    item.select()
                }
                item.events.listenBy(this, "click", () => {
                    pagination.handleClickIndex(index)
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
    public onClickGoFirst() {
    }
    public onClickGoLast() {
    }
    public onClickGoPrev() {
    }
    public onClickGoNext() {
    }
    public handleClickIndex(pageIndex: number) {
        console.log(pageIndex)
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
    pageTotal: number,
    pageIndex: number,
    pageSize?: number,
    pageLimit?: number
}