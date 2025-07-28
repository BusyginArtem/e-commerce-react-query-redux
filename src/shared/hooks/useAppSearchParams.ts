import { useSearchParams } from 'react-router';

export const useAppSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setEmptyCategory = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { category, query, ...restSearchParams } = Object.fromEntries(
      searchParams.entries()
    );

    setSearchParams(
      {
        ...restSearchParams,
        page: String(1),
      },
      {
        replace: true,
      }
    );
  };

  const setSearchQuery = (query: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, category, ...restSearchParams } = Object.fromEntries(
      searchParams.entries()
    );

    setSearchParams(
      {
        ...restSearchParams,
        query: query ? query : '',
        page: String(1),
      },
      {
        replace: true,
      }
    );
  };

  const setPage = (page: number) => {
    const { page: prevPage, ...restSearchParams } = Object.fromEntries(
      searchParams.entries()
    );

    setSearchParams(
      {
        ...(prevPage === String(page) ? {} : { page: String(page) }),
        ...restSearchParams,
      },
      {
        replace: true,
      }
    );
  };

  const setCategory = (category: string) => {
    const { category: currentCategory, ...restSearchParams } =
      Object.fromEntries(searchParams.entries());

    setSearchParams(
      {
        ...restSearchParams,
        ...(currentCategory === category
          ? { page: String(1) }
          : { category, page: String(1) }),
      },
      {
        replace: true,
      }
    );
  };

  return {
    searchParams,
    setSearchParams,
    setEmptyCategory,
    setSearchQuery,
    setPage,
    setCategory,
    getCurrentPage: () => {
      return searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    },
    getCurrentCategory: () => {
      return searchParams.get('category') || '';
    },
    getCurrentQuery: () => {
      return searchParams.get('query') || '';
    },
  };
};
