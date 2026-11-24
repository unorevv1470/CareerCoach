import {Router} from 'express';import {usageReport} from '../controllers/adminController.js';import {protect,adminOnly} from '../middleware/auth.js';
const r=Router();r.get('/usage',protect,adminOnly,usageReport);export default r;
