import express from 'express';
import { google, signin, signup, test } from '../Controllers/AuthController.js';
const router = express.Router();


router.route('/test').get(test);
router.route('/signin').post(signin);
router.route('/signup').post(signup);
router.route('/google').post(google);

export default router;