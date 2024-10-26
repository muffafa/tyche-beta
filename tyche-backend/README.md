# Tyche Backend

## Setup

Create a `.env` file in the root directory and add the following environment variables:

```.env
# Application Configuration
NODE_ENV=development
PORT=5002
MONGO_URI=
REDIS_URL=redis://localhost:6379

# Auth Configuration
WALLET_ENCRYPTION_SECRET=
WALLET_SIGNING_KEY=
BCRYPT_SALT=10
JWT_SECRET=
JWT_EXPIRE=30d

# Web3 Configuration
ALCHEMY_API_KEY=
HELIUS_API_KEY=

# Email Configuration
EMAIL_HOST=smtp.your-email-provider.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
FROM_NAME=Tyche Support
FROM_EMAIL=your-email@example.com
```

## Running Backend

For the initial run, execute `pnpm install`, then:

```bash
pnpm run dev
```

#### Alternative: Running with Docker

- Install [docker](https://www.docker.com/products/docker-desktop/) and run it.
- In `backend` directory:

```bash
   docker compose up --build
```

- Backend will be running on `http://localhost:5005/`
