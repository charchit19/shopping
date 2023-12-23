import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount, cartTotal }) => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const Navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear("token");
        setLoggedIn(false);
        Navigate("/login");
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-white border-gray-200 fixed w-full top-0 z-10">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <p className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap">ShopIT</span>
                </p>
                <button
                    data-collapse-toggle="navbar-default"
                    type="button"
                    onClick={toggleMobileMenu}
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    aria-controls="navbar-default"
                    aria-expanded={isMobileMenuOpen}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className={`md:flex md:items-center md:w-auto ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
                        <li>
                            <Link
                                to="/home"
                                className={`block py-2 px-3 ${location.pathname === '/home' ? 'text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0' : 'text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0'}`}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className={`block py-2 px-3 ${location.pathname === '/logout' ? 'text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0' : 'text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0'}`}
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className={`block py-2 px-3 ${location.pathname === '/login' ? 'text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0' : 'text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0'}`}
                                >
                                    Login
                                </Link>
                            )}
                        </li>
                        {isLoggedIn ? (
                            <>
                                <li className="cart-info">
                                    <span>Cart: {cartCount} items</span>
                                </li>
                                <li className="cart-info">
                                    <span>Total: ${cartTotal}</span>
                                </li>
                            </>
                        ) : null}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
