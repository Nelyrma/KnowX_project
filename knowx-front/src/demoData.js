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
        title: "Need help with React Native",
        skills_offered: ["React Native", "JavaScript", "Mobile Development"],
        description: "I'm building a mobile app with React Native and need help with navigation and state management. Looking for someone experienced with React Navigation and Context API."
    }
};
