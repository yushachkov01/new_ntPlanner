/**
 * Мапперы и типы raw ⇄ domain для таблиц providers, branches, cities, nodes
 */
import type { FetchBranchesQuery } from '@entities/work/api/fetchBranches.generated';
import type { FetchCitiesQuery } from '@entities/work/api/fetchCities.generated';
import type { FetchNodesQuery } from '@entities/work/api/fetchNodes.generated';
import type { FetchProvidersQuery } from '@entities/work/api/fetchProviders.generated';

/**
 * Сырые типы, получаемые из GraphQL (Raw)
 * @property provider_id — ID провайдера (в ветке)
 * @property branch_id — ID филиала (в городе)
 * @property time_zone — часовой пояс (в городе)
 * @property address — адрес площадки (может быть null)
 * @property city_id — ID города (в узле)
 */
export type RawProvider = FetchProvidersQuery['providers'][number];
export type RawBranch = FetchBranchesQuery['branches'][number];
export type RawCity = FetchCitiesQuery['cities'][number];
export type RawNode = FetchNodesQuery['nodes'][number];

/**
 * Доменная модель провайдера
 * @property id — UUID
 * @property name — название провайдера
 */
export interface Provider {
  id: string;
  name: string;
}

/**
 * Доменная модель филиала
 * @property id — UUID
 * @property name — название филиала
 * @property providerId — UUID провайдера
 */
export interface Branch {
  id: string;
  name: string;
  providerId: string;
}

/**
 * Доменная модель города
 * @property id — UUID
 * @property name — название города
 * @property timeZone — часовой пояс
 * @property branchId — UUID филиала
 */
export interface City {
  id: string;
  name: string;
  timeZone: string;
  branchId: string;
}

/**
 * Доменная модель узла (площадки)
 * @property id — UUID
 * @property name — название площадки
 * @property address — адрес площадки
 * @property cityId — UUID города
 */
export interface Node {
  id: string;
  name: string;
  address: string;
  cityId: string;
}

/**
 * Преобразование RawProvider → Provider
 * @param raw — запись RawProvider
 * @returns Provider
 */
export const toDomainProvider = (raw: RawProvider): Provider => ({
  id: raw.id,
  name: raw.name,
});

/**
 * Преобразование RawBranch → Branch
 * @param raw — запись RawBranch
 * @returns Branch
 */
export const toDomainBranch = (raw: RawBranch): Branch => ({
  id: raw.id,
  name: raw.name,
  providerId: raw.provider_id,
});

/**
 * Преобразование RawCity → City
 * @param raw — запись RawCity
 * @returns City
 */
export const toDomainCity = (raw: RawCity): City => ({
  id: raw.id,
  name: raw.name,
  timeZone: raw.time_zone,
  branchId: raw.branch_id,
});

/**
 * Преобразование RawNode → Node
 * @param raw — запись RawNode
 * @returns Node
 */
export const toDomainNode = (raw: RawNode): Node => ({
  id: raw.id,
  name: raw.name,
  address: raw.address ?? '',
  cityId: raw.city_id,
});
