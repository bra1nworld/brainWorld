const Ing = require("../../../native/build/Release/ingredient_backend.node") as Backend
export class BagProvider {
    constructor() {
        if (BagProvider.root) return BagProvider.root
        BagProvider.root = this
        return this
    }
    private readers: {
        [key: string]: BagReader
    } = {}
    cache(path: string) {
        if (!this.readers[path]) this.readers[path] = new BagReader(Ing.createDataset(this.bagConfig(path)))
    }
    get(path: string) {
        this.cache(path)
        return this.readers[path]
    }
    private bagConfig(path: string): string {
        return `{
    path: ${path},
    base_pose_topic: /novatel_data/inspvax,
    velodyne_packets_topic: /velodyne_packets,
    velodyne_calibration_path: /opt/ros/kinetic/share/velodyne_pointcloud/params/VLP16db.yaml
}`
    }
    gc() {
        let sorted = Object.keys(this.cache).map(key => this.cache[key]).sort((a, b) => a.lastUsed - b.lastUsed)
        // Do the GC
    }
    static root: BagProvider
}

export class BagReader {
    public readonly index = this.dataset.indexSequentially()
    public length = -1
    public readonly packName = "/velodyne_packets"
    constructor(public readonly dataset: Backend.Dataset) {
        this.lastUsed = Date.now()
    }
    getLength(): number {
        this.lastUsed = Date.now()
        if (this.length >= 0) return this.length
        console.log("Get length before index", "???")
        this.length = this.index.size(this.packName)
        return this.length
    }
    getFrame(index: number): FrameReader {
        this.lastUsed = Date.now()
        return new FrameReader(this, index)
    }
    lastUsed: number = Date.now()
}

export class FrameReader {
    constructor(public readonly bagReader: BagReader, public readonly offset: number) {
    }
    getPoints(name?: string): Point[] {
        let buffer = this.bagReader.index.at(name || this.bagReader.packName, this.offset)
        let size = buffer.readUInt32LE(0)
        let step = buffer.readUInt32LE(4)
        let pts: Point[] = []
        for (let i = 0; i < size; i++) {
            pts.push(this.getPoint(buffer, i, step))
        }
        return pts
    }
    private getPoint(buffer: Buffer, i: number, step: number): Vector3 {
        const headerSize = 8
        const fieldSize = 4
        let dimensions = [0, 0, 0]
        let [x, y, z] = dimensions.map((v, index) => {
            return buffer.readFloatLE(headerSize + i * step + fieldSize * index)
        })
        return {
            x, y, z
        }
    }
}

export interface Vector3 {
    x: number
    y: number
    z: number
}

interface Backend {
    createDataset(config: string): Backend.Dataset
}

declare namespace Backend {
    export class Dataset {
        indexSequentially(): DataIndex
    }
    export class DataIndex {
        size(name: string): number
        at(name: string, offset: number): Buffer
    }
}