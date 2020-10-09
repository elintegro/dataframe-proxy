const functions = require('firebase-functions');
const express = require('express');
const axios = require('axios');
const i18nMessages = require('../public/javascript/i18Messages');
const app = express();

app.set("view engine", "ejs");

app.get('/', (req, res) => {
    const date = new Date();
    const hours = (date.getHours() % 12) + 1;  // London is UTC + 1hr;
    res.send(`
    <!doctype html>
    <head>
      <title>Dataframe proxy</title>
    </head>
    <body>
      Dataframe Proxy web. Use /html to het dataframe html
    </body>
  </html>`);
});
app.get('/api', (req, res) => {
    const date = new Date();
    const hours = (date.getHours() % 12) + 1;  // London is UTC + 1hr;
    res.json({bongs: 'BONG '.repeat(hours)});
});
const apiAddress = "http://localhost:8099";
app.get('/html', (req, res) => {
    const address = apiAddress + "/getHtml";
    const response = callApi(address, "GET", "", genericCallbackForApi);
    response.then((resp) => {res.render('index.ejs', resp.data)})
        .catch(error => {console.log(error.messages)});

})
app.get('/dataframe/ajaxValues', (req, res) => {
    const address = apiAddress + "/dataframe/ajaxValues";
    const data = {"id":req.query.id, "dataframe":req.query.dataframe};
    const response = callApiGet(address, "GET", data, genericCallbackForApi);
    response.then((resp) => {res.send(resp.data);})
        .catch(error => {console.log(error.messages)});

})
app.post('/dataframe/ajaxSave', (req, res) => {
    const address = apiAddress + "/dataframe/ajaxSave";
    const data = req.body;
    const response = callApi(address, "POST", data, genericCallbackForApi);
    response.then((resp) => {res.send(resp.data);})
        .catch(error => {console.log(error.messages)});
})
app.get('/login/getUserInfo', (req, res) => {
    const address = apiAddress + "/login/getUserInfo";
    const response = callApi(address, "GET", "", genericCallbackForApi);
    response.then((resp) => {res.send(resp.data);})
        .catch(error => {console.log(error.messages)});
})

app.post('/EmployeeApplication/initiateSkillSet', (req, res) => {
    const address = apiAddress + "/EmployeeApplication/initiateSkillSet";
    const method = "POST";
    const response = callApi(address, "GET", "", genericCallbackForApi);
    response.then((resp) => {res.send(resp.data);})
        .catch(error => {console.log(error.messages)});
})
const genericCallbackForApi = (response) => {
    console.log("Data recieved from server");
    response.messages = i18nMessages.messages;
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
let callApiGet = (address, method, data, callback) => {
    return axios({
        method: method,
        url:address,
        params:data
    }).then(callback);
}
exports.app = functions.https.onRequest(app);