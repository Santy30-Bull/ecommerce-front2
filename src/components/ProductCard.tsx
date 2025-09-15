import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

interface Props {
  product: Product;
  onAddToCart?: (productId: number) => void;
}

const ProductCard: React.FC<Props> = ({ product, onAddToCart }) => {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '12rem',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <div>
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '0.3rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: '0.85rem',
            color: '#666',
            lineHeight: '1.3',
            maxHeight: '2.6rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {product.description || "Producto sin descripción"}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1rem',
        }}
      >
        <span
          style={{
            color: '#007bff',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          ${product.price}
        </span>
        <button
          onClick={() => onAddToCart?.(product.id)}
          style={{
            background: '#007bff',
            color: '#fff',
            padding: '0.4rem 0.8rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '500',
            transition: 'background 0.3s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#0069d9')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#007bff')}
        >
          Añadir
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
