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

We could say that, while the classic domain-infrastrucure-application layering is not present in the project, each entity folder is keeping that separation in place. 
This has some advantages:
- It makes the addition and removal of entities easier
- Organizes most of the business logic in a single place, making it easier to locate and maintain
- Ease the testing process, as each entity can be tested in isolation 


### Ok, but where are the services?
Surprisingly enough, there's no `Service` layer in this project. My first tought was to aggregate the [cityRepository](src/entities/city/repository.ts), [weatherForecastRepository](src/entities/weatherForecast/repository.ts) and [weatherHistoryRepository](src/entities/weatherHistory/repository.ts) into a single service, with the following workflow:
- A city name is passed to the service
- The service calls the cityRepository to get the city's coordinates
- The service calls the weatherForecastRepository to get the weather forecast for the next 16 days
- The service calls the weatherHistoryRepository to get the historical weather data for the last 7 days, 30 days or year

With a bit of error handling in between, the code would have looked like this:

```ts
const weatherReportService = () => {
  const cityRepos = cityRepository()
  const forecastRepo = weatherForecastRepository()
  const historyRepo = weatherHistoryRepository()

  const getWeatherReport = async (city: string) => {
    const result = {
      cityData: undefined,
      forecastData: undefined,
      historyData: undefined,
    }

    result.cityData = await cityRepos.query({ name: city })
    if (isErr(result.cityData)) { return result }

    const { latitude, longitude } = unwrapOk(result.cityData)
    const forecastData = await forecastRepo.query({ latitude, longitude })
    const historyData = await historyRepo.query({ latitude, longitude })

    return result
  }
}
```
Good, isn't it? But the I realized that the city repository can't just return a _single_ city object, but an array of cities, as there can be multiple cities with the same name.
Making the assumption that the user would have been satisfied with the first city in the array would have been a bad idea, so the 
cities repository was removed from the service.
The service can still accept a latitude and a longitude as arguments and aggregate the data for both forecast and history, just like this:

```ts
const weatherReportService = () => {
  const forecastRepo = weatherForecastRepository()
  const historyRepo = weatherHistoryRepository()

  const getWeatherReport = async (query: WeatherQueryParams) => {

    const { latitude, longitude } = query
    const forecastData = await forecastRepo.query({ latitude, longitude })
    const historyData = await historyRepo.query({ latitude, longitude })

    return {
        forecastData,
        historyData
    }
  }
}
```

This could have still contributed to make the code cleaner, but turns out that these two weather entities differ far more than I initially thought:
- The forecast data would require an additional `forecast_days` param, which can be hardcoded but can make testing harder. However, we can still save it in a variable and hardcode that variable in the service. Unhortodox, but the service would still be alive!
- The history data, instead, require a `start_date` and an `end_date` param, which can't be hardcoded. Those params have been synthesized in a single `timeSpan` attribute, but the service would still look like this


```ts
const weatherReportService = () => {
  const forecastRepo = weatherForecastRepository()
  const historyRepo = weatherHistoryRepository()

  const getWeatherReport = async (query: WeatherForecastQueryParams & WeatherHistoryQueryParams) => {

    const { latitude, longitude, timeSpan } = query
    const forecastData = await forecastRepo.query({ latitude, longitude, forecast_days: WEATHER_FORECAST_DAYS_CONST })
    const historyData = await historyRepo.query({ latitude, longitude, timeSpan })

    return {
        forecastData,
        historyData
    }
  }
}
```

Furthermore, forecastData return an hourly forecast, while historyData returns a daily forecast: two different data types!
So basically, I would have created a service that:
- Requires almost all params that the repositories require
- Splits those params to the appriopriate repositories
- Returns two different types of data in a single object
- Has to be tested.

Why even bother with a service layer at this point? The repositories are already doing a good job at abstracting the API calls and the data manipulation, so the service layer would have been just a waste of time.

### The presentation layer
The presentation layer is represented by the `pages` and `components` folders. The `pages` folder contains the pages that are rendered by the user, while the `components` folder contains the components that are used by the pages.
As per the components, I applied the same logic as the entities: bigger components have their own folder, which includes:
- The component itself
- Its sub-components
- Complex utility functions that are shared by sibling components

Unfortunately, the basic Nuxt setup discourages this approach: the auto-import feature of composables makes it so that
they have to be placed in the `composables` folder, which is not a big deal, but it would have been nice to have them in the same folder as the component that uses them. It is possible to customize this behavior with some tweaks in the `nuxt.config.js` file, but it was not worth the effort in this case.


## With all the explanations out of the way, let's see the project in action!

Make sure to install the dependencies through pnpm. 
Use corepack to enable the right version of pnpm.

More information about corepack can be found [in this article](https://www.totaltypescript.com/how-to-use-corepack)

Then run the following:
```bash
pnpm i
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

### Production

If you want to see the production build locally, you can do so by following the steps below.

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```