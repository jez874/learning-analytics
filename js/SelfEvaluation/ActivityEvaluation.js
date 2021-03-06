
function setCategory(result, status) {

    var list = JSON.parse(result);

    $('#activityTitle').append(list.DATA[0].Title);
    $('#activitiDesc').append(list.DATA[0].Description);

    for (i = 0; i < list.DATA.length; i++) {
        var riga = list.DATA[i];

        if (riga.CategoryId) {
            var html = "<div id=\"category_" + riga.CategoryId + "\" class=\"category row-fluid container-fluid form-horizontal\">";
            html += "<div class=\"row-fluid  container-fluid category-header\">    <div class=\"categoryTitle col-xs-12\">";
            html += "<h3>" + riga.CategoryName + "</h3>    </div> </div> <div class=\"row-fluid  container-fluid category-body\">";

            //category criteria
            html += "<div id=\"category_" + riga.CategoryId + "-criterias\" class=\"col-sm-4 \" style=\"padding-left: 0px; padding-right:opx;\"> </div>";

            //students remarks
            html += "<div class=\"col-sm-6  form-group\" > <label for=\"category_" + riga.CategoryId + "_remark\">Students remarks:</label>  <p name=\"remark\" id=\"category_" + riga.CategoryId + "_remark\" style=\"margin-right: 10px;\" ></p>    </div>";

            //self-evaluation
            html += "<div class=\"col-sm-2 form-group\">  <label for=\"category_" + riga.CategoryId + "_selfEvaluation\">Self-evaluation: </label> <label name=\"selfEvaluation\" class=\"form-control\" id=\"category_" + riga.CategoryId + "_selfEvaluation\" disabled> </label> </div> </div>";

            //teacher evaluation
            html += "<div class=\"row-fluid container-fluid category-footer\"> <div class=\"col-md-2 container-fluid\"> <label for=\"category_" + riga.CategoryId + "-teacherEvaluation\">Teacher evaluation: </label>";
            html += "<select id=\"category_" + riga.CategoryId + "-teacherEvaluation\" class=\"form-control\"> <option value=\"\"></option> <option>1</option> <option>2</option> <option>3</option> <option>4</option> <option>5</option></select> </div>";

            //teacher remark
            html += "<div class=\"col-md-10\" style=\"text-align: justify; text-justify: inter-word;\"> <label for=\"category_" + riga.CategoryId + "-teacherNote\"> Teacher's note: </label> <textarea id=\"category_" + riga.CategoryId + "-teacherNote\" class=\"form-control\"  placeholder=\"Teacher's note\" rows=\"5\" width=\"100%\"> </textarea>    </div></div></div>";

            $('#categoryContainer').append(html);

            getCategoryCriterias(riga.CategoryId, addCriterias);
        }
    }

    hideLoader();

    getSelfEvaluation(getActivityId(), getGroupId(), setSelfEvaluation);

}



function setSelfEvaluation(result, status) {

    if (result) {
        var list = JSON.parse(result);

        if (list.DATA.length > 0) {
            $('#evaluatedGroup').append(list.DATA[0].GroupName);
            //$('#whatWeKnow').append(list.DATA[0].WhatWeKnow);
            //$('#notClear').append(list.DATA[0].NotClear);

		$.ajax({

			type: 'POST',
			url: 'https://cs.uef.fi/~tapanit/ecraft2learn/api/pilot_2/get_notes_etc.php',
			data: 'groupId=' + getGroupId() + '&activityId=' + getActivityId(),
			success: function(data) {

				let parsed = JSON.parse(data);
				let first = parsed[0];

				$('#whatWeKnow').append(first.WhatWeKnow);
				$('#notClear').append(first.NotClear);

			},
			error: function(error) {
				
				// FAIL silently

			}

		});

            getGroupEvaluationFromLearningAnalytics(list.DATA[0].GroupName, setGroupScore);
        }
    }
}

function setGroupScore(result, satus){
    //alert(result);
    var list = JSON.parse(result);
    $('#learninAnalyticsScore').append(list.status_code);
}

function addCriterias(result, status, categoryId) {
    var list = JSON.parse(result);

    var gruppedCriterias = groupCriteriaValues(list.DATA);

    var html = "";
    if (gruppedCriterias.length > 0) {
        $.each(gruppedCriterias, function (index, criteria) {
            html += "<div class=\"row-fluid container-fluid form-group\" style=\"width: 100%; padding-bottom: 5px; padding-right: 0px; padding-left: 0px; margin:0px; \">";
            //html += "<div class=\"col-md-8\">" + criteria.Name + "</div>  <div class=\"col-md-4\">  <select id=\"category_" + criteria.Category + "-criteria_" + criteria.CritId + "-value\" class=\"form-control\"> <option value=\"\">-</option>";
            html += "<label for=\"category_" + criteria.Category + "-criteria_" + criteria.CritId + "_value\">" + criteria.Name + "</label>  <label id=\"category_" + criteria.Category + "-criteria_" + criteria.CritId + "_value\" name=\"criteria\" class=\"form-control\" disabled>";

            /*
            for (i = 0; i < criteria.CritValues.length; i++) {
                html += "<option value=\"" + criteria.CritValues[i] + "\">" + criteria.CritValues[i] + "</option>";
            }*/

            html += "</label> </div>";
        });

        $('#category_' + list.DATA[0].Category + '-criterias').append(html);
        //alert("added criterias")
        window.sessionStorage.setItem('tempActivityId', getActivityId());
	window.sessionStorage.setItem('tempCategoryId', list.DATA[0].Category);
	window.sessionStorage.setItem('tempGroupId', getGroupId());
	getCategorySelfEvaluation(getActivityId(), list.DATA[0].Category, getGroupId(), setCategorySelfEvaluation);
    } else
	getCategorySelfEvaluation(getActivityId(), categoryId, getGroupId(), setCategorySelfEvaluation);

}

