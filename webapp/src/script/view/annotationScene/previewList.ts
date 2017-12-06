export class PreviewList extends R.AnnotationScene.PreviewList {
    previewList
    activeIndex: number
    previewListCount = 9
    events: Leaf.EventEmitter<{
        click
    }>
    constructor(private anntationFrameIndex: number, private frameCount: number) {
        super()
        this.render(anntationFrameIndex, frameCount)
    }
    render(frameIndex: number, frameCount: number) {
        if (this.previewList.length > 0) this.previewList.empty()
        this.activeIndex = frameIndex
        let frameArray = []
        frameArray.push(this.anntationFrameIndex.toString())
        for (let i = 0; i < 9; i++) {
            let index = frameIndex - (this.previewListCount - 1) / 2 + i
            if (index >= 0 && index <= frameCount - 1) {
                frameArray.push(index)
            } else {
                frameArray.push("")
            }
        }
        frameArray.push(this.anntationFrameIndex.toString())
        frameArray.forEach((index) => {
            let item = new PreviewListItem(index)
            this.previewList.push(item)
            item.node.onclick = () => {
                let preFrameIndex;
                this.previewList.forEach(previewItem => {
                    if (previewItem.isActived) {
                        preFrameIndex = previewItem.index
                        previewItem.unActive()
                    }
                    previewItem.unActiveCurrentIndex()
                })
                item.active()
                this.render(item.index, frameCount)
                this.events.emit("click", item.index)
            }
        })
        //active
        this.previewList[frameArray.indexOf(frameIndex)].active()

        //activeCurrentIndex
        if (frameArray.indexOf(this.anntationFrameIndex) > -1) {
            this.previewList[frameArray.indexOf(this.anntationFrameIndex)].activeCurrentIndex()
        } else {
            if (frameIndex > this.anntationFrameIndex) {
                this.previewList[0].activeCurrentIndex()
            } else {
                this.previewList[this.previewList.length - 1].activeCurrentIndex()
            }
        }
    }
    onClickNextPage() {
        if (this.activeIndex == this.frameCount - 1) {
            return
        }
        this.render(this.activeIndex + 1, this.frameCount)
        //this.activeIndex has changed
        this.events.emit("click", this.activeIndex)
    }
    onClickPrePage() {
        if (this.activeIndex == 0) {
            return
        }
        this.render(this.activeIndex - 1, this.frameCount)
        //this.activeIndex has changed
        this.events.emit("click", this.activeIndex)
    }
}

export class PreviewListItem extends R.AnnotationScene.PreviewList.PreviewListItem {
    events: Leaf.EventEmitter<{
        click,
    }>
    isActived: boolean
    index: number
    constructor(index: number | string) {
        super()
        if (typeof (index) !== "string") {
            this.index = index
            this.VM.frameIndex = index.toString()
        } else {
            this.index = Number(index)
            this.VM.frameIndex = ""
        }
    }
    onClickNode() {
        this.events.emit("click")
    }
    active() {
        this.VM.active = true
        this.isActived = true
    }
    unActive() {
        this.VM.active = false
        this.isActived = false
    }
    activeCurrentIndex() {
        this.VM.currentIndexNumber = true
    }
    unActiveCurrentIndex() {
        this.VM.currentIndexNumber = false
    }
}