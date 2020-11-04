import { body, check } from 'express-validator';

const postValidator = {
  detailsValidator: [
    body('title')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Title is required.')
      .isString()
      .withMessage('Invalid title')
      .isLength({ min: 1 })
      .withMessage('Title too short.')
      .isLength({ max: 70 })
      .withMessage('Title must not exceed 70 characters.'),
    body('description')
      .trim()
      .exists({ checkNull: false })
      .isString()
      .withMessage('Invalid description.')
      .isLength({ max: 120 })
      .withMessage('Description must not exceed 120 characters.'),
    body('body')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Article body is required.')
      .isString()
      .withMessage('Invalid article body.')
      .isLength({ min: 1 })
      .withMessage('Article body too short.')
      .isLength({ min: 1, max: 15000 })
      .withMessage('Article body too long.'),
    body('imageUrl')
      .trim()
      .exists({ checkNull: false })
      .isString()
      .withMessage('Invalid image url')
      .isLength({ max: 70 })
      .withMessage('Image url must not exceed 70 characters.'),
  ],
  slugValidator: [
    check('slug')
      .trim()
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .withMessage('Invalid slug')
  ],
};

export default postValidator;