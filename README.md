# Project Management App

A full-featured project management application built with Next.js, TypeScript, and Supabase.

## Features
- Task management
- User assignments
- Project organization
- Task status tracking
- Priority management
- Due date handling
- Tag system

## Testing

The project includes comprehensive test coverage for all components using Jest and React Testing Library.

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Test Coverage Requirements
- 80% branch coverage
- 80% function coverage
- 80% line coverage
- 80% statement coverage

### Components Tested
- TaskCard: Task display and interactions
- TaskForm: Task creation and editing
- UserSelector: User assignment functionality

For detailed testing documentation, please see [TEST.md](./TEST.md).

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run test:coverage` - Run tests with coverage report

## Tech Stack

- Next.js
- TypeScript
- Supabase
- React Testing Library
- Jest
- TailwindCSS

## Project Structure

```
src/
  components/      # React components
  pages/          # Next.js pages
  utils/          # Utility functions
  __tests__/      # Test files
  services/       # API services
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Submit a pull request

## License

MIT License. See [LICENSE](./LICENSE) for more information.
