import { Dropzone } from 'dropzone';
declare global {
    interface HTMLElement {
        dropzone?: Dropzone;
    }
}