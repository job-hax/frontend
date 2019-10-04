# JobHax Frontend application

![Alt text](https://img.shields.io/github/issues-raw/job-hax/frontend.svg)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/job-hax/frontend.svg?style=plastic)
![GitHub contributors](https://img.shields.io/github/contributors/job-hax/frontend.svg)
![GitHub repo size](https://img.shields.io/github/repo-size/job-hax/frontend.svg)

## Prerequisites

1. Download nodejs version 10x:
   ```
   https://nodejs.org/en/download/
   ```
2. Install yarn package manager for JavaScript:
   ```
   npm i -g yarn
   ```

## Installation

1.  Clone current repository:

    ```
    git clone https://github.com/job-hax/frontend.git
    ```

2.  Install project dependencies via yarn:

    ```
    yarn install
    ```

3.  Create config/config.js in src/ if non-existant with the following contents:

    ```
    export const IS_MOCKING = {boolean};

    export const IS_RECAPTCHA_ENABLED = {boolean};

    export const googleClientId = '[TODO]';

    export const jobHaxClientId = '[TODO]';

    export const jobHaxClientSecret = '[TODO]';

    export const reCaptchaV3SiteKey = '[TODO]';

    export const googleApiKey = '[TODO]';

    export const googleAnalyticsId = '[TODO]';

    export const linkedInClientId = '[TODO]';

    export const linkedInClientSecret = '[TODO]';

    export const nonceCSP = '[TODO]'; // base64 encoded random string

    ```

4.  Run:

        a) for local development:
        	```
        	yarn dev
        	```
        b) for production build:
        	```
        	yarn build
        	```

    Note: Starting file: './src/index.js'
