import { useQuery } from '@apollo/client';

import { GET_WORKS } from './queries';
import type { Work } from '../../../entities/work/model/work';

export const useWorks = () => {
  const { data, loading, error, refetch } = useQuery<{ works: Work[] }>(GET_WORKS, {
    fetchPolicy: 'network-only',
  });

  return {
    works: data?.works ?? [],
    loading,
    error,
    refetch,
  };
};
