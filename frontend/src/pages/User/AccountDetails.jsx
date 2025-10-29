import React, { useContext, useEffect, useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { UserContext } from "../../utils/UserContext.jsx";

function AccountDetails() {

  const user = useContext(UserContext)

  const [firstname, setFirstName] = useState("")
  const [lastname, setLastName] = useState("")
  const [username, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstname || "")
      setLastName(user.lastname || "")
      setUserName(user.username || "")
      setEmail(user.email || "")
    }

  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentPassword) {
      toast.error("Current password is required for any changes")
      return;
    }

    // If changing password, validate new password
    if (isChangingPassword) {
      if (!newPassword || !confirmPassword) {
        toast.error("Please enter new password and confirm it")
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match")
        return;
      }
      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters")
        return;
      }
    }

    const toastId = toast.loading("Updating account...");
    const userdata = { 
      firstname, 
      lastname, 
      username, 
      email, 
      currentPassword,
      newPassword: isChangingPassword ? newPassword : undefined
    }

    try {
      const response = await api.post('/api/userupdate', userdata)
      
      // Update localStorage
      const updatedUser = { ...user, firstname, lastname };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.update(toastId, {
        render: response.data.message || "Account updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
      
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setIsChangingPassword(false)
    } catch (error) {
      toast.update(toastId, {
        render: error.response?.data?.message || "Failed to update account",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  }


  return (
    <>
      <form className="account-details-area" onSubmit={handleSubmit}>
        <h2 className="title">Account Details</h2>
        <div className="input-half-area">
          <div className="single-input">
            <input type="text" placeholder="First Name" value={firstname} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="single-input">
            <input type="text" placeholder="Last Name" value={lastname} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        <input type="text" placeholder="Display Name" value={username} autoComplete="username" onChange={(e) => setUserName(e.target.value)} readOnly />
        <input type="email" placeholder="Email Address *" value={email} autoComplete="email" onChange={(e) => setEmail(e.target.value)} readOnly />
        
        <div style={{ marginTop: '20px', marginBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={isChangingPassword}
              onChange={(e) => setIsChangingPassword(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            <span>Change Password</span>
          </label>
        </div>

        <input 
          type="password" 
          placeholder="Current Password (required for any changes) *" 
          autoComplete="current-password" 
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)} 
        />
        
        {isChangingPassword && (
          <>
            <input 
              type="password" 
              placeholder="New Password (min 6 characters) *" 
              autoComplete="new-password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Confirm New Password *" 
              autoComplete="new-password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        )}
        
        <button className="rts-btn btn-primary" type="submit">Save Changes</button>
      </form>    </>
  );
}

export default AccountDetails;
