# Evil Pandas

This is implementation of Turing College Web Development project for Module 2 Sprint4.

A simple web game illustrating the usage of Vue 3, Pinia and Vite.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Accessibility](#accessibility)
- [Dependencies](#dependencies)

## Installation

1. Clone this repository:

```sh
 git clone git@github.com:TuringCollegeSubmissions/krinke-FE.4.git
```

2. Navigate to the project directory:

```sh
 cd krinke-FE.4
```

3. Install dependencies:

```sh
npm install
```

4. Start the production server:

```sh
npm run build
npm run preview
```

## Usage

1. Open your browser and navigate to root directory, for instance:

```sh
http://localhost:4173/
```

2. In the Main Menu, you can check instructions, high scores or choose to play.

3. After choosing difficulty the game will start. Defend yourself from Pandas by clicking the corresponding arrow key or mobile controls (on smaller screens). Pandas will attack more frequently based on selected difficulty and move faster based on your score.

4. After the game is over, your scores will be saved in local storage.

## Accessibility

CSS styling was applied to create a responsive design for multiple resolutions (1920x1080, 768x1024, 360x740). Additional game controls are provided for devices with screen widths <= 500 px.

## Dependencies

Here are the main dependencies used in this project:

- [Vite](https://vitejs.dev/): A build tool that serves your code via native ES modules.
- [Vue.js](https://vuejs.org/): A progressive JavaScript framework for building user interfaces.
- [Pinia](https://pinia.vuejs.org/): A modern and lightweight state management system for Vue.js applications.
- [Vitest](https://vitest.dev/): A blazing fast unit test framework powered by Vite.
- [Playwright](https://playwright.dev/): A framework for Web Testing and Automation, used for UI testing in this project.

All dependencies can be found in the `package-lock.json` file
