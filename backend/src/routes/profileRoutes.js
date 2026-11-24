import {Router} from 'express';import {getProfile,saveProfile} from '../controllers/profileController.js';import {protect} from '../middleware/auth.js';
const r=Router();r.use(protect);r.get('/',getProfile);r.put('/',saveProfile);export default r;
