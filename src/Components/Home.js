import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import Cart from './Cart';

const Home = () => {
  const Navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Number.MAX_SAFE_INTEGER);
  const [productQuantities, setProductQuantities] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      Navigate('/login');
      alert('Login First !!');
    } else {
      // Simulate user data retrieval based on token
      const userData = {
        token: token
      };

      setUser(userData);
      console.log(user);
      console.log(localStorage);
      console.log(localStorage.getItem(`cartItems_${userData.token}`));
      console.log(localStorage.getItem(`productQuantities_${userData.token}`));

      // Fetch products
      fetch('https://dummyjson.com/products')
        .then((res) => res.json())
        .then((data) => setProducts(data.products))
        .catch((error) => console.error('Error fetching products:', error));

      // Retrieve cart information from local storage
      const storedCart = localStorage.getItem(`cartItems_${userData.token}`);
      const storedQuantities = localStorage.getItem(`productQuantities_${userData.token}`);
      if (storedCart && storedQuantities) {
        const parsedCart = JSON.parse(storedCart);
        const parsedQuantities = JSON.parse(storedQuantities);
        setCartItems(parsedCart);
        setCartCount(parsedCart.length);
        setCartTotal(calculateTotal(parsedCart));
        setProductQuantities(parsedQuantities);
      }
    }
  }, [Navigate]);

  useEffect(() => {
    // Filter products based on search term and price range
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        product.price >= minPrice &&
        product.price <= maxPrice
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm, minPrice, maxPrice]);

  useEffect(() => {
    // Update cart information in local storage when the user changes
    if (user) {
      localStorage.setItem(`cartItems_${user.token}`, JSON.stringify(cartItems));
      localStorage.setItem(`productQuantities_${user.token}`, JSON.stringify(productQuantities));
    }
  }, [user, cartItems, productQuantities]);

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedQuantities = { ...productQuantities, [productId]: newQuantity };
    setProductQuantities(updatedQuantities);
    setCartTotal(calculateTotal(cartItems, updatedQuantities));
  };

  const addToCart = (product) => {
    const updatedCart = [...cartItems, product];
    const updatedQuantities = { ...productQuantities, [product.id]: 1 };
    setCartItems(updatedCart);
    setCartCount(updatedCart.length);
    setCartTotal(calculateTotal(updatedCart, updatedQuantities));
    setProductQuantities(updatedQuantities);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    const updatedQuantities = { ...productQuantities };
    delete updatedQuantities[productId];
    setCartItems(updatedCart);
    setCartCount(updatedCart.length);
    setCartTotal(calculateTotal(updatedCart, updatedQuantities));
    setProductQuantities(updatedQuantities);
  };

  const calculateTotal = (items, quantities) => {
    if (!items || !quantities) {
      return 0;
    }

    return items.reduce((total, item) => total + item.price * (quantities[item.id] || 1), 0);
  };



  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    if (value === 'low') {
      setMinPrice(0);
      setMaxPrice(50);
    } else if (value === 'medium') {
      setMinPrice(50);
      setMaxPrice(100);
    } else if (value === 'high') {
      setMinPrice(100);
      setMaxPrice(Number.MAX_SAFE_INTEGER);
    } else {
      // Handle "All" option
      setMinPrice(0);
      setMaxPrice(Number.MAX_SAFE_INTEGER);
    }
  };

  return (
    <div>
      <Navbar cartCount={cartCount} cartTotal={cartTotal} />
      <div className='flex flex-row flex-wrap mt-20'>
        <form className="m-4 w-96">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by Product Name"
              onChange={handleSearch}
              value={searchTerm}
              required
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>

        <div className="m-4 w-96 flex flex-row flex-wrap">
          <label htmlFor="priceFilter" className="mb-2 text-sm font-medium text-gray-900 pt-2">
            Filter by Price:
          </label>
          <div className="relative ml-4">
            <select
              id="priceFilter"
              onChange={handleFilterChange}
              className="block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="low">Low ($0 - $50)</option>
              <option value="medium">Medium ($50 - $100)</option>
              <option value="high">High ($100+)</option>
            </select>
          </div>
        </div>
        <p className="m-4 w-96 text-sm font-medium text-gray-900 pt-2">
            Scroll down to view cart
          </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mr-4 ml-4 mt-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
            <a href="#">
              <img
                className="p-8 rounded-t-lg h-48 object-cover w-full"
                src={product.thumbnail}
                alt={product.title}
              />
            </a>
            <div className="px-5 pb-5">
              <a href="#">
                <h5 className="text-xl font-semibold tracking-tight text-gray-900">{product.title}</h5>
              </a>
              <p className="text-gray-500 text-sm mb-3">{product.brand}</p>
              <p className="text-gray-700 mb-3">{product.description}</p>
              <div className="flex flex-col">
                <p className="text-gray-500 text-sm mb-2">
                  {product.discountPercentage > 0 && (
                    <span>
                      {product.discountPercentage}% Off
                    </span>
                  )}
                </p>
                <div className="flex items-center mb-2">
                  {product.discountPercentage > 0 && (
                    <p className="text-sm text-gray-500 line-through">
                      {product.originalPrice}
                    </p>
                  )}
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                </div>
              </div>
              {cartItems.find((item) => item.id === product.id) ? (
                <>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                  >
                    Remove from Cart
                  </button>
                  <div className="flex items-center mt-2.5 mb-5">
                    <div className="flex items-center max-w-[8rem]">
                      <button
                        type="button"
                        id="decrement-button"
                        onClick={() => {
                          const newQuantity = Math.max((productQuantities[product.id] || 1) - 1, 0);
                          handleQuantityChange(product.id, newQuantity);
                        }}
                        className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-l-lg p-3 h-11 focus:ring-gray-100 focus:outline-none"
                      >
                        <svg className="w-3 h-3 text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
                        </svg>
                      </button>
                      <input
                        type="text"
                        id="quantity-input"
                        value={productQuantities[product.id] || 0}
                        readOnly
                        className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5"
                      />
                      <button
                        type="button"
                        id="increment-button"
                        onClick={() => {
                          const newQuantity = (productQuantities[product.id] || 0) + 1;
                          handleQuantityChange(product.id, newQuantity);
                        }}
                        className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-r-lg p-3 h-11 focus:ring-gray-100 focus:outline-none"
                      >
                        <svg className="w-3 h-3 text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => addToCart(product)}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Cart
        cartItems={cartItems}
        productQuantities={productQuantities}
        removeFromCart={removeFromCart}
        handleQuantityChange={handleQuantityChange}
      />
    </div>
  );
};

export default Home;
