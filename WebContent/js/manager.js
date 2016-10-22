var url = "http://localhost:8080/QKPracticeService/practiceManager/";
var commontUrl = "http://localhost:8080/QKPracticeService/common/";

function getAllSubjects(id) {
	$.ajax({
		type : "get",
		dataType : "json",
		url : commontUrl + "allSubjects",
		contentType : "application/json;charset=utf-8",
		async : false,
		success : function(msg) {
			if (msg.httpStatus == "OK") {
				var obj = $("#subjectId")
				$(obj).empty();
				$(obj).prepend("<option value=''>--请选择--</option>"); // 在前面插入一项option
				$.each(msg.data, function(key, value) {
					$(obj)
							.append(
									"<option value =" + value + ">" + key
											+ "</option>"); // 添加一项option
				});
				$(obj).val(id); // 设置选中值
			}
		}
	});
}

function getAllTags(values) {
	$.ajax({
		type : "get",
		dataType : "json",
		url : commontUrl + "allTags",
		contentType : "application/json;charset=utf-8",
		async : false,
		success : function(msg) {
			if (msg.httpStatus == "OK") {
				var obj = $("#tags");
				$(obj).empty();
				$(obj).prepend("<option value=''>--请选择--</option>"); // 在前面插入一项option
				$.each(msg.data, function(key, value) {
					$(obj)
							.append(
									"<option value =" + value + ">" + key
											+ "</option>"); // 添加一项option
				});
				if (values != null & values != '') {
					$(obj).val(values);
				}
			}
		}
	});
}

function multiAllTagsSelect(values) {

	$.ajax({
		type : "get",
		dataType : "json",
		url : commontUrl + "allTags",
		contentType : "application/json;charset=utf-8",
		async : false,
		success : function(msg) {
			if (msg.httpStatus == "OK") {
				var obj = $("#tags");
				$.each(msg.data, function(key, value) {
					$(obj).selectMultiple('addOption', {
						value : value,
						text : key
					});
				});
				if (values != null & values != '') {
					$(obj).selectMultiple('select', values);
				}
			}
		}
	});
}

function initPracticeManager() {
	var title = sessionStorage.getItem("title");
	var subjectId = sessionStorage.getItem("subjectId");
	$("#title").val(title);
	getAllSubjects(subjectId);
	if (sessionStorage.getItem("isLaod") == "Y") {
		getPractices();
		sessionStorage.setItem("title", "");
		sessionStorage.setItem("subjectId", "");
		sessionStorage.setItem("isLaod", "");
	}
}
function getPractices() {
	$.ajax({
		type : "post",
		dataType : "json",
		url : url,
		contentType : "application/json;charset=utf-8",
		data : JSON.stringify({
			title : $("#title").val(),
			subjectId : $("#subjectId").val()
		}),
		success : function(msg) {
			if (msg.httpStatus == "OK") {
				$("#practiceTab tbody").html("");
				var obj = $("#practiceTab tbody");
				var vewURL, editURL;
				var paramString;
				$.each(msg.data, function(index, p) {
					vewparam = {
						practiceId : p.practiceId,
						subjectId : $("#subjectId").val(),
						title : $("#title").val()
					};
					paramString = escape(JSON.stringify(vewparam));
					vewURL = "practice_detail.html?json=" + paramString;
					editURL = "practice_edit.html?json=" + paramString;
					$("#practiceTab tbody").append(
							"<tr><td> <input name='practiceIds' type='checkbox' value='"
									+ p.practiceId + "'/>&nbsp;" + (index + 1)
									+ "</td><td><a href=" + vewURL
									+ " target='iframe')>" + p.title
									+ "</a></td><td>" + p.subject.name
									+ "</td><td>" + p.isPublic + "</td><td>"
									+ getDate(p.createdTime)
									+ "</td><td><a href=" + editURL
									+ " target='iframe'>编辑</a></td></tr>");
				});

			} else if (msg.httpStatus == "NOT_FOUND") {
				$("#practiceTab tbody").html("");
			}
		}
	});
}
function initPracticeDetail() {
	var param, json;
	param = getParamString('json');
	json = eval("(" + param + ")");
	sessionStorage.setItem("title", json.title);
	sessionStorage.setItem("subjectId", json.subjectId);
	sessionStorage.setItem("isLaod", "Y");
	$.ajax({
		type : "get",
		dataType : "json",
		url : url + json.practiceId,
		contentType : "application/json;charset=utf-8",
		success : function(msg) {
			if (msg.httpStatus == "OK") {
				var data = msg.data;
				$("#title").html(data.title);
				$("#description").html(data.description);
				$("#subject").html(data.subject.name);
				$("#isPublic").html(data.isPublic);
				$("#createdTime").html(getDate(data.createdTime));
				var tags = "";
				$.each(data.tags, function(index, tag) {
					tags = tags + " " + tag.tag;
				});
				$("#tags").html(tags);
				$("#answer").html(data.answer.answer);
			} else if (msg.httpStatus == "NOT_FOUND") {
				// $("#practiceTab tbody").html("");
			}
		}
	});
}

