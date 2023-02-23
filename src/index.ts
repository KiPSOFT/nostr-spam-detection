import relays from "./config/relays.json" assert { type: "json" };
import { Nostr } from 'https://deno.land/x/nostr_deno_client@v0.2.7/mod.ts';
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import NaiveBayes from "npm:@ladjs/naivebayes";

function getHoursAgo(hours: number): number {
    return Math.floor(Date.now() / 1000) - (hours * 60 * 60);
}

const nostr = new Nostr();

for (const relay of relays) {
    nostr.relayList.push(relay as never);
}
await nostr.connect();


async function getContent(eventId: string) {
    const filter = { kinds: [1, 6, 7], '#e': [eventId] };
    const events = await nostr.filter(filter).collect();
    return events;
}

async function getEvents(negative: boolean = false) {
    const since = getHoursAgo(12);
    const filter = { kinds: [negative ? 1984 : 1], since };
    const events = await nostr.filter(filter).collect();
    return events;
}

const app = new Application();

const port = parseInt(Deno.env.get('PORT') || '9080');

const router = new Router();

const classifier = new NaiveBayes();

router.get('/generateModel', async ({request, response}) => {
    console.log('Negative events checking...');
    const negativeEvents = await getEvents(true);
    console.log('Negative events checked completed. ', negativeEvents.length);

    console.log('Positive events checking...');
    const positiveEvents = await getEvents(false);
    console.log('Positive events checked completed. ', positiveEvents.length);

    console.log('Model generating...');
    
    let i = 0;
    for (const event of negativeEvents) {
        try {
            const e = event.tags.find((itm: any) => itm[0] === 'e');
            const reportType = event.tags.find((itm: any) => itm[0] === 'report');
            if (e && reportType[1] === 'spam') {
                const id = e[1];
                const event = await getContent(id);
                if (event && event.length > 0 && event[0] && event[0].content) { 
                    const content = event[0].content;
                    classifier.learn(content, 'negative');
                }
            }
        } catch(err) {
            console.log('Error;', err.message);
        }
        i++;
        console.log(`Model generating... ${i} / ${negativeEvents.length} `);
    }

    for (const event of positiveEvents) {
        classifier.learn(event.content, 'positive');
    }

    console.log('Model generated.');

    response.status = 200;
    response.body = {
        message: 'Model generated.'
    };
});

router.post('/checkEvent', async ({request, response}) => {
    const data = await request.body().value;
    const categorize = classifier.categorize(data.content);
    response.status = 200;
    response.body = {
        categorize
    };
});

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log('Running on port ', port);

await app.listen({ port });