import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import AddtoCart from "../../components/AddtoCart";
import QuickViewModal from "../../components/QuickViewModal";
import { toast } from "react-toastify";

function ProductCard({product}) {
  
  const user = JSON.parse(localStorage.getItem('user'));
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      
      // Trigger event to update wishlist count in header
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    }
  };

  return (
    <>
      <div className="col-lg-20 col-lg-4 col-md-6 col-sm-6 col-12">
        <div className="single-shopping-card-one">
          {/* iamge and sction area start */}
          <div className="image-and-action-area-wrapper">
            <Link to={`/singleproduct/${product?._id}`} className="thumbnail-preview">
              <div className="badge">
                <span>
                  {product?.discount}% <br />
                  Off
                </span>
                <i className="fa-solid fa-bookmark" />
              </div>
              <div 
                style={{ position: 'relative', overflow: 'hidden' }}
                onMouseEnter={() => product?.images?.length > 1 && setCurrentImageIndex(1)}
                onMouseLeave={() => setCurrentImageIndex(0)}
              >
                <img 
                  src={product?.images[currentImageIndex]?.url} 
                  alt={product?.title}
                  style={{ 
                    width: '100%', 
                    transition: 'opacity 0.3s ease-in-out',
                    opacity: 1
                  }}
                />
                {product?.images?.length > 1 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '5px',
                    zIndex: 10
                  }}>
                    {product.images.map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: currentImageIndex === index ? '#629D23' : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentImageIndex(index);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
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
          {/* iamge and sction area start */}
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
            {/* <div className="cart-counter-action">
              <div className="quantity-edit">
                <input type="text" className="input" defaultValue={1} />
                <div className="button-wrapper-action">
                  <button className="button">
                    <i className="fa-regular fa-chevron-down" />
                  </button>
                  <button className="button plus">
                    +<i className="fa-regular fa-chevron-up" />
                  </button>
                </div>
              </div>
              <a href="#" className="rts-btn btn-primary radious-sm with-icon">
                <div className="btn-text">Add To Cart</div>
                <div className="arrow-icon">
                  <i className="fa-regular fa-cart-shopping" />
                </div>
                <div className="arrow-icon">
                  <i className="fa-regular fa-cart-shopping" />
                </div>
              </a>
            </div> */}
            <AddtoCart productId={product?._id} userId={user._id}/>
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

export default ProductCard;
