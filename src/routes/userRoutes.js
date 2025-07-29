const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const authMiddleware = require('../middlewares/authMiddleware');
const { registerUserSchema } = require('../validations/joiSchemas');

// Public
router.post('/', validate(registerUserSchema), userController.register);

// Authenticated routes
router.get('/:userId', authMiddleware, userController.getUser);
router.patch('/:userId', authMiddleware, userController.updateUser);
router.delete('/:userId', authMiddleware, userController.deleteUser);

module.exports = router;
