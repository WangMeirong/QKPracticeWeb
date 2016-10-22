//获得年月日      得到日期oTime  
function getDate(str) {
	var oDate = new Date(str), oYear = oDate.getFullYear(), oMonth = oDate
			.getMonth() + 1, oDay = oDate.getDate(), oHour = oDate.getHours(), oMin = oDate
			.getMinutes(), oSen = oDate.getSeconds(), oTime = oYear + '-'
			+ getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':'
			+ getzf(oMin) + ':' + getzf(oSen);// 最后拼接时间
	return oTime;
};
// 补0操作
function getzf(num) {
	if (parseInt(num) < 10) {
		num = '0' + num;
	}
	return num;
}

function getParamString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

function checkAll(obj, cName) {
	var checkboxs = $("input[name='" + cName + "']");
	for (var i = 0; i < checkboxs.length; i += 1) {
		checkboxs[i].checked = obj.checked;
	}
}

function getValuesFromCheckBox(cName) {
	var chk_value = [];
	$("input[name='" + cName + "']:checked").each(function() {
		chk_value.push($(this).val().trim());
	});
	return chk_value;
}
