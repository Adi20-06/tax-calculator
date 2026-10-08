import { body, param, validationResult } from 'express-validator';

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
}

export const validateSalaryInput = [
  body('grossSalary')
    .exists().withMessage('grossSalary is required')
    .bail()
    .isFloat({ min: 0, max: 1000000000 }).withMessage('grossSalary must be a positive number under 100 crore'),
  handleValidationErrors,
];

export const validateCompareInput = [
  body('grossSalary')
    .exists().withMessage('grossSalary is required')
    .bail()
    .isFloat({ min: 0, max: 1000000000 }).withMessage('grossSalary must be a valid positive number'),
  body('oldRegimeDeductions')
    .optional()
    .isFloat({ min: 0, max: 1000000000 }).withMessage('oldRegimeDeductions must be a valid positive number'),
  handleValidationErrors,
];

export const validateSignup = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/).withMessage('Name contains invalid characters'),
  body('email')
    .trim()
    .isEmail().withMessage('A valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

export const validateProfile = [
  body('profileName')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Profile name must be between 1 and 100 characters')
    .escape(),
  body(['basic', 'hra', 'special', 'bonus', 'other', 'employerPf', 'gratuity'])
    .optional()
    .isFloat({ min: 0, max: 1000000000 }).withMessage('Salary component values must be positive numbers'),
  handleValidationErrors,
];

export const validateIdParam = [
  param('id').isInt({ min: 1 }).withMessage('Invalid ID'),
  handleValidationErrors,
];