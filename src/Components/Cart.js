// Cart.js
import React from 'react';

// Cart component responsible for rendering the shopping cart
const Cart = ({ cartItems, productQuantities, removeFromCart, handleQuantityChange }) => {
  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-semibold mb-4">Shopping Cart</h2>
      
      {/* Check if the cart is empty */}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {/* Render each item in the cart */}
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center mb-4 border-b pb-4">
              <img
                className="w-20 h-20 object-cover mr-4"
                src={item.thumbnail}
                alt={item.title}
              />
              <div className="flex-grow">
                {/* Display item details and remove button */}
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-gray-500">Price: ${item.price}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                  >
                    Remove
                  </button>
                </div>
                
                {/* Display quantity control for each item */}
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(item.id, Math.max(productQuantities[item.id] - 1, 0))}
                    className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-l-lg p-2 focus:ring-gray-100 focus:outline-none"
                  >
                    -
                  </button>
                  <span className="bg-gray-50 border-t border-b border-gray-300 h-10 px-4 flex items-center">
                    {productQuantities[item.id] || 0}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, (productQuantities[item.id] || 0) + 1)}
                    className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-r-lg p-2 focus:ring-gray-100 focus:outline-none"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Display the total cost of all items in the cart */}
          <div className="mt-4">
            <p className="text-xl font-semibold">Total: ${calculateTotal(cartItems, productQuantities)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Function to calculate the total cost of items in the cart
const calculateTotal = (items, quantities) => {
  return items.reduce((total, item) => total + item.price * (quantities[item.id] || 1), 0);
};

// Export the Cart component as the default export
export default Cart;
