const CucumberJSAllureFormatter = require('allure-cucumberjs').CucumberJSAllureFormatter;
const AllureRuntime = require('allure-cucumberjs').AllureRuntime;
class Reporter extends CucumberJSAllureFormatter {
    constructor(options) {
        super(
            options,
            new AllureRuntime({ resultsDir: "./out/allure-results" }),
            {
                labels: {
                    issue: [/@bug_(.*)/],
                    epic: [/@feature:(.*)/]
                }
            }
        );
    }
}

exports.default = Reporter;
