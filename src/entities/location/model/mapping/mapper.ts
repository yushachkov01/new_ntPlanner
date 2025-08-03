/**
 * Мапперы и типы raw ⇄ domain для таблиц providers, branches, cities, nodes
 * params: нет
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
export type RawProvider = FetchProvidersQuery['public7_providers'][number];
export type RawBranch = FetchBranchesQuery['public7_branches'][number];
export type RawCity = FetchCitiesQuery['public7_cities'][number];
export type RawNode = FetchNodesQuery['public7_nodes'][number];

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

/* ---------- domain → raw (для insert / update) ---------- */
/**
 * Входные данные для вставки провайдера
 */
export type RawProviderInput = Omit<RawProvider, 'id'>;
/**
 * Входные данные для вставки филиала
 */
export type RawBranchInput = Omit<RawBranch, 'id'>;
/**
 * Входные данные для вставки города
 */
export type RawCityInput = Omit<RawCity, 'id'>;
/**
 * Входные данные для вставки узла
 */
export type RawNodeInput = Omit<RawNode, 'id'>;

/**
 * Преобразование Provider → RawProviderInput
 * @param provider — доменная модель Provider
 * @returns RawProviderInput
 */
export const toRawProvider = (provider: Provider): RawProviderInput => ({
  name: provider.name,
});

/**
 * Преобразование Branch → RawBranchInput
 * @param branch — доменная модель Branch
 * @returns RawBranchInput
 */
export const toRawBranch = (branch: Branch): RawBranchInput => ({
  name: branch.name,
  provider_id: branch.providerId,
});

/**
 * Преобразование City → RawCityInput
 * @param city — доменная модель City
 * @returns RawCityInput
 */
export const toRawCity = (city: City): RawCityInput => ({
  name: city.name,
  time_zone: city.timeZone,
  branch_id: city.branchId,
});

/**
 * Преобразование Node → RawNodeInput
 * @param node — доменная модель Node
 * @returns RawNodeInput
 */
export const toRawNode = (node: Node): RawNodeInput => ({
  name: node.name,
  address: node.address,
  city_id: node.cityId,
});
