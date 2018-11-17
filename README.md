This is a Solver for Quadratic Spline Interpolation, Polynomial Regression, and Simplex Minimization which is made as a requirement fro CMSC150 (Numerical and Symbolic Computation)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Table of Contents

- [Dependencies](#dependencies)
- [Development](#development)
- [File Structure](#file-structure)
- [Bugs and Feedback](#bugs-and-feedback)
- [About the Developers](#about-the-developers)

## Dependencies

The application requires the following installed for development:

* `NodeJS` framework (version 10.13.0 above)
* `flask` library (version 1.0.2)
* `yarn` CLI (optional, version 1.12.3)

Clone the [application](https://github.com/jasarqui/150-Solver-and-Optimizer) and then run `npm install` or `yarn add`. This will set up the remaining dependencies needed by the application to run.

## Development

When developing the app, open two terminals that will open the cloned folder. Run `npm start` or `yarn start` to start the web app, and `npm flask-start` or `yarn flask-start` to start the solver modules. Once the application loads, you can start developing.

It is also important to note that everytime you make a change to the code of the application, `create-react-app` already has a module that updates itself through `react-scripts` so you get all the new updates automatically.


## File Structure

The folders are implemented as follows (once all dependencies have been installed):

<strong>Client</strong>

```
150-Solver-and-Optimizer/
    node_modules/
    public/
        index.html
        manifest.json
    src/
        app/
            App.js
        assets/
            css/
            index.css
        solvers/
            helper/
            poly-reg/
            qsi/
            simplex/
            cors.py
            index.py
        ui/
            ..<components>
        index.js
        serviceWorker.js
    .gitignore
    package.json
    README.md
    yarn.lock
```

## Bugs and Feedback

If there are any bugs or feedback that concerns the project, go to the ([issues](hhttps://github.com/jasarqui/150-Solver-and-Optimizer/issues) tab.


## About the Developer

This web application is made by [Jasper Arquilita](https://github.com/jasarqui), a student from University of the Philippines Los Baños.
