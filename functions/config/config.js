const env = process.env.NODE_ENV || 'development';
module.exports = require(`./${env}.js`);

const baseUrl = () => {
    console.log("Checking Environment");
    console.log(env);
    console.log(env.API_URL);
    return env.API_URL;
}

const logger = {

    loggerEndPoint : baseUrl() + "/logger/save/",
    enableLog : false,
    interval:{
        // minutes: '/5', //For formats check docs of Vue-Crontab
        seconds: '/30',
    }
}

exports.baseUrl = baseUrl()
exports.logger = logger
