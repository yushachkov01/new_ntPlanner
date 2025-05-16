import { useMutation } from '@apollo/client';

import { UPDATE_WORK_STATUS } from './mutations';

export const useUpdateWorkStatus = () => {
  const [mutate, { loading, error }] = useMutation(UPDATE_WORK_STATUS, {
    refetchQueries: ['GetWorks'],
  });

  return {
    updateStatus: mutate,
    loading,
    error,
  };
};
