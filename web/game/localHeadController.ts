declare global {
    interface Navigator {
        getMedia: any;
        webkitGetUserMedia: any;
        mozGetUserMedia: any;
        msGetUserMedia: any;
    }

    interface Window {
        webkitURL: any;
        ctracker: any;
    }

    interface HTMLVideoElement {
        mozSrcObject: any;
    }
}

declare var clm: any;

import { FaceAttributes, Action, Direction } from '../types'
import { FaceApi } from '../faceApi'
import { Utils } from './utils'

export class HeadTrackingInfo {
    leftEye: number[] = [0, 0];
    rightEye: number[] = [0, 0];
    leftbro: number[] = [0, 0];
    rightbro: number[] = [0, 0];
    upperLip: number[] = [0, 0];
    lowerLip: number[] = [0, 0];
}

export class HeadController {
    private tempCanvas: HTMLCanvasElement;
    private video: HTMLVideoElement;
    private debug: HTMLParagraphElement;
    private width: number = 320;
    private height: number = 0;
    private pollingFrequencyInSec: number = 0.5;
    private streaming: boolean = false;
    private running: boolean = false;
    private context: any = null;
    public roll: number = 0;
    public leftbroheight: number = 0;
    public rightbroheight: number = 0;
    public lipsheight: number = 0;
    private headTrackingInfo: HeadTrackingInfo;
    private tracker: any;

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
        this.headTrackingInfo = new HeadTrackingInfo();
        this.tracker = new clm.tracker();

        this.init();
    }

    public start(): void {
        this.running = true;
        this.headTracker();
    }

    public stop(): void {
        this.running = false;
    }

    private updateEyeInfo() {
        var positions = this.tracker.getCurrentPosition();
        if (positions) {
            this.headTrackingInfo.leftEye = positions[32];
            this.headTrackingInfo.rightEye = positions[27];
            this.headTrackingInfo.leftbro = positions[17];
            this.headTrackingInfo.rightbro = positions[21];
            this.headTrackingInfo.upperLip = positions[60];
            this.headTrackingInfo.lowerLip = positions[57];
            this.debug.innerText =
                "RightEye: [" + Math.round(positions[27][0]) + "," + Math.round(positions[27][1]) +
                "] LeftEye [" + Math.round(positions[32][0]) + "," + Math.round(positions[32][1]) +
                "] RightBro [" + Math.round(positions[21][0]) + "," + Math.round(positions[21][1]) +
                "] Leftbro [" + Math.round(positions[17][0]) + "," + Math.round(positions[17][1]) + "]";
        }
        else {
            this.debug.innerText = "Nothing";
        }
    }

    private headTracker() {
        if (this.running) {
            this.updateEyeInfo();
            var deltaX = this.headTrackingInfo.leftEye[0] - this.headTrackingInfo.rightEye[0];
            var deltaY = this.headTrackingInfo.leftEye[1] - this.headTrackingInfo.rightEye[1];
            var roll = Math.atan2(deltaY, deltaX) * Math.PI / 3;
            this.roll = roll;

            this.leftbroheight = Utils.ComputeDistance(this.headTrackingInfo.leftbro[0], this.headTrackingInfo.leftbro[1], this.headTrackingInfo.leftEye[0], this.headTrackingInfo.leftEye[1]);
            this.rightbroheight = Utils.ComputeDistance(this.headTrackingInfo.rightbro[0], this.headTrackingInfo.rightbro[1], this.headTrackingInfo.rightEye[0], this.headTrackingInfo.rightEye[1]);
            this.lipsheight = Utils.ComputeDistance(this.headTrackingInfo.upperLip[0], this.headTrackingInfo.upperLip[1], this.headTrackingInfo.lowerLip[0], this.headTrackingInfo.lowerLip[1]);
        }
        setTimeout(() => { this.headTracker(); }, this.pollingFrequencyInSec * 10);
    }

    private async getFaceAttributes(): Promise<FaceAttributes> {
        this.tempCanvas.width = this.width;
        this.tempCanvas.height = this.height;

        return new Promise<FaceAttributes>(
            async (resolve) => {
                if (!this.context) {
                    this.context = this.tempCanvas.getContext('2d');
                }
                this.context.drawImage(this.video, 0, 0, this.width, this.height);
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

                this.tracker.init();
                this.tracker.start(this.video);
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