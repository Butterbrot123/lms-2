# A basic Remix setup for your exam project

This is a basic web app setup that integrates [Remix][remix] with [Mongoose][mongoose] (and thereby [MongoDB][mongodb]), and configures [Tailwind CSS][tailwindcss] and [Prettier][prettier]. NB: It is "locked" to Remix v1.14.3 to match the version currently used in `golden-candidates` and in the exercises we've done in class.

## Getting started

1. Duplicate `.env.example` to a new file called `.env` and add your MongoDB connection string as the `MONGODB_URL` variable
2. Run `npm install` to install dependencies

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

[tailwindcss]: https://tailwindcss.com
[mongodb]: https://www.mongodb.com/atlas
[mongoose]: https://mongoosejs.com
[prettier]: https://prettier.io
[remix]: https://remix.run
