import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';
import { request, gql } from 'graphql-request';
import { UserResponse } from '@repo/shared/User';
import { LoginInput } from '@repo/shared/LoginInput';

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
    { retry: false, cacheTime: 0 }
  );
}

export function useLoginMutation() {
  return useMutation('login', async (loginInput: LoginInput) => {
    console.log('login');
    const res = await request<{ login: UserResponse }>(
      endpoint,
      gql`
        mutation Login($username: String!, $password: String!) {
          login(options: { username: $username, password: $password }) {
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
      `,
      loginInput
    );
    return res.login;
  });
}
