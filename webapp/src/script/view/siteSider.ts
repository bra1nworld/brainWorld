import { App } from "../app"

let isFirst = false;

export class SiteSider extends R.SiteSider {
    privilege: Privilege
    entryList: Leaf.List<Entry>
    constructor(privilege?: Privilege) {
        super()
        if (!privilege) {
            this.privilege = {
                pendingTask: true,
                annotatingTask: true,
                checkAnnotatedTask: true,
                doneTask: true,
                myAnnotatingTask: true,
                myAnnotatedTask: true,
                myCheckingTask: true,
                myCheckedTask: true,
                userManagement: true
            }
        } else {
            this.privilege = privilege
        }
        for (let data of SiteMap) {
            let exit = false;
            data.children.forEach(child => {
                if (this.privilege[child.name]) {
                    exit = true
                }
            })
            if (!exit) continue
            let entry = new Entry(this.privilege, data)
            entry.events.listenBy(this, "expanding", () => {
                this.entryList.forEach((item) => {
                    item.unexpand()
                })
            })
            this.entryList.push(entry)
        }
    }
}


export class Entry extends R.SiteSider.EntryListItem {
    events = new Leaf.EventEmitter<{
        expanding
        expanded
        unexpanded
    }>()
    subEntryList: Leaf.List<SubEntry>
    constructor(protected privilege: Privilege, protected data: MenuItem) {
        super()
        this.VM.name = this.data.displayText
        App.events.listenBy(this, "initialized", () => {
            for (let child of data.children) {
                this.addChild(child)
            }
        })
    }
    addChild(data: SubMenuItem) {
        let subEntry = new SubEntry(this.privilege, data)
        if (!data.persisted) {
            if (!this.privilege[data.name]) {
                return
            }
        }
        if (!isFirst) {
            isFirst = true;
            data.selected = true;
        }

        if (data.selected) {
            subEntry.select()
            this.expand()
        }
        this.subEntryList.push(subEntry)
        subEntry.events.listenBy(this, "selecting", () => {
            this.unselectChilds()
        })
        if (subEntry.VM.available) {
            this.VM.available = true
        }
    }
    unselectChilds() {
        this.subEntryList.forEach((item: SubEntry) => {
            item.unselect()
        })
    }
    expand() {
        this.events.emit("expanding")
        this.unselectChilds()
        this.VM.expanded = true
        this.events.emit("expanded")
    }
    unexpand() {
        this.VM.expanded = false
        this.events.emit("unexpanded")
    }
    onClickExpand() {
        this.expand()
    }
}

export class SubEntry extends R.SiteSider.EntryListItem.SubEntryListItem {
    events = new Leaf.EventEmitter<{
        selecting
        selected
        unselected
    }>()
    constructor(protected privilege: Privilege, protected data: SubMenuItem) {
        super()
        this.VM.name = this.data.displayText
        this.VM.available = this.privilege[this.data.name]
    }
    select() {
        this.events.emit("selecting")
        App.openEntry(this.data.name)
        this.VM.selected = true
        this.events.emit("selected")
    }
    unselect() {
        this.VM.selected = false
        this.events.emit("unselected")
    }
    onClickNode() {
        this.select()
    }
}


type MenuItem = {

    displayText: string
    children?: SubMenuItem[]
}
type SubMenuItem = {
    name: keyof Privilege
    displayText: string
    selected?: boolean
    persisted?: boolean
}

const SiteMap: MenuItem[] = [
    {
        displayText: "标注任务",
        children: [{
            name: "pendingTask",
            displayText: "未分配",
        }, {
            name: "annotatingTask",
            displayText: "标注阶段",
        }, {
            name: "checkAnnotatedTask",
            displayText: "复查阶段",
        }, {
            name: "doneTask",
            displayText: "已完成",
        }, {
            name: "myAnnotatingTask",
            displayText: "我的待标注任务",
        }, {
            name: "myAnnotatedTask",
            displayText: "我的已标注任务",
        }]
    },
    {
        displayText: "复查任务",
        children: [{
            name: "myCheckingTask",
            displayText: "我的待复查任务",
        }, {
            name: "myCheckedTask",
            displayText: "我的已复查任务",
        },]
    },
    {
        displayText: "系统管理",
        children: [{
            name: "userManagement",
            displayText: "用户管理",
        }]
    }
]


