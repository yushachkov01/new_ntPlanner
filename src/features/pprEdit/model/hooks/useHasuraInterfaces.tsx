/**
 * Хук для работы с интерфейсами устройств через Hasura + WebSocket.
 * - Грузит последнюю выборку интерфейсов по device/requestType (GraphQL).
 * - Реагирует на WS-события и обновляет список на лету.
 * Params:
 * - requestType: тип запроса ("interface")
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { graphqlClient } from '@/shared/lib/graphql/client';
import { subscribe } from '@/shared/ws/wsClient';
import type {
  FetchLastInterfacesQuery,
  FetchLastInterfacesQueryVariables,
} from '@entities/work/api/fetchLastInterfaces.generated';
import { FetchLastInterfacesDocument } from '@entities/work/api/fetchLastInterfaces.generated';
import type {
  InsertInterfaceRequestMutation,
  InsertInterfaceRequestMutationVariables,
} from '@entities/work/api/insertInterfaceRequest.generated';
import { InsertInterfaceRequestDocument } from '@entities/work/api/insertInterfaceRequest.generated';

type Props = { requestType: 'interface' | string };

export default function useHasuraInterfaces({ requestType }: Props) {
  /** UUID выбранного устройства */
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  /** Опции для селекта интерфейсов */
  const [ifaceOptions, setIfaceOptions] = useState<Array<{ label: string; value: string }>>([]);

  /** Индикатор загрузки GraphQL-запроса */
  const [isLoading, setIsLoading] = useState(false);

  /** Placeholder для селекта имён интерфейсов */
  const namePlaceholder = useMemo(
    () => (selectedDevice ? 'Выберите интерфейс' : 'Сначала выберите устройство'),
    [selectedDevice],
  );

  /**
   * Нормализация: массив имён -> {label,value}[]
   * Params:
   * - list: список имён интерфейсов
   */
  const normalizeInterfaces = useCallback((list?: string[] | null) => {
    return (list ?? []).map((name) => ({ label: name, value: name }));
  }, []);

  /**
   * Тянем последнюю запись query для выбранного устройства/типа.
   */
  const pullLatest = useCallback(async () => {
    if (!selectedDevice) return;
    setIsLoading(true);
    try {
      const variables: FetchLastInterfacesQueryVariables = {
        dev: selectedDevice,
        type: requestType,
      };
      const data = await graphqlClient.request<FetchLastInterfacesQuery>(
        FetchLastInterfacesDocument,
        variables,
      );
      const row = data?.query?.[0];
      const list = (row?.result as any)?.interfaces as string[] | undefined;
      setIfaceOptions(normalizeInterfaces(list));
    } finally {
      setIsLoading(false);
    }
  }, [normalizeInterfaces, requestType, selectedDevice]);

  /**
   * Инициировать обновление интерфейсов.
   */
  const requestRefresh = useCallback(async () => {
    if (!selectedDevice) return;
    const variables: InsertInterfaceRequestMutationVariables = {
      dev: selectedDevice,
      type: requestType,
    };
    await graphqlClient.request<InsertInterfaceRequestMutation>(
      InsertInterfaceRequestDocument,
      variables,
    );
  }, [requestType, selectedDevice]);

  /**
   * Подписка на общий WS:
   * Применяем только события iface.data, соответствующие нашему device и requestType.
   */
  useEffect(() => {
    const unsubscribe = subscribe((msg) => {
      try {
        if (!msg) return;
        if (msg?.type === 'iface.ping' || msg?.type === 'iface.connected') return;

        const isIfaceEvent = msg?.type === 'iface.data' || msg?.type === 'iface.result';
        if (!isIfaceEvent) return;
        const tableName = String(msg?.table ?? '');
        const okTable =
            tableName === 'query' ||
            tableName === 'public.query'

        const incomingRequestType = String(msg?.requestType ?? msg?.payload?.request_type ?? '');
        const okType = incomingRequestType === String(requestType);

        const incomingDeviceId = String(
            msg?.deviceId ?? msg?.payload?.device_id ?? msg?.payload?.deviceId ?? '',
        );
        const okDevice =
            !!selectedDevice && incomingDeviceId !== '' && incomingDeviceId === String(selectedDevice);

        if (okTable && okType && okDevice) {
          const list: string[] =
              msg?.interfaces ??
              msg?.payload?.interfaces ??
              msg?.result?.interfaces ??
              msg?.payload?.result?.interfaces ??
              [];
          setIfaceOptions(normalizeInterfaces(list));
        }
      } catch {}
    });

    return () => unsubscribe();
  }, [normalizeInterfaces, requestType, selectedDevice]);

  /**
   * При смене устройства — очищаем список и подтягиваем свежие данные.
   */
  useEffect(() => {
    setIfaceOptions([]);
    if (selectedDevice) pullLatest();
  }, [pullLatest, selectedDevice]);

  return {
    selectedDevice,
    setSelectedDevice,
    ifaceOptions,
    isLoading,
    namePlaceholder,
    requestRefresh,
  };
}
