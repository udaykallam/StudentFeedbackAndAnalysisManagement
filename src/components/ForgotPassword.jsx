import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading'; // import loading spinner

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading status
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    // Set loading state to true when request starts
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/auth/forgot-password/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle response
      if (response.ok) {
        toast.success('Password reset link sent to your email');
        navigate('/');
      } else if (response.status === 404) {
        toast.error('User with the provided mail not found');
      } else {
        toast.error('Error sending reset link. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Error sending reset link. Please try again.');
    } finally {
      // Set loading state to false when the request finishes (success or error)
      setLoading(false);
    }
  };

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card mt-5">
              <div className="card-body">
                <h4 className="card-title text-center mb-4">Forgot Password</h4>
                <form onSubmit={handleForgotPassword}>
                  <div className="form-group mb-3">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading} // Disable button when loading
                  >
                    {loading ? (
                      <ReactLoading type={'spin'} color={'white'} height={20} width={20} />
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
