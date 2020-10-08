const express = require('express');
const axios = require('axios');
const i18nMessages = require('./public/javascript/i18Messages');

const app = express();

const port = 3333;

app.use(express.static('public')); //Serves resources from public folder
app.use('/assets', express.static(__dirname + '/public/assets'));
app.listen(port, function(){
  console.log("Surver is running on port "+ port);
})

app.set("view engine", "ejs");

app.get('/', function(req, res){
  res.sendFile(__dirname + "/index.html");
})

const apiAddress = "http://localhost:8099";
app.get('/html', (req, res) => {
		const address = apiAddress + "/getHtml";
		const response = callApi(address, "GET", "", genericCallbackForApi);
		response.then((resp) => {res.render('index.ejs', resp.data)});
})

app.get('/dataframe/ajaxValues', (req, res) => {
		const address = apiAddress + "/dataframe/ajaxValues";
		const data = {"id":req.query.id, "dataframe":req.query.dataframe};
		const response = callApiGet(address, "GET", data, genericCallbackForApi);
		response.then((resp) => {res.send(response.data);});
})
app.get('/login/getUserInfo', (req, res) => {
		const address = apiAddress + "/login/getUserInfo";
		const response = callApi(address, "GET", "", genericCallbackForApi);
		response.then((resp) => {res.send(response.data);});
})

app.post('/EmployeeApplication/initiateSkillSet', (req, res) => {
		const address = apiAddress + "/EmployeeApplication/initiateSkillSet";
		const method = "POST";
		const response = callApi(address, "GET", "", genericCallbackForApi);
		response.then((resp) => {res.send(response.data);});
})
const genericCallbackForApi = (response) => {
		console.log("Data recieved from server");
		response.messages = i18nMessages.messages;
		console.log(response);
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
}
let callApiGet = (address, method, data, callback) => {
		return axios({
				method: method,
				url:address,
				params:data
      }).then(callback);
}
