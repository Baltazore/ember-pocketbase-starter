# PocketBase

Please go check out the [PocketBase website](https://pocketbase.io/) for more information.
Here is a [link to the PocketBase FAQ](https://pocketbase.io/faq/).

In this folder you can find simple Dockerfile that you can use to run your backend locally. Alternatively, you can [follow up quickstart guide](https://pocketbase.io/docs/) to run your backend locally without Docker.

## Running locally

To help with running pocketbase and managing data and migrations, we have `docker-compose.yaml` file.
Just run following command to start your backend locally:

```bash
docker compose up
```

You can also pass build flag to rebuild an image, if you did some changes in the `Dockerfile`:

```bash
docker compose up --build
```

Now you can open web UI for administration tasks in Pocketbase at [http://localhost:8090/_](http://localhost:8090/_).

## Deployment

Check official [PocketBase going to production guide](https://pocketbase.io/docs/going-to-production/) for more information.
