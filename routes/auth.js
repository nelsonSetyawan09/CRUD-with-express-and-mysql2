const express = require('express');
const { check, body } = require('express-validator/check');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
	[
		check('email')
			.isEmail()
			.withMessage('Please citra, enter valid email')
			// .custom((value, {req}) =>{
			// 	return User.findOne({ email: value }).then(userDoc => {
			//       if (!userDoc) {
			//       	return Promise.reject(
			//       		'Register first please citra!!'
			//       	);
			//       };
			// 	});
			// }),
			.normalizeEmail()
			,
		body(
			'password',
			'Please citra sayang, enter password minimal 5 character!'
			)
			.isLength({min:5})
			.isAlphanumeric()
			.trim()
	],
 	authController.postLogin);
				
router.post('/signup', 
	[
		check('email')
			.isEmail()
			.withMessage('Please citra, enter valid email')
			.custom((value, {req}) =>{
				return User.findOne({ email: value }).then(userDoc => {
			      if (userDoc) {
			      	return Promise.reject(
			      		'E-Mail exists already, please pick a different one.'
			      	);
			      };
				});
			})
			.normalizeEmail(),
		body(
			'password',
			'Please citra sayang, enter password minimal 5 character'
			)
			.isLength({min:5})
			.isAlphanumeric()
			.trim(),
		body('confirmPassword')
			.trim()
			.custom((value, {req})=>{
				if(value !== req.body.password){
					throw new Error('Password harus match citra sayang!')
				}
				return true;
			})
	], 
	authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
