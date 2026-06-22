const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Authentification',
            version: '1.0.0',
            description: 'Documentation du module d\'authentification OTP + JWT'
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Serveur de développement' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/routes/*.js'] // swagger lit les commentaires dans tes routes
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;