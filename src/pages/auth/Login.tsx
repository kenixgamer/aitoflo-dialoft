import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { login } from "../../service/user.service";
import { useContext } from "react";
import { UserContext } from "../../context";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleSuccess = async (response: any) => {
    try {
      // Add better type safety instead of 'any'
      const userData = await login(response.credential);
      setUser(userData);
      // Add error handling if userData.workShops is empty
      if (!userData.workShops?.length) {
        throw new Error("No workshops available");
      }
      navigate(`/${userData.workShops[0]._id}/agents`);
      toast({
        title : "Success",
        description : "Logged in successfully",
        variant : "success"
      })
    } catch (error) {
      // Add proper error handling with user feedback
    }
  };

  const handleFailure = () => {
    console.error("Google Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId="142038091206-kmtoopv36e5da9n40l202tl7lhfq3e64.apps.googleusercontent.com">
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-[0_0_15px_rgba(0,0,0,0.2)] p-8 space-y-8">
            {/* Logo and Title */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3  rounded-xl shadow-[0_0_10px_rgba(147,51,234,0.3)]">
                  <img src="/logo.jpg" className="w-10 h-10 object-contain" alt="logo" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome to DialoftAI</h1>
                <p className="text-zinc-400 mt-2">Sign in to your account to continue</p>
              </div>
            </div>

            {/* Divider with text */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-zinc-400">Continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleFailure}
                  theme="filled_black"
                  size="large"
                  width="300"
                  text="continue_with"
                  shape="pill"
                />
              </div>
            </div>

            {/* Footer Text */}
            <p className="text-center text-sm text-zinc-400 mt-8">
              By signing in, you agree to our{" "}
              <Link to='/terms-of-service' className="text-purple-500 hover:text-purple-400 transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy-policy" className="text-purple-500 hover:text-purple-400 transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
