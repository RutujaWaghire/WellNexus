import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/api';

const AdminManageStock = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stockInputs, setStockInputs] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data);
      // Initialize stock inputs
      const inputs = {};
      response.data.forEach(product => {
        inputs[product.id] = '';
      });
      setStockInputs(inputs);
    } catch (error) {
      console.error('Error loading products:', error);
      setMessage('Error loading products');
    }
  };

  const handleStockInputChange = (productId, value) => {
    setStockInputs({
      ...stockInputs,
      [productId]: value
    });
  };

  const handleAddStock = async (productId, currentStock) => {
    const quantityToAdd = parseInt(stockInputs[productId]);

    if (!quantityToAdd || quantityToAdd <= 0) {
      setMessage('Please enter a valid stock quantity');
      return;
    }

    setLoading(true);
    try {
      const response = await productService.addStock(productId, quantityToAdd);
      setMessage(`✓ Added ${quantityToAdd} units. New stock: ${response.data.stock}`);
      
      // Reset input
      setStockInputs({
        ...stockInputs,
        [productId]: ''
      });

      // Reload products
      await loadProducts();

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding stock: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return <div className="flex justify-center items-center h-screen">Access Denied</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Product Stock</h1>

      {message && (
        <div className={`mb-6 p-4 rounded text-sm ${
          message.startsWith('✓') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left">Product Name</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-center">Current Stock</th>
              <th className="px-6 py-4 text-left">Add Stock</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-6 py-4 font-semibold">{product.name}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-semibold">
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter quantity"
                    className="px-3 py-2 border rounded-lg w-32 focus:outline-none focus:border-teal-600"
                    value={stockInputs[product.id] || ''}
                    onChange={(e) => handleStockInputChange(product.id, e.target.value)}
                    disabled={loading}
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleAddStock(product.id, product.stock)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50"
                    disabled={loading || !stockInputs[product.id]}
                  >
                    {loading ? 'Adding...' : 'Add Stock'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found
        </div>
      )}
    </div>
  );
};

export default AdminManageStock;
