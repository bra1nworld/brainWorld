declare namespace THREE {
    class PCDLoader {
        constructor()
        load(path: string, onSuccess: (mesh: THREE.PointCloud) => void)
    }
    class OrbitControls {
        public enabled: boolean
        public enableRotate: boolean
        public target: THREE.Vector3
        public minPolarAngle: number
        public maxPolarAngle: number
        update()
        getPolarAngle()
        getAzimuthalAngle()
        addEventListener(event: string, callback: Function)
        constructor(obj: THREE.Object3D, listeningInterface: HTMLElement)
    }
    //class TransformControls extends THREE.Mesh {
    //    constructor(camera: THREE.Camera, listeningInterface: HTMLElement)
    //    attach(mesh: THREE.Object3D)
    //    detach()
    //}
}
