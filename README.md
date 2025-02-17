# Weather Report 
<sup><sup>Wait, is that a JoJo reference?</sup></sup>

My personal implementation of the technical case, which allows the user to:
- Search for a specific location and view the weather data for that location
- View the weather forecast for the next 16 days of the selected location
- View the given location's historical weather data for either:
  - The last 7 days
  - The last 30 days
  - The last year
- Additionally, the user immediately sees the weather forecast data for their current location on page landing  


## Tech Stack

### Core
The frontend is built with **Nuxt 3** and **NuxtUI** (which in turn uses **TailwindCSS**) with the classic Nuxt folder structure, rooted in the `src` folder.

### Automated Testing 
There's no reason not to choose **vitest** in this context. It's the most complete of the bunch as it provides:
- seamless integration with both **@nuxt/test-utils** and **@nuxt/test-utils**, which are essential to unit test composables
- a ton of utility functions to [run test even on TypeScript's type level](src/helpers.test.ts)

### Utils
As suggested, **option-t** was the package of choice for handling the result of API calls, as it provides a simple and clean way to handle the API requests and responses.
**Chart.js** did all the heavy lifting for the charts, while **dayjs** was used for date manipulation.


## Setup

Make sure to install the dependencies through pnpm. 
Use corepack to enable the right version of pnpm.

More information about corepack can be found [in this article](https://www.totaltypescript.com/how-to-use-corepack)

Then run the following:
```bash
pnpm i
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

If you want to see the production build locally, you can do so by following the steps below.

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

## Structure