function initPracticeEdit() {
	var param, json;
	param = getParamString('json');
	json = eval("(" + param + ")");
	sessionStorage.setItem("title", json.title);
	sessionStorage.setItem("subjectId", json.subjectId);
	sessionStorage.setItem("isLaod", "Y");
	$.ajax({
		type : "get",
		dataType : "json",
		url : url + json.practiceId,
		contentType : "application/json;charset=utf-8",
		success : function(msg) {
			if (msg.httpStatus == "OK") {
				var data = msg.data;
				$("#practiceId").val(data.practiceId);
				$("#title").html(data.title);
				$("#description").val(data.description);
				getAllSubjects(data.subjectId);
				$("input[name='isPublic'][value='" + data.isPublic + "']")
						.attr("checked", true);
				$("#createdTime").html(getDate(data.createdTime));
				var tags = [];
				$.each(data.tags, function(index, tag) {
					tags[index] = tag.tagId;
				});
				// getAllTags(tags);
				multiAllTagsSelect(tags);
				$("#answer").val(data.answer.answer);
				$("#answerId").val(data.answerId);
			} else if (msg.httpStatus == "NOT_FOUND") {
				// $("#practiceTab tbody").html("");
			}
		}
	});
}

function editPractice(obj) {
	var tagIds = $("#tags").val();
	var tags = [];
	$.each(tagIds, function(index, id) {
		if (id != "") {
			tags.push(jQuery.parseJSON('{"tagId":' + id + '}'));
		}
	});
	$.ajax({
		type : "post",
		dataType : "json",
		url : url + "update",
		data : JSON.stringify({
			practiceId : $("#practiceId").val(),
			description : $("#description").val(),
			title : $("#title").val(),
			subjectId : $("#subjectId").val(),
			answerId : $("#answerId").val(),
			answer : {
				"answer" : $("#answer").val(),
				"answerId" : $("#answerId").val()
			},
			isPublic : $("input[name='isPublic']:checked").val(),
			tags : tags
		}),
		contentType : "application/json;charset=utf-8",
		async : false,
		success : function(msg) {
			if (msg.httpStatus == "OK") {
				alert("更新成功！");
				$(obj).attr("href", "practice_manager.html");
			} else {
				alert("更新失败！");
				$(obj).attr("href", "#");
			}
		}
	});
}

function addPractice(obj) {
	if ($("#title").val() == null | $("#title").val().trim() == '') {
		$("#errorMsg").html('标题不能为空');
		$(obj).attr("href", "#");
		return;
	}
	if ($("#answer").val() == null | $("#answer").val().trim() == '') {
		$("#errorMsg").html('答案不能为空');
		$(obj).attr("href", "#");
		return;
	}
	if ($("#description").val() == null | $("#description").val().trim() == '') {
		$("#errorMsg").html('问题不能为空');
		$(obj).attr("href", "#");
		return;
	}
	var tagIds = $("#tags").val();
	var tags = [];
	$.each(tagIds, function(index, id) {
		if (id != "") {
			tags.push(jQuery.parseJSON('{"tagId":' + id + '}'));
		}
	});
	$.ajax({
		type : "post",
		dataType : "json",
		url : url + "add",
		data : JSON.stringify({
			description : $("#description").val(),
			title : $("#title").val(),
			subjectId : $("#subjectId").val(),
			answer : {
				"answer" : $("#answer").val()
			},
			isPublic : $("input[name='isPublic']:checked").val(),
			tags : tags
		}),
		contentType : "application/json;charset=utf-8",
		async : false,
		success : function(msg) {
			sessionStorage.setItem("isLaod", "Y");
			if (msg.httpStatus == "OK") {
				alert("添加成功！");
				$(obj).attr("href", "practice_manager.html");
			} else {
				alert("添加失败！");
				$(obj).attr("href", "#");
			}
		}
	});
}

function deletePractice(obj) {
	var ids = getValuesFromCheckBox("practiceIds");
	ids = ids.toString();
	if (ids == null | ids == "") {
		alert("请选择要删除的练习！");
		$(obj).attr("href", "#");
		return;
	}
	$.ajax({
		type : "post",
		dataType : "json",
		url : url + "delete",
		data : JSON.stringify({
			ids : ids
		}),
		contentType : "application/json;charset=utf-8",
		async : false,
		success : function(msg) {
			sessionStorage.setItem("isLaod", "Y");
			if (msg.httpStatus == "OK") {
				alert("删除成功！");
				$(obj).attr("href", "practice_manager.html");
			} else {
				alert("删除失败！");
				$(obj).attr("href", "#");
			}
		}
	});
}

// $("input:radio[name='dialCheckResult']:checked").val()
// $("input[name=´rd´]:checked").val();
