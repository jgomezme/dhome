//config

window.config = {
	env : "dev",
	dev : {
	    apiUrlBase : "http://dhmysqlserver.cloudapp.net:82",
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