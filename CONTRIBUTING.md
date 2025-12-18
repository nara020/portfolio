# Contributing to Portfolio

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js 18.17+
- npm 9.0+
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/portfolio.git
   cd portfolio
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Locally

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Project Structure

```
src/
├── app/          # Next.js App Router pages
├── components/   # React components
├── config/       # Configuration files
├── data/         # Static data and types
└── lib/          # Utility functions
```

## Pull Request Process

1. **Update Documentation**: Update README.md if needed
2. **Follow Standards**: Ensure code follows our coding standards
3. **Test Thoroughly**: Test your changes locally
4. **Clean Commits**: Write clear, meaningful commit messages
5. **Request Review**: Request a review from maintainers

### PR Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing
Describe how you tested your changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated (if applicable)
- [ ] No new warnings generated
```

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define explicit types for all function parameters and return values
- Prefer interfaces over type aliases for object shapes
- Use `const` assertions where applicable

```typescript
// Good
interface User {
  id: string;
  name: string;
}

function getUser(id: string): User {
  // ...
}

// Avoid
function getUser(id): any {
  // ...
}
```

### React Components

- Use functional components with hooks
- Prefer named exports over default exports
- Use TypeScript interfaces for props

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={variant}>
      {label}
    </button>
  );
}
```

### Styling

- Use TailwindCSS utility classes
- Use `clsx` or `tailwind-merge` for conditional classes
- Follow mobile-first responsive design

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  condition && 'conditional-classes',
  className
)} />
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `UserCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `types.ts` or `PascalCase.types.ts`
- Tests: `ComponentName.test.tsx`

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(i18n): add Japanese language support
fix(header): resolve mobile menu toggle issue
docs(readme): update installation instructions
refactor(components): extract common button styles
```

## Questions?

If you have questions, please open an issue or reach out to the maintainers.

---

Thank you for contributing!
