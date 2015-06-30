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

/*
window.config = {
	env : "dev",
	dev : {
	    apiUrlBase : "http://http://138.91.189.179:82",
	    apiBaseUri : "/api"
	},
	qa : {
	    apiUrlBase : "http://http://138.91.189.179", 
	    apiBaseUri : "/api"
	},
	prod : {
	    apiUrlBase : "http://http://138.91.189.179:83",
	    apiBaseUri : "/api"   	    
	}
}
*/