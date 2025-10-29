import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../utils/UserContext.jsx";
import api from "../../utils/api";

function UserDetails() {
  const user = useContext(UserContext);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    hasAddress: false
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    if (!user || !user._id) return;

    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/userdetails', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = response.data.user;
      const totalOrders = userData.order?.length || 0;
      const hasAddress = !!(userData.address?.street_address);

      setStats({
        totalOrders,
        pendingOrders: totalOrders, // You could filter by status if needed
        hasAddress
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  return (
    <>
      <div
        className="tab-pane fade show active"
        id="v-pills-home"
        role="tabpanel"
        aria-labelledby="v-pills-home-tab"
        tabIndex="{0}"
      >
        <div className="dashboard-account-area">
          <h2 className="title">
            Hello {user?.firstname || user?.username}! 
          </h2>
          <p className="disc">
            From your account dashboard you can view your{" "}
            <Link to="/account/order" style={{ color: '#629D23', fontWeight: 'bold' }}>
              recent orders
            </Link>
            , manage your{" "}
            <Link to="/account/address" style={{ color: '#629D23', fontWeight: 'bold' }}>
              shipping and billing addresses
            </Link>
            , and edit your{" "}
            <Link to="/account/accountdetails" style={{ color: '#629D23', fontWeight: 'bold' }}>
              password and account details
            </Link>
            .
          </p>

          {/* Quick Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '30px'
          }}>
            <div style={{
              backgroundColor: '#f9f9f9',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              border: '2px solid #e0e0e0'
            }}>
              <i className="fa fa-shopping-bag" style={{ fontSize: '32px', color: '#629D23', marginBottom: '10px' }}></i>
              <h3 style={{ margin: '10px 0', fontSize: '24px', color: '#333' }}>{stats.totalOrders}</h3>
              <p style={{ margin: 0, color: '#666' }}>Total Orders</p>
              <Link to="/account/order" style={{ 
                display: 'inline-block',
                marginTop: '10px',
                color: '#629D23',
                fontSize: '14px'
              }}>
                View Orders →
              </Link>
            </div>

            <div style={{
              backgroundColor: '#f9f9f9',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              border: '2px solid #e0e0e0'
            }}>
              <i className="fa fa-map-marker-alt" style={{ fontSize: '32px', color: '#629D23', marginBottom: '10px' }}></i>
              <h3 style={{ margin: '10px 0', fontSize: '24px', color: '#333' }}>
                {stats.hasAddress ? '✓' : '✗'}
              </h3>
              <p style={{ margin: 0, color: '#666' }}>
                {stats.hasAddress ? 'Address Added' : 'No Address'}
              </p>
              <Link to="/account/address" style={{ 
                display: 'inline-block',
                marginTop: '10px',
                color: '#629D23',
                fontSize: '14px'
              }}>
                {stats.hasAddress ? 'Edit Address' : 'Add Address'} →
              </Link>
            </div>

            <div style={{
              backgroundColor: '#f9f9f9',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              border: '2px solid #e0e0e0'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#629D23',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0 auto 10px',
                textTransform: 'uppercase'
              }}>
                {(user?.firstname?.charAt(0) || '') + (user?.lastname?.charAt(0) || '') || user?.username?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase()}
              </div>
              <h3 style={{ margin: '10px 0', fontSize: '18px', color: '#333' }}>
                {user?.firstname || user?.username || 'User'} {user?.lastname || ''}
              </h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{user?.email}</p>
              <Link to="/account/accountdetails" style={{ 
                display: 'inline-block',
                marginTop: '10px',
                color: '#629D23',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                Edit Details →
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <Link 
                to="/products" 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  backgroundColor: '#629D23',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#527d1d'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#629D23'}
              >
                <i className="fa fa-shopping-cart" style={{ marginRight: '8px' }}></i>
                <span>Continue Shopping</span>
              </Link>
              <Link 
                to="/account/order" 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
              >
                <i className="fa fa-list" style={{ marginRight: '8px' }}></i>
                <span>View Orders</span>
              </Link>
              <Link 
                to="/wishlist" 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ee5a52'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff6b6b'}
              >
                <i className="fa fa-heart" style={{ marginRight: '8px' }}></i>
                <span>My Wishlist</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetails;
