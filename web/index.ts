declare global {
    interface Navigator {
        getMedia: any;
        webkitGetUserMedia: any;
        mozGetUserMedia: any;
        msGetUserMedia: any;
    }

    interface Window {
        webkitURL: any;
    }

    interface HTMLVideoElement {
        mozSrcObject: any;
    }
}

export module AppLogic {

    export class App {

        private streaming: boolean = false;
        private video: HTMLVideoElement = document.querySelector('#video') as HTMLVideoElement;
        private cover: HTMLElement = document.querySelector('#cover') as HTMLElement;
        private canvas: HTMLCanvasElement = document.querySelector('#canvas') as HTMLCanvasElement;
        private photo: HTMLImageElement = document.querySelector('#photo') as HTMLImageElement;
        private startbutton: HTMLButtonElement = document.querySelector('#startbutton') as HTMLButtonElement;
        private width: number = 320;
        private height: number = 0;

        constructor() {
            navigator.getMedia = (navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia);

            navigator.getMedia(
                {
                    video: true,
                    audio: false
                },
                (stream: MediaStream) => {
                    if (navigator.mozGetUserMedia) {
                        this.video.mozSrcObject = stream;
                    } else {
                        var vendorURL = window.URL || window.webkitURL;
                        this.video.src = vendorURL.createObjectURL(stream);
                    }
                    this.video.play();
                },
                function (err: Error) {
                    console.log("An error occured! " + err);
                }
            );

            this.video.addEventListener('canplay', (ev) => {
                if (!this.streaming) {
                    this.height = this.video.videoHeight / (this.video.videoWidth / this.width);
                    this.video.setAttribute('width', this.width.toString());
                    this.video.setAttribute('height', this.height.toString());
                    this.canvas.setAttribute('width', this.width.toString());
                    this.canvas.setAttribute('height', this.height.toString());
                    this.streaming = true;
                }
            }, false);

            this.startbutton.addEventListener('click', (ev) => {
                this.takepicture();
                ev.preventDefault();
            }, false);

        }

        private takepicture() {
                this.canvas.width = this.width;
                this.canvas.height = this.height;
                this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.width, this.height);
                var data = this.canvas.toDataURL('image/png');
                this.photo.setAttribute('src', data);
            }

    }
}

const app = new AppLogic.App();