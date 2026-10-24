import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/data/queryKeys';
import { categoriesApi } from './api/categoriesApi.js';

export default function useCategories() {
    const query = useQuery({ queryKey: queryKeys.categories.list(), queyFn: categoriesApi.list, staleTime: 5 * 60 * 1000 });
    return { categories: query.data ?? [] };
}