function setCategorySelfEvaluation(result, status) {
    //console.log(result);
    if (result) {
        var list = JSON.parse(result);
        if (list.DATA.length > 0) {
            //alert("setting eval criterias");
            var gruppedEvaluations = groupEvaluations(list.DATA);

            //$('#whatWeKnow').val(gruppedEvaluations.WhatWeKnow);
            //$('#notClear').val(gruppedEvaluations.NotClear);

            $('#category_' + gruppedEvaluations.Category + '_remark').append(gruppedEvaluations.Remark);
            //$('#category_' + gruppedEvaluations.Category + '_selfEvaluation').append(gruppedEvaluations.SelfEvaluation);
//            $('#category_' + gruppedEvaluations.Category + '-teacherEvaluation').val(gruppedEvaluations.TeacherEvaluation);
//            $('#category_' + gruppedEvaluations.Category + '-teacherNote').val(gruppedEvaluations.TeacherNote);

		for (let i = 0; i < list.DATA.length; i++) {

			 $('#category_' + list.DATA[i].Category + '-teacherEvaluation').val(list.DATA[i].TeacherEvaluation);
			 $('#category_' + list.DATA[i].Category + '-teacherNote').val(list.DATA[i].TeacherNote);
		}

	//console.log(gruppedEvaluations);
		/*
            $.each(gruppedEvaluations.Criterias, function (index, critEval) {

	       console.log(critEval);

                $('#category_' + gruppedEvaluations.Category + '-criteria_' + critEval.Criteria + '_value').append(critEval.Value);

            });
	*/

	for (let i = 0; i < list.DATA.length; i++) {

		$('#category_' + list.DATA[i].Category + '_selfEvaluation').text(list.DATA[i].SelfEvaluation);
		$('#category_' + list.DATA[i].Category + '_remark').text(list.DATA[i].Remark);

	}

	$.ajax({

		type: 'POST',
		url: 'https://cs.uef.fi/~tapanit/ecraft2learn/api/pilot_2/get_ref.php',
		data: 'activityId=' + window.sessionStorage.getItem('tempActivityId') + '&categoryId=' + window.sessionStorage.getItem('tempCategoryId') + '&groupId=' + window.sessionStorage.getItem('tempGroupId'),
		success: function(data) {

			data = JSON.parse(data);

			let labels = $('label[name=criteria]');

			for (let i = 0; i < data.length; i++) {

				$(labels[i]).text(data[i].Value);	
		
			}

		}
	});

        }

        hideLoader();
    }
}

function groupCriteriaValues(list) {

    var grouppedCritValues = Object.values(list.reduce((result, {
        CritId,
        Name,
        Value,
        Category
    }) => {
        // Create new group
        if (!result[CritId]) result[CritId] = {
            CritId,
            Name,
            Category,
            CritValues: [],
        };
        // Append to group
        result[CritId].CritValues.push(
            Value
        );
        return result;
    }, {}));

    return grouppedCritValues;
}

function groupEvaluations(list) {

    if (list) {
        var grouppedEvaluaion = {
            Category: list[0].Category,
            SelfEvaluation: list[0].SelfEvaluation,
            Remark: list[0].Remark,
            TeacherEvaluation: list[0].TeacherEvaluation,
            TeacherNote: list[0].TeacherNote,
            TeacherSubmissionDate: list[0].TeacherSubmissionDate,
            Criterias: []
        };

        $.each(list, function (index, row) {

            grouppedEvaluaion.Criterias.push(
                {
                    Criteria: row.Criteria,
                    Value: row.Value
                });
        });

        return grouppedEvaluaion;
    }
}

function saveEvaluation() {
    var evaluation = {
        Activity: getActivityId(),
        GroupId: getGroupId(),
        Teacher: getTeacherId(),
        Categories: []
    };


    $.each($('.category'), function (i, category) {

        var category = category.id;
        category = category.split("_")[1];

        var remark = $('#category_' + category + '-teacherNote').val();
        var categoryEvaluation = $('#category_' + category + '-teacherEvaluation').val();

        evaluation.Categories.push({
            Category: category,
            TeacherNote: remark,
            Evaluation: categoryEvaluation
        });

    });

    submitEvaluation(evaluation, succesfullSave);
}

function succesfullSave(result, status) {
    $("#saveCompleteModal").modal();
}

function confirmEndEvaluationModal() {
    $("#confirmEndEvaluationModal").modal();
}

