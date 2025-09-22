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
export async function fetchProviders(): Promise<FetchProvidersQuery['providers']> {
  const { providers } = await graphqlClient.request<FetchProvidersQuery>(
    FetchProvidersDocument,
    {},
  );
  return providers;
}

/**
 * Получить список филиалов
 */
export async function fetchBranches(): Promise<FetchBranchesQuery['branches']> {
  const { branches } = await graphqlClient.request<FetchBranchesQuery>(
    FetchBranchesDocument,
    {},
  );
  return branches;
}

/**
 * Получить список городов
 */
export async function fetchCities(): Promise<FetchCitiesQuery['cities']> {
  const { cities } = await graphqlClient.request<FetchCitiesQuery>(FetchCitiesDocument, {});
  return cities;
}

/**
 * Получить список узлов
 */
export async function fetchNodes(): Promise<FetchNodesQuery['nodes']> {
  const { nodes } = await graphqlClient.request<FetchNodesQuery>(FetchNodesDocument, {});
  return nodes;
}
