import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import AddtoCart from "./AddtoCart";
import QuickViewModal from "./QuickViewModal";
import { toast } from "react-toastify";

function FeaturedCard({product}) {
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const [showQuickView, setShowQuickView] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      checkWishlistStatus();
    }
  }, [product._id]);

  const checkWishlistStatus = async () => {
    try {
      const response = await api.post('/api/getwishlist', { userId: user._id });
      const inWishlist = response.data.wishlist.some(item => item._id === product._id);
      setIsInWishlist(inWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      if (isInWishlist) {
        await api.post('/api/removefromwishlist', {
          productId: product._id,
          userId: user._id
        });
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await api.post('/api/addtowishlist', {
          productId: product._id,
          userId: user._id
        });
        setIsInWishlist(true);
        toast.success("Added to wishlist");
      }
      
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    }
  };



  return (
    <>
      <div className="swiper-slide">
        <div className="single-shopping-card-one">
          <div className="image-and-action-area-wrapper">
            <Link to={`/singleproduct/${product?._id}`} className="thumbnail-preview">
              <div className="badge">
                <span>
                  {product?.discount}% <br />
                  Off
                </span>
                <i className="fa-solid fa-bookmark" />
              </div>
              <img src={product?.images[0]?.url} alt="grocery" />
            </Link>
            <div className="action-share-option">
              <div
                className="single-action openuptip message-show-action"
                data-flow="up"
                title={isInWishlist ? "Remove from Wishlist" : "Add To Wishlist"}
                onClick={(e) => handleWishlistToggle(e)}
                style={{ cursor: 'pointer' }}
              >
                <i className={isInWishlist ? "fa-solid fa-heart" : "fa-light fa-heart"} 
                   style={{ color: isInWishlist ? '#ff0000' : '' }} />
              </div>
              <div
                className="single-action openuptip"
                data-flow="up"
                title="Compare"
                onClick={() => toast.info("Compare feature coming soon!")}
                style={{ cursor: 'pointer' }}
              >
                <i className="fa-solid fa-arrows-retweet" />
              </div>
              <div
                className="single-action openuptip cta-quickview product-details-popup-btn"
                data-flow="up"
                title="Quick View"
                onClick={() => setShowQuickView(true)}
                style={{ cursor: 'pointer' }}
              >
                <i className="fa-regular fa-eye" />
              </div>
            </div>
          </div>
          <div className="body-content">
            <Link to={`/singleproduct/${product?._id}`}>
              <h4 className="title">
                {product?.title}
              </h4>
            </Link>
            <span className="availability">{product?.weight} Pack</span>
            <div className="price-area">
              <span className="current">₹{Math.ceil(product?.sellingprice)}</span>
              <div className="previous">₹{product?.originalprice}</div>
            </div>
            {
              user ? (<AddtoCart productId={product?._id} userId={user._id}/>) : (<AddtoCart productId={product?._id} userId={null}/>)
            }
            {/* <AddtoCart productId={product?._id} userId={user._id}/> */}
          </div>
        </div>
      </div>
      
      <QuickViewModal 
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
}

export default FeaturedCard;
