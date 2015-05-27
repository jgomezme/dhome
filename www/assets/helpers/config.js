//config

window.config = {
	env : "dev",
	dev : {
	    apiUrlBase : "http://52.5.119.144:82",
	    apiBaseUri : "/api"
	},
	qa : {
	    apiUrlBase : "http://dhmysqlserver.cloudapp.net", 
	    apiBaseUri : "/api"
	},
	prod : {
	    apiUrlBase : "http://dhmysqlserver.cloudapp.net:83",
	    apiBaseUri : "/api"   	    
	}
}