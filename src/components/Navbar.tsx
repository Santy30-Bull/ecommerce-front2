import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav style={{ padding: '1rem', background: '#222', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 'bold' }}>Ecommerce</div>
            <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', margin: 0 }}>
                <li><a href="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</a></li>
                <li><a href="/products" style={{ color: '#fff', textDecoration: 'none' }}>Products</a></li>
                <li><a href="/cart" style={{ color: '#fff', textDecoration: 'none' }}>Cart</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;