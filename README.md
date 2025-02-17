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
As suggested, **option-t** was the package of choice for handling the result of API calls. With the help of the [useUnwrapResult](src/composables/useUnwrapResult.ts) composable, it was possible to unwrap those results and
show the user the appropriate feedback.
**Chart.js** did all the heavy lifting for the charts, while **dayjs** was used for date manipulation.
I thought it was a good idea to include `i18n` for the sake of clean text-component interpolation without
leaving some dirty strings interposed with components in the code, but ultimately it wasn't really needed.

## Architecture
The Repository layer is responsible for handling the data manipulation and the API calls. It's represented by the `entities` folder.
For each entity, there's a corresponding file that contains:
    - Its type definition
    - The repository function that handles the API call and the data manipulation
    - The constants that are used in the repository function, such as the endpoint url
    - In some cases, when the repository gets too cluttered, a utils file is created to handle the data manipulation

There was no

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