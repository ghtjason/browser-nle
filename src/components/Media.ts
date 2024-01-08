export abstract class BaseMedia {
  name: string;
  size: number;
  objectURL: string;
  abstract thumbnailURL: string;
  abstract width: number;
  abstract height: number;
  abstract element: HTMLImageElement | HTMLVideoElement;

  constructor(file: File) {
    this.name = file.name;
    this.size = file.size;
    this.objectURL = URL.createObjectURL(file);
  }
}

function drawThumbnail(
  media: CanvasImageSource,
  mediaObject: BaseMedia,
  updateArray: (arg0: BaseMedia) => void
) {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ar = mediaObject.width / mediaObject.height;
  let dW = 1280;
  let dH = 720;
  if (ar >= 16 / 9) dW = 720 * ar;
  else dH = 1280 / ar;
  canvas.getContext("2d")?.drawImage(media, 0, 0, dW, dH);
  canvas.toBlob(
    (blob) => {
      if (!blob) return;
      mediaObject.thumbnailURL = URL.createObjectURL(blob);
      updateArray(mediaObject);
    },
    "image/jpeg",
    0.8
  );
}

export class ImageMedia extends BaseMedia {
  thumbnailURL!: string;
  width!: number;
  height!: number;
  element!: HTMLImageElement;

  constructor(file: File, updateArray: (arg0: BaseMedia) => void) {
    super(file);
    const img = new Image();
    img.onload = () => {
      this.element = img;
      this.width = img.naturalWidth;
      this.height = img.naturalHeight;
      drawThumbnail(img, this, updateArray);
    };
    img.src = this.objectURL;
  }
}

export class VideoMedia extends BaseMedia {
  thumbnailURL!: string;
  width!: number;
  height!: number;
  duration!: number;
  element!: HTMLVideoElement;

  constructor(file: File, updateArray: (arg0: BaseMedia) => void) {
    super(file);
    const video = document.createElement("video");
    video.addEventListener(
      "loadeddata",
      () => {
        video.width = video.videoWidth;
        video.height = video.videoHeight;
        this.element = video;
        this.width = video.videoWidth;
        this.height = video.videoHeight;
        this.duration = video.duration;
        drawThumbnail(video, this, updateArray);
      },
      { once: true }
    );
    video.src = this.objectURL;
  }
}

export abstract class MediaTimeline {
  start: number = 0;
  abstract end: number;
  x: number = 0;
  y: number = 0;
  angle: number = 0;
  scaleX: number = 1;
  scaleY: number = 1;
  flipX: boolean = false;
  flipY: boolean = false;
  fabricObject: fabric.Object | null = null;
  abstract media: BaseMedia;
  constructor() {}
}

export class ImageMediaTimeline extends MediaTimeline {
  end: number = 4000;
  media: ImageMedia;
  constructor(img: ImageMedia) {
    super();
    this.media = img;
  }
}

export class VideoMediaTimeline extends MediaTimeline {
  end: number;
  media: VideoMedia;
  offsetStart: number;
  constructor(vid: VideoMedia) {
    super();
    this.media = vid;
    this.end = vid.duration * 1000;
    this.offsetStart = 0;
  }
}
