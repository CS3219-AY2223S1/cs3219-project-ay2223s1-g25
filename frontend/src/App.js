import {BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter} from "react-router-dom";
import DifficultySelection from './components/DifficultySelection';
import SignupPage from './components/SignupPage';
import {Box} from "@mui/material";

function App() {
    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/signup" />}></Route>
                        <Route path="/signup" element={<SignupPage/>}/>
                        <Route path="/difficulty" element={<DifficultySelection />}/>
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
