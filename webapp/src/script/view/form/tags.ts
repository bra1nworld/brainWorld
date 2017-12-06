import { Field } from "../..//lib/component/formTemplate"
export class Tags extends R.Form.Tags implements Field<string[]> {
    constructor(option: {
        name: string
        displayName: string
    }) {
        super()
        this.name = option.name
        this.displayName = option.displayName
        this.VM.displayName = option.displayName
    }
    onChildAddTagList(child: Tag) {
        child.events.listenBy(this, "remove", () => {
            this.tagList.removeItem(child)
        })
    }
    onChildRemoveTagList(child: Tag) {
        child.events.stopListenBy(this)
    }
    onKeyupInput(e) {
        let splitterCode = [
            Leaf.Key.enter, Leaf.Key.comma, Leaf.Key.space
        ]
        if (splitterCode.indexOf(e.which) >= 0) {
            let value = this.UI.input.value.trim()
            for (let tag of this.tagList.toArray()) {
                if (tag.name === value) return
            }
            this.applyInput()
            return
        }
    }

    onKeydownInput(e) {
        if (e.which === Leaf.Key.backspace && !this.UI.input.value) {
            this.tagList.pop()
        }
    }
    applyInput() {
        const value = this.UI.input.value.trim()
        this.tagList.push(new Tag(value))
        this.UI.input.value = ""
    }
    public tags: string[] = []
    name: string
    displayName: string
    getValue() {
        return this.tagList.map(item => item.name)
    }
    setValue(tags: string[]) {
        this.tagList.length = 0
        for (let tag of tags) {
            this.tagList.push(new Tag(tag))
        }
    }
    tagList: Leaf.List<Tag>
}

class Tag extends R.Form.Tags.TagListItem {
    constructor(public readonly name: string) {
        super()
        this.VM.name = name
    }
    events = new Leaf.EventEmitter<{
        remove: Tag
    }>()
    onClickNode() {
        this.events.emit("remove", this)
    }
}
