/**
 * GraphQL-клиент для «locations»
 */
import { graphqlClient } from '@/shared/lib/graphql/client';
import type { FetchLocationQuery } from '@entities/work/api/fetchLocation.generated.ts';
import { FetchLocationDocument } from '@entities/work/api/fetchLocation.generated.ts';

/** Тип доменной модели */
export interface Location {
  provider: string;
  branch: string;
  city: string;
  street: string;
}

/**
 * Загружает запись locations
 */
export async function fetchLocation(): Promise<Location | null> {
  const { locations } = await graphqlClient.request<FetchLocationQuery>(FetchLocationDocument, {});
  return locations[0] ?? null;
}
