const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Authentification',
            version: '1.0.0',
            description: "Documentation complète du module d'authentification OTP + JWT avec gestion des sessions."
        },
        servers: [
            { url: 'http://localhost:3000/api/auth', description: 'Serveur de développement' }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        paths: {
            '/me': {
                get: {
                    summary: "Obtenir le profil de l'utilisateur connecté",
                    tags: ['Sessions & Profil'],
                    security: [{ BearerAuth: [] }],
                    responses: {
                        200: { description: 'Profil récupéré avec succès.' },
                        401: { description: 'Token manquant, expiré ou invalide.' },
                        404: { description: 'Utilisateur introuvable.' },
                        500: { description: 'Erreur interne du serveur.' }
                    }
                }
            },
            '/refresh': {
                post: {
                    summary: "Rafraîchir l'Access Token (générer un nouveau JWT)",
                    tags: ['Sessions & Profil'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['refreshToken'],
                                    properties: {
                                        refreshToken: {
                                            type: 'string',
                                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSw...'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Nouveau token généré avec succès.',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            accessToken: { type: 'string', example: 'new_access_token_here' }
                                        }
                                    }
                                }
                            }
                        },
                        400: { description: 'Refresh Token manquant dans la requête.' },
                        401: { description: 'Refresh Token expiré ou invalide.' },
                        403: { description: 'Refresh Token révoqué ou absent de la base de données.' },
                        500: { description: 'Erreur interne lors du traitement.' }
                    }
                }
            },
            '/logout': {
                post: {
                    summary: "Déconnexion de l'utilisateur (Révocation du Refresh Token)",
                    tags: ['Sessions & Profil'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['refreshToken'],
                                    properties: {
                                        refreshToken: {
                                            type: 'string',
                                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSw...'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Déconnexion réussie. Refresh Token supprimé et révoqué.' },
                        400: { description: 'Refresh Token manquant.' },
                        401: { description: 'Token invalide.' },
                        500: { description: 'Erreur lors de la déconnexion.' }
                    }
                }
            },
            '/signup': {
                post: {
                    summary: "Inscription d'un nouvel utilisateur",
                    tags: ['Authentification'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['username', 'email', 'telephone', 'genre', 'password', 'type_utilisateur'],
                                    properties: {
                                        username: { type: 'string', example: 'Carlos237' },
                                        email: { type: 'string', format: 'email', example: 'carlos@gmail.com' },
                                        telephone: { type: 'string', example: '+237699112233' },
                                        genre: { type: 'string', enum: ['MASCULIN', 'FEMININ'], example: 'MASCULIN' },
                                        password: { type: 'string', format: 'password', example: 'Password123!' },
                                        type_utilisateur: { type: 'string', enum: ['CLIENT', 'PROFESSIONNEL'], example: 'CLIENT' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Utilisateur créé avec succès. Compte en attente d\'activation OTP.' },
                        400: { description: 'Données d\'entrée invalides.' },
                        409: { description: 'L\'email ou le téléphone est déjà utilisé.' },
                        500: { description: 'Erreur interne du serveur.' }
                    }
                }
            },
            '/login/web': {
                post: {
                    summary: "Connexion via l'application Web (par Email)",
                    tags: ['Authentification'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'carlos@gmail.com' },
                                        password: { type: 'string', format: 'password', example: 'Password123!' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Authentification réussie. Code OTP envoyé par email.' },
                        401: { description: 'Identifiants incorrects.' },
                        429: { description: 'Trop de tentatives de connexion.' },
                        500: { description: 'Erreur interne.' }
                    }
                }
            },
            '/login/mobile': {
                post: {
                    summary: "Connexion via l'application Mobile (par Téléphone)",
                    tags: ['Authentification'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['telephone', 'password'],
                                    properties: {
                                        telephone: { type: 'string', example: '+237699112233' },
                                        password: { type: 'string', format: 'password', example: 'Password123!' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Authentification réussie. Code OTP envoyé par SMS.' },
                        401: { description: 'Identifiants incorrects.' },
                        429: { description: 'Trop de tentatives de connexion.' },
                        500: { description: 'Erreur interne.' }
                    }
                }
            },
            '/otp/request/web': {
                post: {
                    summary: "Demande de renvoi d'un code OTP par Email",
                    tags: ['Gestion des OTP'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'carlos@gmail.com' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Nouveau code OTP envoyé.' },
                        429: { description: 'Un code OTP est déjà actif. Attendre 5 minutes.' },
                        500: { description: 'Erreur interne.' }
                    }
                }
            },
            '/otp/request/mobile': {
                post: {
                    summary: "Demande de renvoi d'un code OTP par SMS",
                    tags: ['Gestion des OTP'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['telephone'],
                                    properties: {
                                        telephone: { type: 'string', example: '+237699112233' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Nouveau code OTP envoyé.' },
                        429: { description: 'Un code OTP est déjà actif. Attendre 5 minutes.' },
                        500: { description: 'Erreur interne.' }
                    }
                }
            },
            '/otp/verify/web': {
                post: {
                    summary: "Vérification de l'OTP pour l'application Web",
                    tags: ['Gestion des OTP'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'code'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'carlos@gmail.com' },
                                        code: { type: 'string', example: '123456' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: "OTP valide. Compte activé et jetons JWT renvoyés." },
                        401: { description: 'Code OTP incorrect ou expiré.' },
                        500: { description: 'Erreur interne.' }
                    }
                }
            },
            '/otp/verify/mobile': {
                post: {
                    summary: "Vérification de l'OTP pour l'application Mobile",
                    tags: ['Gestion des OTP'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['telephone', 'code'],
                                    properties: {
                                        telephone: { type: 'string', example: '+237699112233' },
                                        code: { type: 'string', example: '123456' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: "OTP valide. Compte activé et jetons JWT renvoyés." },
                        401: { description: 'Code OTP incorrect ou expiré.' },
                        500: { description: 'Erreur interne.' }
                    }
                }
            }
        }
    },
    apis: []
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;