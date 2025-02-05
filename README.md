# Real Estate Website

## Testing and Logging Guide

### Running Tests

#### Frontend Tests

The frontend uses Vitest and React Testing Library for component testing.

```bash
# Install dependencies
cd frontend
npm install

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run coverage
```

Available test scripts:

- `npm test`: Run tests in watch mode
- `npm run test:ui`: Run tests with Vitest UI
- `npm run coverage`: Generate test coverage report

#### Backend Tests

The backend uses Jest for testing the API endpoints and controllers.

```bash
# Install dependencies
cd backend
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Logging System

The application uses Winston for logging on the backend. Logs are stored in the `logs` directory:

- `logs/error.log`: Contains all error-level logs
- `logs/combined.log`: Contains all logs (info, warn, error)

#### Log Types

1. **Request Logging**

   - Every HTTP request is automatically logged with:
     - Method
     - Path
     - Status code
     - Response time
     - IP address
     - User agent

2. **API Operation Logging**

   - Property operations (CRUD)
   - Database connections
   - File uploads
   - Error conditions

3. **Error Logging**
   - API errors
   - Database errors
   - Unhandled rejections
   - Uncaught exceptions

#### Viewing Logs

During development, logs are also output to the console. In production, you can view the log files in the `logs` directory:

```bash
# View the last 100 lines of the error log
tail -n 100 logs/error.log

# Follow the combined log in real-time
tail -f logs/combined.log
```

### Test Coverage

After running the coverage commands, you can find the coverage reports at:

- Frontend: `frontend/coverage/index.html`
- Backend: `backend/coverage/lcov-report/index.html`

Open these files in a browser to view detailed coverage information.

### Writing New Tests

#### Frontend Components

Place component tests in `__tests__` directories next to the components:

```
src/components/
  └── MyComponent/
      ├── MyComponent.jsx
      └── __tests__/
          └── MyComponent.test.jsx
```

#### Backend Controllers

Place controller tests in the `controller/__tests__` directory:

```
backend/
  └── controller/
      ├── myController.js
      └── __tests__/
          └── myController.test.js
```

### Testing Best Practices

1. **Component Testing**

   - Test component rendering
   - Test user interactions
   - Test error states
   - Mock external dependencies

2. **API Testing**

   - Test successful operations
   - Test error cases
   - Test input validation
   - Mock database calls

3. **Integration Testing**
   - Test component integration
   - Test API endpoint integration
   - Test database operations

### Debugging

1. **Frontend Tests**

   - Use `test:ui` for interactive debugging
   - Use `console.log` in tests
   - Check test coverage reports

2. **Backend Tests**
   - Use `test:watch` for development
   - Check error logs
   - Use debugger statements

### Common Issues

1. **Test Failed to Run**

   - Check if all dependencies are installed
   - Ensure test files follow naming convention
   - Check for syntax errors

2. **Logging Issues**
   - Ensure logs directory exists and is writable
   - Check disk space
   - Verify log rotation settings
