import "https://deno.land/std@0.177.0/dotenv/load.ts";

export default {
    port: parseInt(Deno.env.get('PORT') || '8080'),
    mongo: {
        userName: Deno.env.get('MONGODB_USER') || '',
        password: Deno.env.get('MONGODB_PASSWORD') || '',
        host: Deno.env.get('MONGODB_HOST') || 'localhost',
        db: 'nostrSpamDetection',
        options: Deno.env.get('MONGODB_OPTIONS') || ''
    }
};