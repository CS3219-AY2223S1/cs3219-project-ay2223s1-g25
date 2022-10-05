import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import DifficultySelection from './components/DifficultySelection';
import SignupPage from './components/SignupPage';
import ChatBox from './components/ChatBox';
import Room from './components/Room'
import {Box} from "@mui/material";

function App() {
    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/signup" />}></Route>
                        <Route path="/signup" element={<SignupPage/>}/>
                        <Route path="/chatbox" element={<ChatBox/>}/>
                        <Route path="/difficulty" element={<DifficultySelection />}/>
                        <Route path="/room" element={<Room />}/>
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
