// Jest setup file to mock external dependencies
// Set required environment variables for testing before any modules load
process.env.RESEND_API_KEY = "re_test_key";
process.env.JWT_SECRET = "test_jwt_secret";
process.env.JWT_EXPIRES_IN = "1h";
process.env.JWT_REFRESH_EXPIRES_IN = "7d";
process.env.NODE_ENV = "test";

