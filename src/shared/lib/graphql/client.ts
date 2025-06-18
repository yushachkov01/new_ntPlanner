/**
 * Отвечает за создание и экспорт единого экземпляра HTTP-клиента для всех GraphQL-запросов серверу (Hasura).
 */
import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient(
    import.meta.env.VITE_HASURA_GRAPHQL_URL!,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': import.meta.env.VITE_HASURA_ADMIN_SECRET!,
      },
    },
);
