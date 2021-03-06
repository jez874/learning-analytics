
function getActivityId() {
    return window.sessionStorage.getItem("evaluatedActivity");

}

function getGroupId() {
    return window.sessionStorage.getItem("evaluatedGroup");
}

function getTeacherId() {
    //TODO rimuovere questo!!!!
    //return window.sessionStorage.getItem();
    return Share.getInstance().id;
}

function getPilotsite() {

    //TODO rimuovere questo!!!!
    //window.sessionStorage.setItem("pilotsite", 10);

    return window.sessionStorage.getItem('sessionId');
}

function getActivities(pilotSite, responseHandler) {

    var formData = new FormData();
    formData.append("func", "getActivities");
    formData.append("pilotSite", pilotSite);

    makeAjaxCall(formData, responseHandler);
}


function getActivityCategories(activityId, responseHandler) {
    var formData = new FormData();

    formData.append("func", "getActivityCategories");
    formData.append("activity", activityId);
    formData.append("pilotSite", getPilotsite());

    makeAjaxCall(formData, responseHandler);
}

function getCategoryCriterias(categoryId, responseHandler) {
    var formData = new FormData();

    console.log(categoryId);
    console.log(getActivityId());

    formData.append("func", "getCategoryCriterias");
    formData.append("category", categoryId);
    formData.append("activity", getActivityId());

    makeAjaxCall(formData, responseHandler);
}

function getSelfEvaluation(activityId, groupId, responseHandler) {
    var formData = new FormData();

    formData.append("func", "getSelfEvaluation");
    formData.append("activity", activityId);
    formData.append("group", groupId);

    makeAjaxCall(formData, responseHandler);
}

function getCategorySelfEvaluation(activityId, categoryId, groupId, responseHandler) {
    var formData = new FormData();

    formData.append("func", "getCategorySelfEvaluation");
    formData.append("activity", activityId);
    formData.append("category", categoryId);
    formData.append("group", groupId);

    makeAjaxCall(formData, responseHandler);
}

function saveSelfEvaluation(selfEvaluation, groupId, responseHandler) {
    var formData = new FormData();

    formData.append("func", "saveSelfEvaluation");
    selfEvaluation.Group = groupId;
    formData.append("selfEvaluation", JSON.stringify(selfEvaluation));

    makeAjaxCall(formData, responseHandler);
}



/////TEACHER FUNC

function getGroupListForEvaluation(responseHandler) {
    var formData = new FormData();

    formData.append("func", "getGroupListForEvaluation");

    formData.append("pilotSite", getPilotsite());
    formData.append("teacher", getTeacherId());

    makeAjaxCall(formData, responseHandler);
}

function submitEvaluation(evaluation, responseHandler) {
    var formData = new FormData();

    formData.append("func", "saveEvaluation");
    formData.append("evaluation", JSON.stringify(evaluation));

    makeAjaxCall(formData, responseHandler);
}

function getActivityForEdit(activityId, responseHandler) {
    var formData = new FormData();

    formData.append("func", "getActivityForEdit");
    formData.append("activity", activityId);

    makeAjaxCall(formData, responseHandler);
}

function getAllCategories(responseHandler) {
    var formData = new FormData();

    formData.append("func", "getAllCategories");

    makeAjaxCall(formData, responseHandler);
}

function submitActivity(activity, responseHandler) {
    var formData = new FormData();

    formData.append("func", "submitActivity");
    formData.append("activity", JSON.stringify(activity));

    makeAjaxCall(formData, responseHandler);
}

function submitSeleteActivity(activityId, responseHandler) {
    var formData = new FormData();

    formData.append("func", "deleteActivity");
    formData.append("activity", activityId);

    makeAjaxCall(formData, responseHandler);
}

function getEvaluatedActivities(teacherId, responseHandler) {
    var formData = new FormData();

    formData.append("func", "getEvaluatedActivities");
    formData.append("teacher", teacherId);
    formData.append("pilotSite", getPilotsite());

    makeAjaxCall(formData, responseHandler);
}

function getTeachersActivities(teacherId, responseHandler) {
    var formData = new FormData();

    formData.append("func", "getTeachersActivities");
    formData.append("teacher", teacherId);
    formData.append("pilotSite", getPilotsite());

    makeAjaxCall(formData, responseHandler);
}

function getSelectedActivityCriterias(activityId, categoryId, responseHandler){
    var formData = new FormData();

    formData.append("func", "getSelectedActivityCriterias");
    formData.append("activity", activityId);
    formData.append("category", categoryId);

    makeAjaxCall(formData, responseHandler);
}

function getGroupEvaluationFromLearningAnalytics(groupName, responseHandler) {
    
    
    $.ajax({
        url: 'https://cs.uef.fi/~tapanit/ecraft2learn/api/pilot_2/get_student_models_pilot_2.php',
        //dataType: 'text',
        //cache: false,
        //contentType: false,
        //processData: false,
        data: 'sessionId=' + getPilotsite() + '&users=' + groupName,
        type: 'POST',
        async: false,
        success: function (php_script_response) {
            responseHandler(php_script_response);
        }
    });
}


function criterias(categoryId) {

    var formData = new FormData();

    formData.append("func", "getCategortCriterias");
    formData.append("category", categoryId);

    makeAjaxCall(formData, addActivityCriterias);
}
/////////


function ping(handler) {
    var formData = new FormData();
    formData.append("func", "ping");

    makeAjaxCall(formData, handler);
}

//var url = "http://cs.uef.fi/~ec2l/seval.php";
var url = "https://cs.uef.fi/~ec2l/selfEvaluationManager.php";
//var url = "http://localhost/php/selfEvaluationManager.php"; 
function makeAjaxCall(formData, handler, async = true) {
    //if (!handler)
    //  handler = successHandler;
    $.ajax({
        url: url,
        dataType: 'text',
        //cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: 'POST',
        async: async,
        success: function (php_script_response) {
            handler(php_script_response);
        },
        error: (error) => {
			console.log(error);
		}
    });
}

function successHandler(phpResult) {
    console.log(phpResult);
}
