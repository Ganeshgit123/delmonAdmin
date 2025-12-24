# Delmon Admin

Angular application (currently targeting Angular 21) with standardized TypeScript, ESLint, and Prettier configuration.

## Development server

Run `ng serve` for a dev server and navigate to `http://localhost:4200/`. The app will automatically reload on source changes.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. Artifacts are stored in `dist/`. Use `ng build --configuration production` for optimized builds.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests.

## Coding Standards

- Lint: `npm run lint` (Angular ESLint). Autofixes: `npm run lint:fix`.
- Format: `npm run format` (Prettier) and `npm run format:check` to verify.
- Type checking:
	- Baseline: `npm run type-check` (using `tsconfig.app.json`).
	- Strict mode: `npm run type-check:strict` (using `tsconfig.strict.json`). Fix findings progressively.
- Angular style guide highlights:
	- Selectors: components use `app-` kebab-case; directives use `app` camelCase.
	- Avoid `any`; prefer well-defined interfaces and types.
	- Provide alternative text for images and associate labels with controls (accessibility).
	- Prefer `for-of` over index-based loops for simple iteration.

## Project Tooling

- ESLint flat config with `angular-eslint` and `typescript-eslint`.
- Prettier config in `.prettierrc`; editor defaults in `.editorconfig`.

## Upgrade Notes

The repository has been updated to modern Angular tooling. Older references to Angular CLI v8 have been replaced. Use the scripts documented here for development.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
