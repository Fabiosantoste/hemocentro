const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;


const users = {};
const appointments = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static('public'));


app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send('Por favor, preencha todos os campos.');
    }

    if (users[username]) {
        return res.send('Usuário já cadastrado.');
    }

    users[username] = { password };
    res.send('Usuário cadastrado com sucesso.');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send('Por favor, preencha todos os campos.');
    }

    const user = users[username];

    if (!user || user.password !== password) {
        return res.send('Nome de usuário ou senha incorretos.');
    }

    req.session.authenticatedUser = username;
    res.send('Login bem-sucedido.');
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.send('Logout realizado com sucesso.');
});

// Rotas de agendamento
app.post('/schedule', (req, res) => {
    const { date, time } = req.body;
    const authenticatedUser = req.session.authenticatedUser;

    if (!authenticatedUser) {
        return res.send('Você precisa estar logado para agendar um horário.');
    }

    if (!date || !time) {
        return res.send('Por favor, preencha todos os campos.');
    }

    appointments.push({ user: authenticatedUser, date, time });
    res.send(`Horário agendado com sucesso para ${date} às ${time}.`);
});

app.get('/appointments', (req, res) => {
    res.json(appointments);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
