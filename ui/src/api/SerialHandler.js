class SerialHandler {
    serial;
    port = null;
    reader = null;
    allowedVendors = [{
        usbVendorId: 0x0c2e,
    }];
    options = {
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        autoOpen: false,
    };

    constructor() {
        if (!this.isSupported) return;

        this.serial = navigator.serial;
    }

    get isSupported() {
        if (!navigator || !('serial' in navigator)) {
            console.error('Navigator Serial is not available');

            return false;
        }

        return true;
    }

    async open() {
        console.log('Serial port open request');

        if (!this.serial || this.port?.readable?.locked) return null;

        try {
            this.port = await this.serial.requestPort({filters: this.allowedVendors});

            // Close the port if it's already open by previous request
            // If the port was opened by other app, it will be locked and we can't open it
            if (this.port.readable) {
                await this.port.readable.cancel();
            }

            await this.port.open(this.options);

            const portInfo = this.port.getInfo();

            console.log(`Serial port is opened with device: ${JSON.stringify(portInfo)}`);

            return this.port;
        } catch (error) {
            return null;
        }
    }

    async read(callback) {
        console.log('Reading from serial port', {source: 'SerialHandler.read'});

        if (!this.port || !this.port.readable) {
            console.error('Serial API is not available', {source: 'SerialHandler.read'});
            return;
        }

        if (this.port.readable.locked) {
            console.error('Serial port is locked', {source: 'SerialHandler.read'});
            return;
        }

        while (this.port.readable) {
            try {
                this.reader = this.port.readable.getReader();

                const {value, done} = await this.reader.read();

                if (done) {
                    // Reader has been canceled.
                    break;
                }

                console.log(value);
                callback(value);
            } catch (error) {
                console.error('SerialHandler port read error', error);
            } finally {
                this.reader?.releaseLock();
            }
        }
    }

    async close() {
        if (!this.port) return;

        try {
            console.log('SerialHandler close port');

            if (this.reader) {
                await this.reader.cancel();
            }

            await this.port?.close();

            this.port = null;
            this.reader = null;
        } catch (error) {
            console.error('SerialHandler.close() error', error);
        }
    }
}

export const serialHandler = new SerialHandler();
