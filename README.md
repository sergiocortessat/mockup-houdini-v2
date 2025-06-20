# Houdini Swap Frontend

A modern decentralized exchange platform built with Next.js 15, focusing on private and compliant crypto transactions.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Runtime:** Node.js >= 18.18.0
- **Package Manager:** Yarn
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Data Management:** Apollo Client + GraphQL
- **Monitoring:** Sentry
- **Code Quality:** ESLint, Prettier, Husky

## 🚀 Getting Started

1. **Setup Environment**

   ```bash
   # Install dependencies
   yarn install

   # Create and configure .env file
   .env.local
   ```

2. **Start Development**

   ```bash
   yarn dev
   ```

   Access at http://localhost:3000

3. **Build for Production**
   ```bash
   yarn build
   yarn start
   ```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (swap)/            # Swap feature routes
│   ├── exchange/          # Exchange feature
│   ├── staking/           # Staking feature
│   ├── blog/              # Blog pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── features/             # Feature-based modules
│   ├── swap/
│   ├── exchange-seo/
│   ├── token-listing/
│   └── staking/
├── providers/            # React context providers
├── graphql/              # Apollo + GraphQL setup
├── lib/                  # Utility functions
└── constants/           # Global constants
```

## 🔧 Development Tools

### Available Scripts

```bash
yarn dev          # Start development server with Turbopack
yarn build        # Create production build
yarn start        # Start production server
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint issues
yarn format       # Format code with Prettier
yarn format:check # Check code formatting
```

### Environment Variables

Create `.env.local` with the following structure (values should be obtained from your Vercel project settings):

```bash
# .env.local
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN="your_sentry_dsn_from_vercel"
NEXT_PUBLIC_SENTRY_URL="your_sentry_url_from_vercel"
SENTRY_SUPPRESS_TURBOPACK_WARNING=1

# GraphQL Endpoints
NEXT_PUBLIC_GQL_HTTP_URL="your_graphql_http_endpoint"
NEXT_PUBLIC_GQL_WS_URL="your_graphql_ws_endpoint"

# Blockchain Providers
NEXT_PUBLIC_REOWN_PROJECT_ID="your_reown_project_id"
NEXT_PUBLIC_SOLANA_RPC_URL="your_solana_rpc_url"
NEXT_PUBLIC_EVM_RPC_URL="your_evm_rpc_url"
NEXT_PUBLIC_SUI_RPC_URL="your_sui_rpc_url"
```

**Important Security Notes:**

1. Never commit actual values to version control
2. All sensitive values should be configured in Vercel environment variables
3. Use `npx vercel env pull` to sync with your Vercel project's environment
4. Add `.env.local` to your `.gitignore` file

## 💻 Code Quality

### Pre-commit Hooks

The project uses Husky and lint-staged to maintain code quality:

```bash
# .husky/pre-commit
yarn lint-staged
```

### Code Style

- TypeScript for type safety
- Prettier for code formatting
- ESLint for code quality
- Import sorting with @trivago/prettier-plugin-sort-imports
- File naming uses kebab-case pattern (e.g., `user-profile.tsx`, `auth-provider.ts`)

## 🌐 GraphQL Integration

### Apollo Client Setup

```typescript
// Example Apollo Client usage
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GQL_HTTP_URL,
  cache: new InMemoryCache(),
});
```

### GraphQL Code Generation

We use GraphQL Code Generator to automatically generate TypeScript types and hooks from our GraphQL operations.

#### Setup

```bash
# Install dependencies
yarn add -D @graphql-codegen/cli @graphql-codegen/typescript

# Generate types
yarn codegen
```

#### Configuration

```yaml:codegen.yml
schema: ${NEXT_PUBLIC_GQL_HTTP_URL}
documents: './features/**/graphql/**/*.graphql'
generates:
  ./graphql/generated.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
    config:
      withHooks: true
      withRefetchFn: true
```

#### Usage Example

```typescript
// features/swap/graphql/queries.graphql
query GetSwapPairs {
  pairs {
    id
    token0
    token1
    reserve0
    reserve1
  }
}

// In your React component
import { useGetSwapPairsQuery } from '@/graphql/generated';

function SwapComponent() {
  const { data, loading } = useGetSwapPairsQuery();
  // ...
}
```

### WebSocket Subscriptions

```typescript
// WebSocket connection for real-time updates
const wsLink = new GraphQLWsLink(
  createClient({
    url: GQL_WS_URL,
    connectionParams: () => ({ clientId }),
  })
);
```

## 🔍 Error Monitoring

- Sentry integration for error tracking
- Custom error boundaries for React components
- Structured logging in production

## 🌍 Internationalization (i18n)

The application implements robust multi-language support using:

- **next-intl** v3.26 for translations
- JSON-based locale files
- Type-safe translation keys
- Automatic locale detection

### Key Implementation

1. **Locale Structure**

   ```bash
   locales/
     en/
       en.json      # English translations
     es/
       es.json      # Spanish translations
     # Add new languages as needed
   ```

2. **Component Usage**

   ```typescript
   // Client components
   'use client';
   import { useTranslations } from 'next-intl';

   function Example() {
     const t = useTranslations('swap.form');
     return <button>{t('swapButton')}</button>;
   }
   ```

3. **Server-Side Usage**

   ```typescript
   // app/page.tsx
   import { getTranslations } from 'next-intl/server';

   export default async function Home() {
     const t = await getTranslations('');
     return <h1>{t('navigation.swap')}</h1>;
   }

   ```

4. **Dynamic Values**

   ```json
   {
     "welcome": "Welcome, {name}!"
   }
   ```

   ```typescript
   t('welcome', { name: user.name });
   ```

### Adding New Languages

1. Create new locale directory
2. Add JSON files matching existing structure
3. Update next.config.js i18n config
4. Implement language switcher UI (currently in progress)
