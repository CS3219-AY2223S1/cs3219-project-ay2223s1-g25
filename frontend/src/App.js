import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import SignupPage from './components/SignupPage';
import Chat from './components/Chat';
import {Box} from "@mui/material";

import io from 'socket.io-client';

const socket = io.connect('http://localhost:8001');
const room = "room";

function App() {
    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/signup" />}></Route>
                        <Route path="/signup" element={<SignupPage/>}/>
                        <Route path="/chat" element={<Chat socket={socket} room={room} />}/>
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
