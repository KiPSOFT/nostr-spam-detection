### Nostr Spam Detection with NaiveBayes Algorithm ###

This is a command line application that works on Nostr social media platform and uses NaiveBayes algorithm. It utilizes Oak module of Deno. There are two routes named /generateModel and /checkEvent. When generateModel route is called, events marked as spam with NIP-56 on Nostr are pulled from relay servers and labeled as negative in NaiveBayes library. Similarly, records from the last 12 hours that are not marked as spam are pulled and a model is created for classification. checkEvent route works with Http POST method and accepts JSON. It categorizes the information given in the content parameter of the body according to the model created with generateModel route as positive and negative and returns this parameter as a response to the request.

### Usage

- Install Deno on your system by following the instructions here.
- Clone the repository to your local machine.
- Navigate to the project directory in your terminal.
- Run the following command to start the application:

```
deno run --allow-net index.ts
```

- Use the application by sending Http POST requests to the routes /generateModel and /checkEvent.

### /generateModel Route

Route: /generateModel
Method: GET
Description: This route generates a model for spam detection by pulling the records marked as spam and not marked as spam from Nostr's relay servers and creating a NaiveBayes model for classification.

Example Usage:

```
curl http://localhost:8000/generateModel
```

### /checkEvent Route

Route: /checkEvent
Method: POST
Description: This route categorizes the information given in the content parameter of the body as positive or negative according to the model created with /generateModel route.
Request Body: JSON object with the following parameters:
content: The information to be categorized.
Response Body: JSON object with the following parameter:
categorize: The category of the information. Can be "positive" or "negative".

Example Usage:

```
curl -X POST -H "Content-Type: application/json" -d '{"content":"This is a spam message."}' http://localhost:8000/checkEvent
```

Response:

```
{"categorize":"negative"}
```

## Note:

This application only creates a model for spam detection from the events marked as spam on Nostr, it does not directly detect spam events on Nostr. The model is stored in memory and is not saved to a file.
