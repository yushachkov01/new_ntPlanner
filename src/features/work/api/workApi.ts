import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Work } from 'entities/work/model/types';
import { createClient } from 'graphql-ws';

import { mapWorkDtoToWork } from './mappers';
import type { WorkDto } from './types';

const HTTP_URL = import.meta.env.VITE_HASURA_GRAPHQL_URL!;
const WS_URL = import.meta.env.VITE_HASURA_GRAPHQL_WS_URL!;
const SECRET = import.meta.env.VITE_HASURA_ADMIN_SECRET!;

const httpBase = fetchBaseQuery({
  baseUrl: HTTP_URL,
  prepareHeaders(headers) {
    headers.set('Content-Type', 'application/json');
    if (SECRET) headers.set('x-hasura-admin-secret', SECRET);
    return headers;
  },
});

//  Создаём GraphQL-WS клиент
const wsClient = createClient({
  url: WS_URL,
  connectionParams: SECRET ? { headers: { 'x-hasura-admin-secret': SECRET } } : undefined,
});

export const workApi = createApi({
  reducerPath: 'workApi',
  baseQuery: httpBase,
  tagTypes: ['Works'],
  endpoints: (b) => ({
    getWorks: b.query<Work[], void>({
      // initial fetch
      query: () => ({
        method: 'POST',
        body: {
          query: `
            query GetWorks {
              works {
                id date project site description time_range status ppr_hours work_hours overtime_hours
              }
            }
          `,
        },
      }),
      transformResponse: (res: { data?: { works?: WorkDto[] } }) =>
        (res.data?.works ?? []).map(mapWorkDtoToWork),

      // real-time через WS и updateCachedData
      async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        await cacheDataLoaded;

        const unsubscribe = wsClient.subscribe(
          {
            query: `
              subscription OnWorksChanged {
                works {
                  id date project site description time_range status ppr_hours work_hours overtime_hours
                }
              }
            `,
          },
          {
            next: (msg) => {
              const dtos: WorkDto[] = msg.data?.works ?? [];
              updateCachedData((draft) => {
                draft.splice(0, draft.length, ...dtos.map(mapWorkDtoToWork));
              });
            },
            error: console.error,
            complete: () => {},
          },
        );

        await cacheEntryRemoved;
        unsubscribe();
      },
      providesTags: ['Works'],
    }),

    updateWorkStatus: b.mutation<Work, { id: number; status: string }>({
      query: ({ id, status }) => ({
        method: 'POST',
        body: {
          query: `
            mutation UpdateWorkStatus($id: Int!, $status: String!) {
              update_works(
                where: { id: { _eq: $id } },
                _set: { status: $status }
              ) {
                returning {
                  id date project site description time_range status ppr_hours work_hours overtime_hours
                }
              }
            }
          `,
          variables: { id, status },
        },
      }),
      transformResponse: (res: { data?: { update_works?: { returning?: WorkDto[] } } }) => {
        const dto = res.data?.update_works?.returning?.[0]!;
        return mapWorkDtoToWork(dto);
      },
      invalidatesTags: ['Works'],
    }),
  }),
});

export const { useGetWorksQuery, useUpdateWorkStatusMutation } = workApi;
