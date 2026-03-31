# HoaNgữ LMS - Development Guidelines

## General Guidelines

### Code Standards
- Use TypeScript for all new code (strict mode enabled)
- Follow ESLint rules - run `npm run lint` before committing
- Format code with Prettier - run `npm run format`
- Keep functions small and focused (max 50 lines per function)
- Use meaningful variable and function names in Vietnamese/English

### File Organization
- Frontend: `src/app/` - React components, pages, contexts
- Backend: `src/server/` - Express routes, middleware, utilities
- Shared: `src/lib/` - Types, API clients, utilities

### React Best Practices
- Use functional components with hooks
- Use `@tanstack/react-query` for server state management
- Extract reusable components to `src/app/components/`
- Use lazy loading for routes: `const Page = lazy(() => import('./pages/Page'))`

### API Design
- RESTful conventions for endpoints
- Always return JSON with `{ success: boolean, data?: any, error?: string }`
- Use proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Add input validation using `express-validator` (see `src/server/validators/`)

### Database
- Use parameterized queries to prevent SQL injection
- Add indexes for frequently queried columns
- Use migrations for schema changes (see `src/server/db/migrations/`)

### Security
- Never commit secrets - use environment variables
- Validate all user inputs
- Use bcrypt for password hashing
- Implement rate limiting on sensitive endpoints
- Sanitize HTML/escape user-generated content

## Code Style

### TypeScript
```typescript
// Good
interface User {
  id: string;
  email: string;
  fullName: string;
}

// Bad
interface User {
  id: String;
  email: string;
  full_name: string;
}
```

### React Components
```tsx
// Good - functional component with proper typing
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button className={variant} onClick={onClick}>
      {label}
    </button>
  );
};
```

### Express Routes
```typescript
// Good
router.post('/register', registerValidation, validate, async (req, res) => {
  try {
    const { email, password } = req.body;
    // process request
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
```

## Testing

### Unit Tests
- Test utilities, validators, and middleware
- Use Jest with ts-jest
- Run tests: `cd src/server && npm test`
- Coverage target: 70%

### Test Structure
```typescript
describe('ModuleName', () => {
  test('should do something', () => {
    expect(result).toBe(expected);
  });
});
```

## Git Conventions

### Commit Messages
- `feat: add new feature`
- `fix: resolve bug`
- `refactor: improve code`
- `docs: update documentation`
- `test: add tests`

### Branch Naming
- `feature/feature-name`
- `fix/bug-description`
- `refactor/improvement-name`

## Environment Variables

### Required (.env)
```
# Database
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

# Auth
JWT_SECRET=<generate-with-openssl-rand-base64-32>

# Payment (VNPay)
VNP_TMNCODE=
VNP_HASHSECRET=
VNP_URL=
VNP_RETURNURL=
```

## Dependencies

### Frontend
- React 18 + Vite
- MUI 7 + Radix UI
- TailwindCSS 4
- React Query + React Router

### Backend
- Express + TypeScript
- PostgreSQL (Neon)
- Socket.io
- JWT + bcryptjs

## Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Check lint
npm run format       # Format code

# Backend
cd src/server
npm run dev          # Start API server
npm run test         # Run tests
npm run db:migrate   # Run migrations
```
