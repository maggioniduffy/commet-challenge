This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Structure 🧬

```bash
├── app
│   ├── api
│   │   └── prisma
│   └── components
├── constants
├── generated
│   └── prisma
│       └── runtime
├── lib
├── models
├── prisma
│   └── migrations
│       └── 20250423230703_init
├── public
└── utils
npm run dev
```

## Getting Started 🏁

First, run the development server:

```bash
npm run dev
```

## Enviroment Variables ⚙️

- DATABASE_URL
- DIRECT_URL
- NEXT_PUBLIC_API_BASE_URL

## Stack ❇️

- Next.js
- Prisma
- Supabase
- Aws

## Usage 💯

This app was created for a [Commet](https://commet.co/es/) challenge. The goal was to emulate a little of they work by taking in two CRM files, with different formats and types, and to transform and merge them in a single CRM file.
After achieving this, you can Save the data into the Supabase DB using the Prisma ORM, making this a serverless app.
Also, the files are stored in a AWS S3 bucket pointed from the database, making it easy to store images, and to upload more CRM files if desired.

### Live version!

[Go visit](https://commet-challenge-five.vercel.app/)
