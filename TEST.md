# Test Documentation

## Setup

The project uses Jest and React Testing Library for testing. The setup includes:

- Jest for test running and assertions
- React Testing Library for component testing
- Babel for JSX and TypeScript support
- Coverage reporting with thresholds

## Configuration

### Jest Configuration
```javascript
{
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### Babel Configuration
```javascript
{
  presets: [
    ["@babel/preset-env", {
      "targets": {
        "node": "current"
      }
    }],
    ["@babel/preset-react", {
      "runtime": "automatic"
    }],
    "@babel/preset-typescript"
  ],
  plugins: [
    ["@babel/plugin-transform-runtime", {
      "regenerator": true
    }]
  ]
}
```

## Component Tests

### TaskCard
Tests cover:
- Rendering task details (title, description)
- Status and priority badge display
- Edit functionality
- Delete confirmation and execution
- Due date handling and overdue state
- Tag display
- Assigned user display

### TaskForm
Tests cover:
- Empty form rendering
- Form with initial values
- Input change handling
- Tag selection
- Form submission
- Cancel operation
- Validation

### UserSelector
Tests cover:
- Loading state
- Error handling
- User selection
- Data fetching
- Empty state handling

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- path/to/test.tsx

# Watch mode
npm test -- --watch
```

## Test Guidelines

1. Use `act()` for async operations and state updates
2. Mock external dependencies
3. Test error scenarios
4. Verify UI updates
5. Test user interactions

## Coverage Requirements

Each component must maintain:
- 80% branch coverage
- 80% function coverage
- 80% line coverage
- 80% statement coverage

## Test Files Structure

```
src/
  __tests__/
    components/
      TaskCard.test.tsx
      TaskForm.test.tsx
      UserSelector.test.tsx
```

Each test file follows the pattern:
1. Mock declarations
2. Component-specific setup
3. Test suites grouped by functionality
4. Cleanup in afterEach/afterAll when needed
