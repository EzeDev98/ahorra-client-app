import { httpClient } from "@/core/http/httpClient";

export const categoriesApi = {
    list: () => httpClient.get('/categories'),
}