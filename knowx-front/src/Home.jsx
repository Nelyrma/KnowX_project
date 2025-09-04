import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Home = () => {
    const [offers, setOffers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await axios.get('http://localhost:3001/offers');
                setOffers(res.data);
            } catch (err) {
                console.error('Error loading offers:', err);
            }
        };
        fetchOffers();
    }, []);

    return (
        <div>
            <h1>Available Offers</h1>
            <button
                onClick={() => navigate('/create-offer')}
                style={{ marginBottom: '20px', padding: '10px' }}
            >
                Create an offer
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
