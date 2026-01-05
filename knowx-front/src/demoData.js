export const DEMO_CREDENTIALS = {
    // Pour le login
    login: { 
        email: 'alice@knowx.com', 
        password: 'password123' 
    },
    
    // Pour l'inscription (email unique à chaque fois)
    signup: { 
        first_name: 'Clara', 
        last_name: 'Clark', 
        email: `clara${Date.now()}@knowx.com`, // ← Unique grâce à timestamp
        password: 'password123' 
    },
    
    // Données pour créer une demande
    request: {
        title: "Help needed with Python data analysis",
        skills_offered: ["Python", "Pandas", "Data Visualization"],
        description: "I'm working on a data analysis project using Python and need assistance cleaning and visualizing a large dataset. Familiarity with pandas, matplotlib, and handling CSV/JSON data is a plus."
    }
};
