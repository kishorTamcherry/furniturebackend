import express from 'express';
import * as productController from '../controllers/productController.mjs';
import auth from '../middleware/auth.mjs';
import upload from '../middleware/upload.mjs';
import { validate } from '../middleware/validateMiddleware.mjs';
import { productSchema, updateProductSchema } from '../validation/productSchema.mjs';

const router = express.Router();

router.get('/', productController.list);
router.post('/', auth, upload.single('image'), validate(productSchema), productController.create);
router.put('/:id', auth, upload.single('image'), validate(updateProductSchema), productController.update);
router.delete('/:id', auth, productController.remove);

export default router;
