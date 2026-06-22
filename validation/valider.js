const Joi = require('joi');

const signupSchematotal = Joi.object({
    username: Joi.string().min(4).max(100).required().messages({
        'string.min': 'Le nom doit contenir au moins 4 caractères',
        'any.required': 'Le nom est obligatoire'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email invalide',
        'any.required': 'Email obligatoire'
    }),
    telephone: Joi.string()
        .pattern(/^\+237(62[0-9]|64[0-9]|65[0-9]|66[0-9]|67[0-9]|68[0-9]|69[0-9]|620|621)\d{6}$/)
        .required()
        .messages({
            'string.pattern.base': 'Numéro invalide. Format attendu : +237620XXXXXX à +237699XXXXXX',
            'any.required': 'Numéro de téléphone obligatoire'
        }),
    genre: Joi.string()
        .valid('MASCULIN', 'FEMININ')
        .required()
        .messages({
            'any.only': 'Le sexe doit être soit MASCULIN ou FEMININ.',
            'any.required': 'Le sexe est obligatoire.'
        }),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:#^_\-])[A-Za-z\d@$!%*?&.,;:#^_\-]{8,}$/)
        .required()
        .messages({
            'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
            'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&.,;:#^_-)',
            'any.required': 'Mot de passe obligatoire'
        }),
    type_utilisateur: Joi.string()
        .valid('CLIENT', 'PROFESSIONNEL')
        .required()
        .messages({
            'any.only': 'Le type d\'utilisateur doit être soit CLIENT ou PROFESSIONNEL.',
            'any.required': 'Le type d\'utilisateur est obligatoire.'
        })
});


const requestOtpWebSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email invalide',
        'any.required': 'Email obligatoire'
    })
});

const requestOtpMobileSchema = Joi.object({
    telephone: Joi.string()
        .pattern(/^\+237(62[0-9]|64[0-9]|65[0-9]|66[0-9]|67[0-9]|68[0-9]|69[0-9]|620|621)\d{6}$/)
        .required()
        .messages({
            'string.pattern.base': 'Numéro invalide. Format attendu : +237620XXXXXX à +237699XXXXXX',
            'any.required': 'Numéro de téléphone obligatoire'
        }),
});

// ─────────────────────────────────────────
// Vérification d'OTP
// ─────────────────────────────────────────

const verifyOtpWebSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email invalide',
        'any.required': 'Email obligatoire'
    }),
    code: Joi.string().length(6).pattern(/^\d+$/).required().messages({
        'string.length': 'Le code doit contenir exactement 6 chiffres',
        'string.pattern.base': 'Le code ne doit contenir que des chiffres',
        'any.required': 'Code OTP obligatoire'
    })
});

const verifyOtpMobileSchema = Joi.object({
    telephone: Joi.string()
        .pattern(/^\+237(62[0-9]|64[0-9]|65[0-9]|66[0-9]|67[0-9]|68[0-9]|69[0-9]|620|621)\d{6}$/)
        .required()
        .messages({
            'string.pattern.base': 'Numéro invalide. Format attendu : +237620XXXXXX à +237699XXXXXX',
            'any.required': 'Numéro de téléphone obligatoire'
        }),

    code: Joi.string().length(6).pattern(/^\d+$/).required().messages({
        'string.length': 'Le code doit contenir exactement 6 chiffres',
        'string.pattern.base': 'Le code ne doit contenir que des chiffres',
        'any.required': 'Code OTP obligatoire'
    })
});

const loginWebSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email invalide',
        'any.required': 'Email obligatoire'
    }),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:#^_\-])[A-Za-z\d@$!%*?&.,;:#^_\-]{8,}$/)
        .required()
        .messages({
            'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
            'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&.,;:#^_-)',
            'any.required': 'Mot de passe obligatoire'
        })
});

const loginMobileSchema = Joi.object({
    telephone: Joi.string()
        .pattern(/^\+237(62[0-9]|64[0-9]|65[0-9]|66[0-9]|67[0-9]|68[0-9]|69[0-9]|620|621)\d{6}$/)
        .required()
        .messages({
            'string.pattern.base': 'Numéro invalide. Format attendu : +237620XXXXXX à +237699XXXXXX',
            'any.required': 'Numéro de téléphone obligatoire'
        }),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:#^_\-])[A-Za-z\d@$!%*?&.,;:#^_\-]{8,}$/)
        .required()
        .messages({
            'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
            'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&.,;:#^_-)',
            'any.required': 'Mot de passe obligatoire'
        })
});

const loginAdminSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email invalide',
        'any.required': 'Email obligatoire'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
        'any.required': 'Mot de passe obligatoire'
    })
});

const refreshSchema = Joi.object({
    refresh_token: Joi.string().required().messages({
        'any.required': 'Refresh token obligatoire'
    })
});

const logoutSchema = Joi.object({
    refresh_token: Joi.string().required().messages({
        'any.required': 'Refresh token obligatoire'
    })
});

module.exports = {
    signupSchematotal,
    requestOtpWebSchema,
    requestOtpMobileSchema,
    verifyOtpWebSchema,
    verifyOtpMobileSchema,
    loginWebSchema,
    loginMobileSchema,
    loginAdminSchema,
    refreshSchema,
    logoutSchema
};