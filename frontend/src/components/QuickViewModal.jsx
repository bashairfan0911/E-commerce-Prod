import React from 'react';
import { Link } from 'react-router-dom';

function QuickViewModal({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  return (
    <div 
      className="modal fade show" 
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Quick View</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <img 
                  src={product.images[0]?.url} 
                  alt={product.title} 
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </div>
              <div className="col-md-6">
                <h3>{product.title}</h3>
                <p className="text-muted">{product.category}</p>
                <div className="price-area" style={{ margin: '20px 0' }}>
                  <span style={{ fontSize: '24px', color: '#629D23', fontWeight: 'bold' }}>
                    ₹{product.sellingprice}
                  </span>
                  <del style={{ marginLeft: '10px', color: '#999' }}>
                    ₹{product.originalprice}
                  </del>
                  <span style={{ 
                    marginLeft: '10px', 
                    backgroundColor: '#ff4444', 
                    color: 'white', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {product.discount}% OFF
                  </span>
                </div>
                <p>{product.description}</p>
                <div style={{ marginTop: '20px' }}>
                  <p><strong>Brand:</strong> {product.brandname}</p>
                  <p><strong>Weight:</strong> {product.weight}</p>
                </div>
                <Link 
                  to={`/singleproduct/${product._id}`} 
                  className="rts-btn btn-primary"
                  style={{ marginTop: '20px' }}
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
