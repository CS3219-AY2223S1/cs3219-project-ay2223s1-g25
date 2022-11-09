import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ProfileComponent from './views/Profile';
import { useAuth0 } from "@auth0/auth0-react";
import Room from './views/Room'
import {Box} from "@mui/material";
import ProtectedComponent from './components/ProtectedComponent';
import Dashboard from "./views/Dashboard";
import NavBar from "./components/NavBar";
import Loading from "./components/Loading";

function App() {
    const { isLoading, error } = useAuth0();

    if (error) {
      return <div>Oops... {error.message}</div>;
    }
  
    if (isLoading) {
      return <Loading />;
    }

    return (
    <Router>
        <div id="app" className="d-flex flex-column">
          <NavBar />
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                    <Routes>
                        <Route exact path="/" element={<Dashboard />} />
                        <Route path="/profile" element={<ProfileComponent />}/>
                        <Route path="/room" element={<ProtectedComponent component={Room} />}/>
                    </Routes>
            </Box>
        </div>
        </Router>
    );
}

export default App;
