import { httpClient } from "@/core/http/httpClient";

export const voiceApi = {
    transcribe: (blob) => {
        const form = new FormData();
        form.append('audio', blob, 'entry');
        return httpClient.post('/entries/transcribe', form);
    }
}