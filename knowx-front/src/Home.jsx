import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [offers, setOffers] = useState([]);
    const navigate = useNavigate();

    // Vérification du token et de déconnexion
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await axios.get('http://localhost:3001/offers');
                setOffers(res.data);
            } catch (err) {
                console.error('Error loading offers:', err);
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            }
        };
        fetchOffers();
    }, [navigate]);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Available Offers</h1>
                <div>
                    {/* Profile button */}
                    <button 
                        onClick={() => navigate('/profile')}
                        style={{ 
                            padding: "8px 16px", 
                            backgroundColor: "#4CAF50", 
                            color: "white", 
                            border: "none", 
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginRight: "10px"
                        }}
                    >
                        👤 Profile
                    </button>
                    
                    {/* Logout button */}
                    <button 
                        onClick={handleLogout}
                        style={{ 
                            padding: "8px 16px", 
                            backgroundColor: "#ff4444", 
                            color: "white", 
                            border: "none", 
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <button
                onClick={() => navigate('/create-offer')}
                style={{ marginBottom: '20px', padding: '10px' }}
            >
                ➕ Create an offer
            </button>
            
            {offers.length === 0 ? (
                <p>No offers available at this time.</p>
            ) : (
                offers.map(offer => (
                    <div key={offer.id} style={{
                        border: '1px solid #ccc',
                        padding: '10px',
                        margin: '10px'
                    }}>
                        <h3>{offer.title}</h3>
                        <p><strong>Offered skills:</strong> {offer.skills_offered?.join(', ')}</p>
                        <p><strong>Description:</strong> {offer.description}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default Home;
