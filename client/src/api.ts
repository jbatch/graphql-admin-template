import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';
import { request, gql } from 'graphql-request';

const endpoint = `/api`;

function useMe() {
  return useQuery('posts', async () => {
    const {
      posts: { data },
    } = await request(
      endpoint,
      gql`
        query {
          posts {
            data {
              id
              title
            }
          }
        }
      `
    );
    return data;
  });
}
