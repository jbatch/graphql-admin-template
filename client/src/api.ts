import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';
import { request, gql } from 'graphql-request';
import { UserResponse } from '@repo/shared/User';

const endpoint = `http://localhost:8000/graphql`;

export function useMeQuery() {
  return useQuery<UserResponse, { message: string }>(
    'me',
    async () => {
      const res = await request<{ me: UserResponse }>(
        endpoint,
        gql`
          query {
            me {
              user {
                id
                username
              }
              errors {
                message
              }
            }
          }
        `
      );
      if (res.me.errors) throw new Error(res.me.errors.map((e) => e.message).join('\n'));
      return res.me;
    },
    { retry: false }
  );
}

export function useLoginMutation() {
  return useMutation('login', async () => {
    console.log('login');
    const res = await request(
      endpoint,
      gql`
        mutation {
          login(options: { username: "New User", password: "password" }) {
            user {
              id
              username
            }
            errors {
              field
              message
            }
          }
        }
      `
    );
    console.log(res);
    return res;
  });
}
