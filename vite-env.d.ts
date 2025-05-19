interface ImportMetaEnv {
  readonly VITE_HASURA_GRAPHQL_URL: string;
  readonly VITE_HASURA_ADMIN_SECRET: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
