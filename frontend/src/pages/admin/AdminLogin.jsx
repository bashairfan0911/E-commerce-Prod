import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple hardcoded admin credentials
    const ADMIN_EMAIL = "admin@ekomart.com";
    const ADMIN_PASSWORD = "admin123";

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Store admin session
      localStorage.setItem("adminToken", "admin-logged-in");
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <>
      <div>
        {/* rts register area start */}
        <div
          className="rts-register-area rts-section-gap bg_light-1"
          style={{ height: "100vh" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="registration-wrapper-1">
                  <div className="logo-area mb--0">
                    <img
                      className="mb--10"
                      src="/images/logo/fav.png"
                      alt="logo"
                    />
                  </div>
                  <h3 className="title">Admin Login</h3>
                  <form onSubmit={handleSubmit} className="registration-form">
                    <div className="input-wrapper">
                      <label htmlFor="email">Email*</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="input-wrapper">
                      <label htmlFor="password">Password*</label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="rts-btn btn-primary">
                      Login Account
                    </button>
                  </form>
                  <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
                    <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                      <strong>Demo Credentials:</strong><br />
                      Email: admin@ekomart.com<br />
                      Password: admin123
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* rts register area end */}
      </div>    </>
  );
}

export default AdminLogin;
