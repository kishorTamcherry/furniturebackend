import Product from '../models/Product.mjs';

export const getAllProducts = async () => {
  return await Product.find();
};

export const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

export const updateProduct = async (id, productData) => {
  const product = await Product.findByIdAndUpdate(id, productData, { new: true });
  if (!product) throw new Error('Product not found');
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error('Product not found');
  return product;
};
