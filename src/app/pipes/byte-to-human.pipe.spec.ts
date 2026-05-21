import { ByteToHumanPipe } from './byte-to-human.pipe';

describe('ByteToHumanPipe', () => {
    it('create an instance', () => {
        const pipe = new ByteToHumanPipe();
        expect(pipe).toBeTruthy();
    });
});
