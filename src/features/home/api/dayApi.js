import { httpClient } from "@/core/http/httpClient";

export const dayApi = {
    getStatus: () => httpClient.get('/day/status'),
}