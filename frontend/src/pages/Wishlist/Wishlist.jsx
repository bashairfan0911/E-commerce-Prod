import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WishlistCard from './WishlistCard';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/getwishlist', { userId: user._id });
      setWishlist(response.data.wishlist);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load wishlist");
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.post('/api/removefromwishlist', {
        productId,
        userId: user._id
      });
      setWishlist(wishlist.filter(item => item._id !== productId));
      toast.success("Removed from wishlist");
      
      // Trigger event to update wishlist count in header
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleAddToCart = (productId) => {
    // Optionally remove from wishlist after adding to cart
    handleRemove(productId);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ padding: '50px', textAlign: 'center' }}>Loading wishlist...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div>
        <div className="rts-navigation-area-breadcrumb bg_light-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="navigator-breadcrumb-wrapper">
                  <Link to="/">Home</Link>
                  <i className="fa-regular fa-chevron-right" />
                  <Link className="current" to="/wishlist">
                    Wishlist
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section-seperator bg_light-1">
          <div className="container">
            <hr className="section-seperator" />
          </div>
        </div>
        {/* rts cart area start */}
        <div className="rts-cart-area rts-section-gap bg_light-1">
          <div className="container">
            <div className="row g-5">
              <div className="col-lg-12">
                <div className="rts-cart-list-area wishlist">
                  <div className="single-cart-area-list head">
                    <div className="product-main">
                      <p>Products</p>
                    </div>
                    <div className="price">
                      <p>Price</p>
                    </div>
                    <div className="quantity">
                      <p>Quantity</p>
                    </div>
                    <div className="subtotal">
                      <p>SubTotal</p>
                    </div>
                    <div className="button-area"></div>
                  </div>
                  {wishlist.length > 0 ? (
                    wishlist.map((product) => (
                      <WishlistCard
                        key={product._id}
                        product={product}
                        onRemove={handleRemove}
                        onAddToCart={handleAddToCart}
                      />
                    ))
                  ) : (
                    <div style={{ padding: '50px', textAlign: 'center' }}>
                      <p>Your wishlist is empty</p>
                      <Link to="/products" className="rts-btn btn-primary">
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* rts cart area end */}
      </div>
      <Footer />
    </>
  );
}

export default Wishlist;
