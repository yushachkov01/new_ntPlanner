/**
 * API-обёртка вокруг таблиц:
 * providers, branches, cities, nodes
 */
import { graphqlClient } from '@/shared/lib/graphql/client';
import type { FetchBranchesQuery } from '@entities/work/api/fetchBranches.generated';
import { FetchBranchesDocument } from '@entities/work/api/fetchBranches.generated';
import type { FetchCitiesQuery } from '@entities/work/api/fetchCities.generated';
import { FetchCitiesDocument } from '@entities/work/api/fetchCities.generated';
import type { FetchNodesQuery } from '@entities/work/api/fetchNodes.generated';
import { FetchNodesDocument } from '@entities/work/api/fetchNodes.generated';
import { FetchProvidersDocument } from '@entities/work/api/fetchProviders.generated';
import type { FetchProvidersQuery } from '@entities/work/api/fetchProviders.generated';

/**
 * Получить список провайдеров
 */
export async function fetchProviders(): Promise<FetchProvidersQuery['public7_providers']> {
  const { public7_providers } = await graphqlClient.request<FetchProvidersQuery>(
    FetchProvidersDocument,
    {},
  );
  return public7_providers;
}

/**
 * Получить список филиалов
 */
export async function fetchBranches(): Promise<FetchBranchesQuery['public7_branches']> {
  const { public7_branches } = await graphqlClient.request<FetchBranchesQuery>(
    FetchBranchesDocument,
    {},
  );
  return public7_branches;
}

/**
 * Получить список городов
 */
export async function fetchCities(): Promise<FetchCitiesQuery['public7_cities']> {
  const { public7_cities } = await graphqlClient.request<FetchCitiesQuery>(FetchCitiesDocument, {});
  return public7_cities;
}

/**
 * Получить список узлов
 */
export async function fetchNodes(): Promise<FetchNodesQuery['public7_nodes']> {
  const { public7_nodes } = await graphqlClient.request<FetchNodesQuery>(FetchNodesDocument, {});
  return public7_nodes;
}
