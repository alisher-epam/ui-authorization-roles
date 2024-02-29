import { useMutation, useQueryClient } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

const useUpdateUserRolesMutation = () => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace();
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (newRole) => ky.put(`roles/users/${newRole.userId}`, { json: newRole }).json(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(namespace);
    },
    onError: (error) => console.error(JSON.stringify(error)) // eslint-disable-line no-console
  });

  return { mutateUpdateUserRoles: mutateAsync, isLoading };
};

export default useUpdateUserRolesMutation;

