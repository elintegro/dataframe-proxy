const functions = require('firebase-functions');
const express = require('express');
const axios = require('axios');
// const i18nMessages = require('./javascript/i18Messages');
const proxy = require('express-http-proxy');
const config = require('./config/config');
const app = express();

const baseUrl = config.API_URL;
app.set("view engine", "ejs");
app.use("/assets", proxy(baseUrl, { // proxying assets to the main server
    proxyReqPathResolver: function (req) {
        console.log("Inside proxy "+ req.url);
            return "/assets" + req.url;
        }
    })
);
app.get('/api', (req, res) => { //test method to check if proxy is working
    const date = new Date();
    const hours = (date.getHours() % 12) + 1;  // London is UTC + 1hr;
    res.json({bongs: 'BONG '.repeat(hours)});
});
app.get('/html', (req, res) => {
    const address = baseUrl + "/getHtml";
		console.log("Fetching html from: "+ address);
    const response = callApi(address, "GET", "", doAfterApiCall);
    response.then((resp) => {res.render('index.ejs', resp.data)})
        .catch(error => {console.log(error.messages); console.log(error);});

})
app.get('/dataframe/ajaxValues', (req, res) => {
    const address = baseUrl + "/dataframe/ajaxValues";
    const data = {"id":req.query.id, "dataframe":req.query.dataframe};
    const response = callApiWithGet(address, "GET", data, doAfterApiCall);
    response.then((resp) => {res.send(resp.data);})
        .catch(error => {console.log(error.messages)});

})
app.post('/dataframe/ajaxSave', (req, res) => {
    const address = baseUrl + "/dataframe/ajaxSave";
    const data = req.body;
    const response = callApi(address, "POST", data, doAfterApiCall);
    response.then((resp) => {res.send(resp.data);})
        .catch(error => {console.log(error.messages)});
})
app.get('/login/getUserInfo', (req, res) => {
    const address = baseUrl + "/login/getUserInfo";
    const response = callApi(address, "GET", "", doAfterApiCall);
    response.then((resp) => {res.send(resp.data);})
        .catch(error => {console.log(error.messages)});
})

app.post('/EmployeeApplication/initiateSkillSet', (req, res) => {
    const address = baseUrl + "/EmployeeApplication/initiateSkillSet";
    const method = "POST";
    const response = callApi(address, "GET", "", doAfterApiCall);
    response.then((resp) => {res.send(resp.data);})
        .catch(error => {console.log(error.messages)});
})
const doAfterApiCall = (response) => {
    console.log("Post processing of Data recieved from server ..");
    return response;
}
let getHtmlFromApi = (address, method, callback) => {
    const data = "";
    callApi(address, method, data, callback);
};

let callApi = (address, method, data, callback) => {
    return axios({
        method: method,
        url:address,
        data:data
    }).then(callback);
   // return callApiGet(address, method, data, callback);
}
let callApiWithGet = (address, method, data, callback) => {
    return axios({
        method: method,
        url:address,
        params:data
    }).then(callback);
}
exports.app = functions.https.onRequest(app);
