# ptm-server-integration-testing
Integration tests suite for [ptm-server](https://github.com/medvecky/ptm-server)

## Project setup 

### Prerequisites

#### Allure Framework

```bash
#Linux
sudo apt-add-repository ppa:qameta/allure
sudo apt-get update 
sudo apt-get install allure
```

```bash
#Mac OS X
brew install allure
```

```bash
#Windows
scoop install allure
```
### Tests setup and run

```bash
npm install
```

start SUT (ptm-server), description in documentation:
 [ptm-server/README](https://github.com/medvecky/ptm-server/blob/master/README.md)

* run tests 

    ```bash
      npm test
    ```

* run tests with allure 

    ```bash
    npm run test:allure
    #Show allure reports  
    allure serve ./out/allure-results
    ```
