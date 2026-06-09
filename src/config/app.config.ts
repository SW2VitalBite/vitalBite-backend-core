export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  graphqlPlayground: process.env.GRAPHQL_PLAYGROUND === 'true',
  graphqlLogResponses: process.env.GRAPHQL_LOG_RESPONSES !== 'false',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  paymentsServiceUrl: process.env.PAYMENTS_SERVICE_URL,
  documentalServiceUrl: process.env.DOCUMENTAL_SERVICE_URL,
  aiServiceUrl: process.env.AI_SERVICE_URL,
  aiApiKey: process.env.AI_API_KEY,
});
