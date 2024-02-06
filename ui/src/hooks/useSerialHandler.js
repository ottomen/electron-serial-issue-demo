import {useCallback, useEffect, useRef} from 'react';

import {serialHandler} from '../api/SerialHandler';

export const useSerialPortConnection = () => {
    const serial = useRef(null);

    useEffect(() => {
        serial.current = serialHandler;

        return () => {
            serial.current?.close();
        };
    }, []);

    const openConnection = useCallback(async (callback) => {
        if (!serial.current) return;

        const port = await serial.current.open();

        if (port) {
            serial.current?.read(callback);
        }
    }, []);

    const closeConnection = () => {
        serial?.current?.close();
    };

    return {
        openSerialConnection: openConnection,
        closeSerialConnection: closeConnection,
    };
};
