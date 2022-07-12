export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 5100,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27015',
});
