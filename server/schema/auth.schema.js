import Joi from "joi";

const RegisterSchema = Joi.object({
  name: Joi.string().required().min(3).max(50).trim(),
  email: Joi.string()
    .email({ allowFullyQualified: true })
    .required()
    .lowercase()
    .trim(),
  password: Joi.string().required().min(6).max(128),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords must match",
  }),
  avatar: Joi.string().uri().optional(),
});

const LoginSchema = Joi.object({
  email: Joi.string()
    .email({ allowFullyQualified: true })
    .required()
    .lowercase()
    .trim(),
  password: Joi.string().required().min(6).max(128),
});

const EmailVerificationSchema = Joi.object({
  email: Joi.string()
    .email({ allowFullyQualified: true })
    .required()
    .lowercase()
    .trim(),
});

const PasswordResetRequestSchema = Joi.object({
  email: Joi.string()
    .email({ allowFullyQualified: true })
    .required()
    .lowercase()
    .trim(),
});

const PasswordResetSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required().min(6).max(128),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords must match",
  }),
});

const ProfileUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(50).trim().optional(),
  avatar: Joi.string().uri().optional(),
}).min(1);

export {
  RegisterSchema,
  LoginSchema,
  EmailVerificationSchema,
  PasswordResetRequestSchema,
  PasswordResetSchema,
  ProfileUpdateSchema,
};
