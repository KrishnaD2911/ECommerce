/**
 * Mock Auth Service
 * Since the backend auth.middleware.js automatically mocks an admin user
 * in development mode, we don't need real JWT tokens for now.
 * This service just provides the expected interface for productService.
 */
const getCurrentUser = () => {
  return {
    name: 'Admin User',
    email: 'admin@shopvault.com',
    role: 'admin',
    token: 'dev-admin-token'
  };
};

const authService = {
  getCurrentUser
};

export default authService;
