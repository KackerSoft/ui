# Kacker UI

## Installation

To install the dependencies, install the package using:

```bash
bun install https://github.com/KackerSoft/ui.git
```

## Development (local)

To develop and use the package simultaneously do the following steps:

1. Install the package in your desired project with installation steps.

2. In the project that you are using prepare the script:
    ```bash
    bun pm trust @kacker/ui
    ```
    This will build the package locally so that it can be used in your project.

3. Run the following command in the kacker/ui project terminal:
    ```bash
    bun link
    ```

4. Run the following command generated using `bun link` in the project where you are using the kacker/ui package:
    ```bash
    bun link @kacker/ui
    ```

5. Run the following command in the kacker/ui project terminal to build and use concurrently:
    ```bash
    bun dev
    ```

6. Start or run your project in which you are using the kacker/ui components. Happy Coding :).