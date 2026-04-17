import * as productService from '../services/productService.mjs';
import { asyncHandler } from '../middleware/errorMiddleware.mjs';

export const list = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
});

export const create = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.imageUrl = `${req.protocol}://${req.get('host')}/uploads/product-images/${req.file.filename}`;
  }
  const product = await productService.createProduct(data);
  res.status(201).json(product);
});

export const update = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.imageUrl = `${req.protocol}://${req.get('host')}/uploads/product-images/${req.file.filename}`;
  }
  const product = await productService.updateProduct(req.params.id, data);
  res.json(product);
});

export const remove = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.json({ message: 'Product deleted successfully' });
});
