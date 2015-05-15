/*
 * CONSTANTS
 */
var http = "http://";
var policyNodeId = null;
var counter = 1;

/*
 * GLOBAL VARIABLES FOR LOCAL STORAGE
 */
var controllerIP = "controllerIP";
var controllerUsername = "controllerUsername";
var controllerPassword = "controllerPassword";
var policyObjects = "policies";

/*
 * REST SERVICE URLS
 */
var GETALLNODES = "/controller/nb/v2/switchmanager/default/nodes";
var GETNODEDETAILS = "/controller/nb/v2/switchmanager/default/node/OF/";
var INSTALLFLOW = "/controller/nb/v2/flowprogrammer/default/node/OF/";
var GETPORTSTATS = "/controller/nb/v2/statistics/default/port/node/OF/";

/*
 * FUNCTIONS
 */
function getDevices() {
	var nodes = null;
	var odlLocation = http + localStorage.getItem(controllerIP);
	$.ajax({
		url : odlLocation + GETALLNODES,
		type : "GET",
		async : false,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			console.log(data);
			if (data) {
				nodes = data;
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log("FailurerorThrown");
		},
		beforeSend : function(xhr) {
			// Default Base64 Encoding for (admin/admin)
			xhr.setRequestHeader("Authorization", "Basic YWRtaW46YWRtaW4=");
		}
	});

	return nodes;
}

function getPorts(nodeId) {
	var nodes = null;
	var odlLocation = http + localStorage.getItem(controllerIP);
	$.ajax({
		url : odlLocation + GETNODEDETAILS + nodeId,
		type : "GET",
		async : false,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			console.log(data);
			if (data) {
				nodes = data;
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log("FailurerorThrown");
		},
		beforeSend : function(xhr) {
			// Default Base64 Encoding for (admin/admin)
			xhr.setRequestHeader("Authorization", "Basic YWRtaW46YWRtaW4=");
		}
	});

	return nodes;
}

function installDenyAllFlow(nodeId, inPort) {

	console.log("Installing deny all flow on device " + nodeId);
	
	var flowName = "SDNPMDenyAllOnInPort" + inPort;
	var postData = new Object();
	postData.name = flowName;
	postData.ingressPort = inPort;
	postData.installInHw = "true";
	postData.priority = "500";
	postData.etherType = "0x800";
	postData.actions = [ "DROP" ];

	var nodeObject = new Object();
	nodeObject.id = nodeId;
	nodeObject.type = "OF";

	postData.node = nodeObject;

	var postDataJSON = JSON.stringify(postData);
	console.log(postDataJSON);
	
	installFlow(nodeId,  flowName, postDataJSON);
}

function installAccessFlow(nodeId, inPort, outputPort, srcMAC, flowName) {

	console.log("Installing allow flow on device " + nodeId
			+ " for source MAC " + srcMAC + " ( inPort " + inPort
			+ " outputPort " + outputPort + ")");
	
	var postData = new Object();
	postData.name = flowName;
	postData.ingressPort = inPort;
	postData.dlSrc = srcMAC;
	postData.installInHw = "true";
	postData.priority = "600";
	postData.etherType = "0x800";
	postData.actions = [ "OUTPUT="+outputPort ];

	var nodeObject = new Object();
	nodeObject.id = nodeId;
	nodeObject.type = "OF";

	postData.node = nodeObject;

	var postDataJSON = JSON.stringify(postData);
	console.log(postDataJSON);
	
	installFlow(nodeId, flowName , postDataJSON);

}

function installFlow(nodeId, flowName, postDataJSON) {

	var odlLocation = http + localStorage.getItem(controllerIP);
	var url = odlLocation + INSTALLFLOW
			+ nodeId + "/staticFlow/" + flowName;
	console.log(url);
	$.ajax({
		url : url,
		type : "PUT",
		async : false,
		contentType : "application/json",
		data : postDataJSON,
		success : function(data, textStatus, jqXHR) {
			console.log("Flow Installed Successfully: " + data);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log("Failure", errorThrown);
		},
		beforeSend : function(xhr) {
			xhr.setRequestHeader("Authorization", "Basic YWRtaW46YWRtaW4=");
		}
	});

}

function getPortStatistics(nodeId){
	
	var portStats = null;
	var odlLocation = http + localStorage.getItem(controllerIP);
	$.ajax({
		url : odlLocation + GETPORTSTATS + nodeId,
		type : "GET",
		async : false,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			console.log(data);
			if (data) {
				portStats = data;
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log("FailurerorThrown");
		},
		beforeSend : function(xhr) {
			// Default Base64 Encoding for (admin/admin)
			xhr.setRequestHeader("Authorization", "Basic YWRtaW46YWRtaW4=");
		}
	});

	return portStats;
	
}
