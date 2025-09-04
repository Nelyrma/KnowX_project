import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Profile from './Profile';
import Home from './Home';
import CreateOffer from './CreateOffer'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/home" element={<Home />} />
                <Route path="/create-offer" element={<CreateOffer />} />
            </Routes>
        </Router>
    );
}

export default App;
