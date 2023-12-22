export abstract class BaseMedia {
  name: string;
  size: number;
  objectURL: string;
  abstract thumbnailURL: string;
  abstract width: number;
  abstract height: number;

  constructor(file: File) {
    this.name = file.name;
    this.size = file.size;
    this.objectURL = URL.createObjectURL(file);
  }
}

export class ImageMedia extends BaseMedia {

  thumbnailURL!: string;
  width!: number;
  height!: number;

  constructor(file: File, updateArray: ((arg0: ImageMedia) => void)) {
    super(file);
    const img = new Image();
    img.onload = () => {
      this.width = img.naturalWidth;
      this.height = img.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = 1280;
      canvas.height = 720;
      const ar = this.width / this.height;
      let dW = 1280;
      let dH = 720;
      if (ar >= 16 / 9) dW = 720 * ar;
      else dH = 1280 / ar;
      canvas.getContext("2d")?.drawImage(img, 0, 0, dW, dH);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          this.thumbnailURL = URL.createObjectURL(blob);
          updateArray(this)
        },
        "image/jpeg",
        0.8
      );
    };
    img.src = this.objectURL;
  }

}
