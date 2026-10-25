import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/data/queryKeys';
import { categoriesApi } from './useCategoriesApi';

export default function useCategories() {
    const query = useQuery({ queryKey: queryKeys.categories.list, queryFn: categoriesApi.list, staleTime: 5 * 60 * 1000});
    return { categories: query.data ?? [] };
}