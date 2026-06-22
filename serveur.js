require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const { sequelize } = require('./src/models');

const app = express();

// ─── Middlewares globaux ───
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Documentation Swagger ───
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ───
const authRoutes = require('./src/routes/auth.routes');
app.use('/auth', authRoutes);

// ─── Route de test ───
app.get('/', (req, res) => {
    res.json({ message: 'API en ligne', docs: 'http://localhost:3000/api-docs' });
});

// ─── Route 404 ───
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// ─── Middleware d'erreur global ───
app.use((err, req, res, next) => {
    console.error('[ERREUR]', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
});

// ─── Démarrage ───
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false })
    .then(() => {
        console.log('Base de données synchronisée !');
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur http://localhost:${PORT}`);
            console.log(`Swagger disponible sur http://localhost:${PORT}/api-docs`);
        });
    })
    .catch(err => {
        console.error('Erreur de synchronisation DB :', err);
    });