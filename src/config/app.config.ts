export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  graphqlPlayground: process.env.GRAPHQL_PLAYGROUND === 'true',
  graphqlLogResponses: process.env.GRAPHQL_LOG_RESPONSES !== 'false',
  databaseUrl: process.env.DATABASE_URL,
  demoUserEmail: process.env.DEMO_USER_EMAIL ?? 'elena.cruz@gmail.com',
});
