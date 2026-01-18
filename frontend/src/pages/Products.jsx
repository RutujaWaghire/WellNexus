import React, { useState, useEffect } from 'react';
import { productService, orderService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productService.getAvailable();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert('Added to cart!');
  };

  const placeOrder = async (product) => {
    if (!user) {
      alert('Please login to place an order');
      return;
    }
    
    try {
      await orderService.create({
        userId: user.userId,
        productId: product.id,
        quantity: 1
      });
      alert('Order placed successfully!');
      loadProducts();
    } catch (error) {
      alert('Error placing order: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Wellness Products</h1>
      
      <div className="grid md:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2 text-sm">{product.description}</p>
            <p className="text-gray-600 mb-2">
              <strong>Category:</strong> {product.category}
            </p>
            <p className="text-2xl font-bold text-teal-600 mb-2">
              ${product.price}
            </p>
            <p className="text-gray-500 mb-4">
              Stock: {product.stock}
            </p>
            <button
              onClick={() => placeOrder(product)}
              className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No products available</p>
      )}
    </div>
  );
};

export default Products;
