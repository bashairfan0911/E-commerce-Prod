import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";

function WishlistCard({ product, onRemove, onAddToCart }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    try {
      await api.post('/api/addtocart', {
        productId: product._id,
        userId: user._id,
        quantity: quantity
      });
      toast.success("Added to cart!");
      onAddToCart(product._id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="single-cart-area-list main item-parent">
      <div className="product-main-cart">
        <div className="close section-activation" onClick={() => onRemove(product._id)}>
          <i className="fa-solid fa-xmark" style={{ cursor: 'pointer' }}></i>
        </div>
        <div className="thumbnail">
          <img src={product.images[0]?.url} alt={product.title} />
        </div>
        <div className="information">
          <h6 className="title">{product.title}</h6>
          <span>{product.category}</span>
        </div>
      </div>
      <div className="price">
        <p>₹ {product.sellingprice}</p>
      </div>
      <div className="quantity">
        <div className="quantity-edit">
          <input type="text" className="input" value={quantity} readOnly />
          <div className="button-wrapper-action">
            <button className="button" onClick={handleDecrement}>
              <i className="fa-regular fa-chevron-down" />
            </button>
            <button className="button plus" onClick={handleIncrement}>
              +<i className="fa-regular fa-chevron-up" />
            </button>
          </div>
        </div>
      </div>
      <div className="subtotal">
        <p>₹ {product.sellingprice * quantity}</p>
      </div>
      <div className="button-area">
        <button
          onClick={handleAddToCart}
          className="rts-btn btn-primary radious-sm with-icon"
          style={{ marginBottom: '10px' }}
        >
          <div className="btn-text">Add To Cart</div>
          <div className="arrow-icon">
            <i className="fa-regular fa-cart-shopping" />
          </div>
          <div className="arrow-icon">
            <i className="fa-regular fa-cart-shopping" />
          </div>
        </button>
        <button
          onClick={() => navigate(`/product-details/${product._id}`)}
          className="rts-btn btn-outline radious-sm"
          style={{ width: '100%' }}
        >
          View Full Detail
        </button>
      </div>
    </div>
  );
}

export default WishlistCard;
