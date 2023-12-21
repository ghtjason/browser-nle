import { ImageMedia } from "./Media";



export class LibStore {
    images: ImageMedia[]
    constructor() {
        this.images = []
    }

    addImage(file: File): void {
        const img = new ImageMedia(file)
        console.log(`pushing ${JSON.stringify(img)}`)
        this.images.push(img)
    }
}