

//Array with id of preferred parameters
//Check if it is defined, if not, set it to an empty array
if (typeof preferredParameterIds === "undefined") {
  var preferredParameterIds = [];
}

//Standard preferred parameters (Add the id of the parameter to the array)
//preferredParameterIds.push("3cf2faa9-edce-4556-9557-91aec9ab462a"); 

//function that orders the children of element dashboardParameters alphabetically by the value of the parameterTitle label (case insensitive)
function orderParameters() {
  var dashboardParameters = document.getElementById("dashboardParameters");
  var parameters = dashboardParameters.getElementsByClassName("parameter");
  var parametersArray = Array.prototype.slice.call(parameters);
  parametersArray.sort(function (a, b) {
    var aTitle = a
      .getElementsByClassName("parameterTitle")[0]
      .innerHTML.toLowerCase();
    var bTitle = b
      .getElementsByClassName("parameterTitle")[0]
      .innerHTML.toLowerCase();
    if (aTitle < bTitle) {
      return -1;
    }
    if (aTitle > bTitle) {
      return 1;
    }
    return 0;
  });
  for (var i = 0; i < parametersArray.length; i++) {
    dashboardParameters.appendChild(parametersArray[i]);
  }

  orderParametersBySummary();
}
//If there's parameters with content in parameterSummary, move those to the top of the list, and add a divider between them and the rest of the parameters.
//The first section divider should contain the text "Active parameters", and be placed before the Active parameters, and the second section divider should contain the text "Other parameters"
function orderParametersBySummary() {
  var dashboardParameters = document.getElementById("dashboardParameters");
  var parameters = dashboardParameters.getElementsByClassName("parameter");
  var parametersArray = Array.prototype.slice.call(parameters);
  var startupParameters = [];
  var otherParameters = [];
  var preferredParameters = [];
  //Check if the parameter is in the preferredParameters array
  for (var i = 0; i < parametersArray.length; i++) {
    var parameter = parametersArray[i];
    //get the id of the parameter

    var parameterId = parameter.id.substring(10);
    var parameterSummary =
        parameter.getElementsByClassName("parameterSummary")[0];
    //Check if the parameter is in the preferredParameters array
    if (preferredParameterIds.indexOf(parameterId) > -1 && parameterSummary.innerHTML == "") {
        console.log("found preferred parameter", parameterId, parameterSummary.innerHTML);
      preferredParameters.push(parameter);
    } 
    else if (parameterSummary.innerHTML != "") {
        startupParameters.push(parameter);
      }  
    else {
        console.log("did not find preferred parameter", parameterId);
      
      
        otherParameters.push(parameter);
       
    }
  }

  // Function to check if a divider with specific text already exists
  function dividerExists(dividerText) {
    var dividers = dashboardParameters.getElementsByTagName("div");
    for (var i = 0; i < dividers.length; i++) {
      if (dividers[i].innerHTML === dividerText) {
        //remove the divider from the dom
        dividers[i].remove();
      }
    }
    
  }
  if (startupParameters.length > 0) {
    dividerExists("Active parameters");
    var startupParametersDivider = document.createElement("div");
    startupParametersDivider.innerHTML = "Active parameters";
    startupParametersDivider.className = "parameterDivider";
    dashboardParameters.appendChild(startupParametersDivider);
    for (var i = 0; i < startupParameters.length; i++) {
      dashboardParameters.appendChild(startupParameters[i]);
    }
  }
  if (preferredParameters.length > 0) {
    dividerExists("Preferred parameters");
    var preferredParametersDivider = document.createElement("div");
    preferredParametersDivider.innerHTML = "Preferred parameters";
    preferredParametersDivider.className = "parameterDivider";
    dashboardParameters.appendChild(preferredParametersDivider);
    for (var i = 0; i < preferredParameters.length; i++) {
      dashboardParameters.appendChild(preferredParameters[i]);
    }
  }
  if (
    otherParameters.length > 0 &&
    (startupParameters.length > 0 || preferredParameters.length > 0)
  ) {
    dividerExists("Other parameters");
    var otherParametersDivider = document.createElement("div");
    otherParametersDivider.innerHTML = "Other parameters";
    otherParametersDivider.className = "parameterDivider";
    dashboardParameters.appendChild(otherParametersDivider);
    for (var i = 0; i < otherParameters.length; i++) {
      dashboardParameters.appendChild(otherParameters[i]);
    }
  }
}
//Function that waits for id actionTabLeft to be available
function waitForElement() {
    if (document.getElementById("actionTabLeft") != null) {
        (function() {
            var pageIsReady = window.pageIsReady; // Store the original value
        
            // Define a function that should run when pageIsReady changes
            function onPageIsReadyChanged(newValue) {
                if(newValue == true){
                    orderParameters();
                } 
            }
        
            // Redefine pageIsReady with a custom setter
            Object.defineProperty(window, 'pageIsReady', {
                get: function() {
                    return pageIsReady;
                },
                set: function(newValue) {
                    pageIsReady = newValue;
                    onPageIsReadyChanged(newValue); // Call the reaction function
                }
            });
        })();
    } else {
      //If actionTabLeft is not available, wait 100ms and try again
      setTimeout(waitForElement, 100);
    }
  }
  $(document).ready(function () {
    waitForElement();
  });

  //To install, add this script to the file manager, and press show - then note the link to the file.

  //Now go to the relevant dashboard, and add the following script to the custom Javascript section of the dashboard:
  //this will add the script to the body of the dashboard

    //var script = document.createElement('script');
    //script.src = '<<insert file url here to orderFilter.js>>';
    //script.type = 'text/javascript';
    //document.getElementsByTagName('body')[0].appendChild(script);

    



