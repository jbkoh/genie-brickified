
# Genie

* System tested only on Ubuntu

### Installation

1. Install yarn

    ```
    sudo apt-get update && sudo apt-get install yarn
    ```

2. Install Node.js

    ```
    curl --silent --location https://deb.nodesource.com/setup_6.x | sudo bash -
    sudo apt-get install --yes nodejs
    ```

3. Install npm

    ```
    sudo apt-get install npm
    ```
    
4. Install Gulp
    
    Gulp is providing command line tools for building themed versions of the library with just the components you need.<br>
    
    ```
    sudo npm install -g gulp
    ```

### Execution

1. Runs the app in the development mode.

    ```
    npm start
    ```
    
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

    The page will reload if you make edits.<br>
    You will also see any lint errors in the console.

2. Launches the test runner in the interactive watch mode.
    ```
    npm test
    ```

3. Builds the app for production to the `build` folder.
    ```
    npm run build
    ```

    It correctly bundles React in production mode and optimizes the build for the best performance.<br>
    The build is minified and the filenames include the hashes.
