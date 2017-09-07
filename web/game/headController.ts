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

import { FaceAttributes, Action, Direction } from '../types'
import { FaceApi } from '../faceApi'

export class HeadController {

    private tempCanvas: HTMLCanvasElement;
    private video: HTMLVideoElement;
    private debug: HTMLParagraphElement;
    private width: number = 320;
    private height: number = 0;
    private pollingFrequencyInSec: number = 1;
    private streaming: boolean = false;
    private running: boolean = false;

    private _direction: Direction;
    public get direction(): Direction {
        return this._direction;
    }

    private _action: Action;
    public get action(): Action {
        return this._action;
    }

    constructor(video: HTMLVideoElement, tempCanvas: HTMLCanvasElement, debug: HTMLParagraphElement) {
        this.video = video;
        this.tempCanvas = tempCanvas;
        this.debug = debug;
        this._action = Action.None;
        this._direction = Direction.None;
        this.init();
    }

    public start(): void {
        this.running = true;
        this.headTracker();
    }

    public stop(): void {
        this.running = false;
    }

    private async headTracker(): Promise<void> {
        if (this.running) {

            var faceAttr = await this.getFaceAttributes();
            if (faceAttr) {

                var roll = faceAttr.headPose.roll;
                var happiness = faceAttr.emotion.happiness;
                var anger = faceAttr.emotion.anger;

                if (roll > 5) {
                    this._direction = Direction.Left;
                }
                else if (roll < -5) {
                    this._direction = Direction.Right;
                }
                else {
                    this._direction = Direction.None;
                }

                if (happiness > 0.5 && happiness > anger) {
                    this._action = Action.Heal;
                }
                else if (happiness > 0.5 && happiness > anger) {
                    this._action = Action.Heal;
                }
                else {
                    this._action = Action.None;
                }
            }

            setTimeout(() => { this.headTracker(); }, this.pollingFrequencyInSec * 1000);
        }
    }

    private async getFaceAttributes(): Promise<FaceAttributes> {
        this.tempCanvas.width = this.width;
        this.tempCanvas.height = this.height;

        return new Promise<FaceAttributes>(
            async (resolve) => {
                this.tempCanvas.getContext('2d').drawImage(this.video, 0, 0, this.width, this.height);
                var faceResult = await FaceApi.detect(await this.toBlob(this.tempCanvas));

                if (faceResult.length > 0) {
                    var attr = faceResult[0].faceAttributes;
                    this.debug.innerText = `Pitch: ${attr.headPose.pitch}, Roll: ${attr.headPose.roll}, Yaw: ${attr.headPose.yaw}, Anger: ${attr.emotion.anger}, Happiness: ${attr.emotion.happiness}, Neutral: ${attr.emotion.neutral}, Smile: ${attr.smile}, Age: ${attr.age}`;
                    resolve(attr);
                } else {
                    this.debug.innerText = 'No face detected';
                    resolve(null);
                }
            });
    }

    private init() {
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
                this.tempCanvas.setAttribute('width', this.width.toString());
                this.tempCanvas.setAttribute('height', this.height.toString());
                this.streaming = true;
            }
        }, false);
    }

    private async toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
        return new Promise<Blob>(
            (resolve) => {
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/png');
            });
    }
}