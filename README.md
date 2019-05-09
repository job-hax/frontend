# JobHax Frontend application
![Alt text](https://img.shields.io/github/issues-raw/job-hax/frontend.svg)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/job-hax/frontend.svg?style=plastic)
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
1. Clone current repository:
	```
	git clone https://github.com/job-hax/frontend.git
	```

2. Install project dependencies via yarn:
	```
	yarn install
	```

3. Create config/config.js in src/ if non-existant with the following contents:
	```
	export const IS_MOCKING = false;

	export const googleClientId = '[TODO]';

	export const jobHaxClientId = '[TODO]';

	export const jobHaxClientSecret = '[TODO]';
	```

4. Run:

	a) for local development:
		```
		yarn dev
		```
	b) for production build:
		```
		yarn build
		```
Note: Starting file: './src/index.js'
