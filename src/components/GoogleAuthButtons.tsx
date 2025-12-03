import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { UserPlus, LogIn, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { trackAuthIntentLogin, trackAuthIntentRegister, trackGoogleAuthStart, trackGoogleAuthError } from "../utils/analytics";

export function GoogleAuthButtons() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleAuth = async (type: 'register' | 'login') => {
    setLoading(true);
    setError(null);

    try {
      // Track auth intent
      if (type === 'login') {
        trackAuthIntentLogin();
      } else {
        trackAuthIntentRegister();
      }
      
      // Store the auth intent in sessionStorage so App.tsx can detect it
      sessionStorage.setItem('auth_intent', type);
      
      // Track Google auth start
      trackGoogleAuthStart(type);
      
      const result = await signInWithGoogle();

      if (!result.success) {
        const errorMsg = result.error || `Failed to ${type} with Google`;
        setError(errorMsg);
        sessionStorage.removeItem('auth_intent');
        
        // Track auth error
        trackGoogleAuthError('AUTH_FAILED', errorMsg);
      }
      // If successful, the useAuth context will handle the user state update
      // and the modal will close automatically due to the user state change
      // Success tracking is done in App.tsx after auth completes
    } catch (error: any) {
      console.error(`Google ${type} error:`, error);
      const errorMsg = `An error occurred during Google ${type}`;
      setError(errorMsg);
      sessionStorage.removeItem('auth_intent');
      
      // Track auth error
      trackGoogleAuthError('AUTH_EXCEPTION', error?.message || errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* New User Registration Option */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="default"
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => handleGoogleAuth('register')}
          disabled={loading}
        >
          <div className="flex items-center space-x-3">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </>
            )}
          </div>
          <div className="flex flex-col items-start flex-1">
            <span className="font-semibold text-base">Register as New User</span>
            <span className="text-blue-100 text-sm">Create your account with Google</span>
          </div>
        </Button>
      </motion.div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">or</span>
        </div>
      </div>

      {/* Existing User Login Option */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button
          variant="outline"
          className="w-full h-14 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={() => handleGoogleAuth('login')}
          disabled={loading}
        >
          <div className="flex items-center space-x-3">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
            ) : (
              <>
                <LogIn className="h-5 w-5 text-purple-600" />
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </>
            )}
          </div>
          <div className="flex flex-col items-start flex-1">
            <span className="font-semibold text-base text-gray-700">Already A User, Login</span>
            <span className="text-gray-500 text-sm">Sign in with your Google account</span>
          </div>
        </Button>
      </motion.div>

      {/* Demo Mode Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="text-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-lg"
      >
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <p className="text-sm text-purple-800 font-medium">
            Demo Mode Active
          </p>
        </div>
        <p className="text-xs text-purple-600 mt-1">
          Both options will create a demo account for testing
        </p>
      </motion.div>
    </div>
  );
}