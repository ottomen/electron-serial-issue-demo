import './App.css';
import {useSerialPortConnection} from './hooks/useSerialHandler';

function App() {
    const {openSerialConnection, closeSerialConnection} = useSerialPortConnection();


    return (
        <div className="App">
            <header className="App-header">
                <h1>Serial port handler</h1>

                <button id="serial-connect" onClick={openSerialConnection}>Connect to serial port</button>
                <button id="serial-disconnect" onClick={closeSerialConnection}>Disconnect from serial port</button>
            </header>
        </div>
    );
}

export default App;
