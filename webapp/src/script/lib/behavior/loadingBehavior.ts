export class LoadingBehavior {
    constructor(private widget: {
        VM: {
            loading?: boolean
        }
    }) {
    }
    public isLoading = false
    start() {
        this.widget.VM.loading = true
        this.isLoading = true
    }
    finish() {
        this.widget.VM.loading = false
        this.isLoading = false
    }
    reset() {
        this.finish()
    }
}
