interface ImportMetaEnv {
  readonly VITE_HASURA_GRAPHQL_URL: string;
  readonly VITE_HASURA_ADMIN_SECRET: string;
  readonly VITE_HASURA_GRAPHQL_WS_URL: string;
  readonly DEV: boolean;
  readonly VITE_HASURA_QUERY_FIELD: string;
  readonly VITE_HASURA_INSERT_FIELD: string;
  readonly VITE_IFACE_WS_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
