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
    "image/webp",
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

async function drawAudioFromVideo(file: File) {
  const height = 200;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const margin = 0;
  const chunkSize = 1000;

  const ac = new AudioContext();
  const centerHeight = Math.ceil(height / 2);
  const scaleFactor = (height - margin * 2) / 2;

  const buffer = await file.arrayBuffer();
  function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
        },
        "image/webp",
        1
      );
    });
  }
  try {
    const audioBuffer = await ac.decodeAudioData(buffer);
    const float32Array = audioBuffer.getChannelData(0);

    const array = [];

    let i = 0;
    const length = float32Array.length;
    while (i < length) {
      array.push(
        float32Array.slice(i, (i += chunkSize)).reduce(function (total, value) {
          return Math.max(total, Math.abs(value));
        })
      );
    }
    canvas.width = Math.ceil(float32Array.length / chunkSize + margin * 2);
    canvas.height = height;
    for (const [i, value] of array.entries()) {
      const x = i;
      ctx!.strokeStyle = "white";
      ctx!.beginPath();
      ctx!.moveTo(x, centerHeight - value * scaleFactor);
      ctx!.lineTo(x, centerHeight + value * scaleFactor);
      ctx!.stroke();
    }

    const blob = await toBlob(canvas);
    return URL.createObjectURL(blob);
  } catch {
    return ""; // no audio
  }
}

export class VideoMedia extends BaseMedia {
  thumbnailURL!: string;
  width!: number;
  height!: number;
  duration!: number;
  element!: HTMLVideoElement;
  audioWaveform!: string;

  constructor(file: File, updateArray: (arg0: BaseMedia) => void) {
    super(file);
    drawAudioFromVideo(file).then((url) => {
      this.audioWaveform = url;
    });
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
        video.onseeked = () => {
          drawThumbnail(video, this, updateArray);
        };
        video.currentTime = video.duration / 2;
      },
      { once: true }
    );
    video.src = this.objectURL;
  }
}

export abstract class MediaTimeline {
  start: number = 0;
  abstract end: number;
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
