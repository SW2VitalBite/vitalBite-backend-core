import { Logger } from '@nestjs/common';
import { ApolloServerPlugin, BaseContext } from '@apollo/server';
import { GraphQLRequestContextWillSendResponse } from '@apollo/server';

const logger = new Logger('GraphQL');

export function createGraphqlLoggingPlugin(
  enabled: boolean,
): ApolloServerPlugin<BaseContext> {
  return {
    requestDidStart(requestContext) {
      if (!enabled) {
        return Promise.resolve();
      }

      const startedAt = Date.now();
      const operationName = requestContext.request.operationName ?? 'anonymous';
      const query = requestContext.request.query?.trim();
      const variables = requestContext.request.variables;

      logger.log(`[Request] ${operationName}`);

      if (query) {
        logger.log(`[Query] ${query}`);
      }

      if (variables && Object.keys(variables).length > 0) {
        logger.log(`[Variables] ${stringifyForLog(variables)}`);
      }

      return Promise.resolve({
        willSendResponse(
          responseContext: GraphQLRequestContextWillSendResponse<BaseContext>,
        ) {
          const durationMs = Date.now() - startedAt;
          logger.log(`[Response] ${operationName} ${durationMs}ms`);
          logger.log(
            `[Result] ${stringifyForLog(responseContext.response.body)}`,
          );

          return Promise.resolve();
        },
      });
    },
  };
}

function stringifyForLog(value: unknown): string {
  return JSON.stringify(
    value,
    (_key, nestedValue: unknown) =>
      typeof nestedValue === 'bigint' ? nestedValue.toString() : nestedValue,
    2,
  );
}
