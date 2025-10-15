# bun-react-tailwind-template

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

## Resolving React during dev:

CD into the host project's node_modules/react folder and run:

```bash
bun link
```

then CD back into Kacker UI and run:

```bash
bun link react
```

and that should resolve the issue.
