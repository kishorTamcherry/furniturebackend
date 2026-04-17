import * as productService from '../services/productService.mjs';
import { asyncHandler } from '../middleware/errorMiddleware.mjs';

export const list = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
});

export const create = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
});

export const update = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.json(product);
});

export const remove = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.json({ message: 'Product deleted successfully' });
});
