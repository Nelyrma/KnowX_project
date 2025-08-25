const axios = require('axios');


const users = [
    {
        first_name: 'Alice',
        last_name: 'Niyonsaba',
        email: 'alice@knowx.com',
        password: '1234',
        skills_offered: ['HTML', 'CSS', 'JavaScript'],
        skills_wanted: ['React', 'Node.js']
    },
    {
        first_name: 'Brian',
        last_name: 'Smith',
        email: 'brian@knowx.com',
        password: '1234',
        skills_offered: ['Python', 'Data Science'],
        skills_wanted: ['Machine Learning', 'TensorFlow']
    },
    {
        first_name: 'Mariam',
        last_name: 'Sow',
        email: 'mariam@knowx.com',
        password: '1234',
        skills_offered: ['JavaScript', 'React'],
        skills_wanted: ['Testing', 'Cypress']
    },
    {
        first_name: 'Imane',
        last_name: 'Berrada',
        email: 'imane@knowx.com',
        password: '1234',
        skills_offered: ['Vue.js', 'Vuetify'],
        skills_wanted: ['React', 'Next.js']
    },
    {
        first_name: 'Lionel',
        last_name: 'Hakizimana',
        email: 'lionel@knowx.com',
        password: '1234',
        skills_offered: ['Python', 'Automation'],
        skills_wanted: ['DevOps', 'Ansible']
    },
    {
        first_name: 'David',
        last_name: 'Müller',
        email: 'david@knowx.com',
        password: '1234',
        skills_offered: ['Node.js', 'Express.js'],
        skills_wanted: ['DevOps', 'AWS']
    },
    {
        first_name: 'Grace',
        last_name: 'Amahoro',
        email: 'grace@knowx.com',
        password: '1234',
        skills_offered: ['Machine Learning', 'Python'],
        skills_wanted: ['Deep Learning', 'NLP']
    },
    {
        first_name: 'Michael',
        last_name: 'Brown',
        email: 'michael@knowx.com',
        password: '1234',
        skills_offered: ['PHP', 'Laravel'],
        skills_wanted: ['Node.js', 'TypeScript']
    },
    {
        first_name: 'Clara',
        last_name: 'Lefèvre',
        email: 'clara@knowx.com',
        password: '1234',
        skills_offered: ['SQL', 'MySQL'],
        skills_wanted: ['Data Analysis', 'Pandas']
    },
    {
        first_name: 'Linda',
        last_name: 'Schneider',
        email: 'linda@knowx.com',
        password: '1234',
        skills_offered: ['Python', 'Flask'],
        skills_wanted: ['Django', 'PostgreSQL']
    }
];

async function seed() {
    for (const user of users) {
        try {
            await axios.post('http://localhost:3001/auth/signup', user);
            console.log(`✅ ${user.email} created !`);
        } catch (err) {
            if (err.response?.data?.error) {
                console.log(`❌ ${user.email}: ${err.response.data.error}`);
            } else {
                console.log(`❌ ${user.email}: Unknown error`);
            }
        }
    }
}

seed();
