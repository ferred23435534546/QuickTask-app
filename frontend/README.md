# QuickTask Frontend

## Overview
Angular-based frontend for the QuickTask application. Provides a modern and responsive user interface for task management.

## Features
- Responsive design
- Real-time task updates
- User authentication
- Task creation and management interface
- Profile management

## Development
1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
ng serve
```

## Structure
- `/src/app/components` - Reusable UI components
- `/src/app/services` - API services and business logic
- `/src/app/models` - Data models and interfaces
- `/src/app/pages` - Main application pages

## Technologies
- Angular 16+
- TypeScript
- Bootstrap
- SCSS

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
