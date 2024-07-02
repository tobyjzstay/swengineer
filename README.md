![swengineer](images/logo.png)

# swengineer

## Prerequisites

-   [Node.js](https://nodejs.org/en/)
-   [pnpm](https://pnpm.io/)

```bash
npm install -g pnpm
```

## Installation

```bash
pnpm install
```

## Build

### Development

```bash
pnpm run start
```

Uses files created for build under [`client/src/`](client/src/). Hosted at http://localhost:3000/ by default.

#### Debug

```bash
pnpm run dev
```

### Production

```bash
pnpm run build
```

Uses files created for build under [`client/build/`](client/build/). Hosted at http://localhost:8080/ by default.

## Test

```
pnpm test
```
