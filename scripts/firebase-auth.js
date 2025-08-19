// Firebase Authentication Functions

class FirebaseAuthService {
  constructor() {
    this.auth = window.firebaseAuth;
    this.currentUser = null;
    this.initAuthStateListener();
  }

  // Initialize auth state listener
  initAuthStateListener() {
    this.auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      if (user) {
        console.log('User is signed in:', user.email);
        // Redirect to home page or update UI
        this.handleUserSignedIn(user);
      } else {
        console.log('User is signed out');
        this.handleUserSignedOut();
      }
    });
  }

  // Handle user signed in state
  handleUserSignedIn(user) {
    // Update UI to show user is logged in
    const userEmail = document.getElementById('userEmail');
    if (userEmail) {
      userEmail.textContent = user.email;
    }
    
    // Redirect from auth pages if already logged in
    if (window.location.pathname.includes('login.html') || 
        window.location.pathname.includes('signup.html')) {
      window.location.href = 'index.html';
    }
  }

  // Handle user signed out state
  handleUserSignedOut() {
    // Update UI to show login/signup options
    console.log('User logged out');
  }

  // Sign up with email and password
  async signUp(email, password, fullName) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      
      // Update user profile with full name
      await userCredential.user.updateProfile({
        displayName: fullName
      });

      // Send email verification
      await userCredential.user.sendEmailVerification();
      
      return {
        success: true,
        user: userCredential.user,
        message: 'Account created successfully! Please check your email for verification.'
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
        code: error.code
      };
    }
  }

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      
      return {
        success: true,
        user: userCredential.user,
        message: 'Signed in successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
        code: error.code
      };
    }
  }

  // Sign out
  async signOut() {
    try {
      await this.auth.signOut();
      return {
        success: true,
        message: 'Signed out successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await this.auth.sendPasswordResetEmail(email);
      return {
        success: true,
        message: 'Password reset email sent! Please check your inbox.'
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Get user-friendly error messages
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered. Please use a different email or try logging in.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
      'auth/weak-password': 'Password is too weak. Please use a stronger password.',
      'auth/user-disabled': 'This account has been disabled. Please contact support.',
      'auth/user-not-found': 'No account found with this email. Please check your email or sign up.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
      'auth/internal-error': 'An unexpected error occurred. Please try again.'
    };
    
    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  }

  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }
}

// Initialize Firebase Auth Service
const firebaseAuthService = new FirebaseAuthService();

// Make available globally
window.firebaseAuthService = firebaseAuthService;
