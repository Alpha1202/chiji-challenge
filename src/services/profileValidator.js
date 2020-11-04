import { check } from 'express-validator';
import validate from './validate';

const profileChecker = [
  check('firstName').optional().isAlpha().trim()
    .withMessage('First name can only contain letters'),
  check('lastName').optional().isAlpha().trim()
    .withMessage('Last name can only contain letters'),
  validate,
];

export default profileChecker;