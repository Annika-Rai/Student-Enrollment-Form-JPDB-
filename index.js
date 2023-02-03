/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var stuDBName = 'SCHOOL-DB';
var stuRelationName = 'STUDENT-TABLE';
var connToken = '90932708|-31949276580140663|90954659';

$("#roll").focus();

function saveRecNo2LS(jsonObj){
    var lvData=JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getRollAsJsonObj() {
    var rollno = $('#roll').val();
    var jsonStr = {
        id: "roll"
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $('#name').val(data.name);
    $('#cls').val(data.cls);
    $('#dob').val(data.dob);
    $('#addr').val(data.addr);
    $('#doe').val(data.doe);
}

function resetForm(){
    $('#roll').val("");
    $('#name').val("");
    $('#cls').val("");
    $('#dob').val("");
    $('#addr').val("");
    $('#doe').val("");
    $('#roll').prop("disabled",false);
    $('#save').prop("disabled",true);
    $('#change').prop("disabled",true);
    $('#reset').prop("disabled",true);
    $('#roll').focus();
}

function validateData() {
    var rollno, fullname, clss, bDate, add, eDate;
    rollno=$('#roll').val();
    fullname = $('#name').val();
    clss = $('#cls').val();
    bDate = $('#dob').val();
    add = $('#addr').val();
    eDate = $('#doe').val();
    if(rollno === '') {
        alert('Roll No missing');
        $('#roll').focus();
        return "";
    }
    if(fullname === '') {
        alert('Student Name missing');
        $('#name').focus();
        return "";
    }
    if(clss === '') {
        alert('Class missing');
        $('#cls').focus();
        return "";
    }
    if(bDate === '') {
        alert('Birth date  missing');
        $('#dob').focus();
        return "";
    }
    if(add === '') {
        alert('Address missing');
        $('#addr').focus();
        return "";
    }
    if(eDate === '') {
        alert('Enrollment Date missing');
        $('#doe').focus();
        return "";
    }
    
    var jsonStrObj = {
        roll : rollno,
        name : fullname,
        cls : clss,
        dob : bDate,
        addr : add,
        doe : eDate
    };
    return JSON.stringify(jsonStrObj);
}

function findRoll() {
    var rollJsonObj = getRollAsJsonObj();
    var getRequest = createGET_BY_KEYREQUEST(connToken, stuDBName, stuRelationName, rollJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status === 400) {
        $('#save').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#name').focus();
    }
    else if(resJsonObj.status === 200) {
        $('#roll').prop('disabled',true);
        fillData(resJsonObj);
        $('#change').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#name').focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if(jsonStrObj === '') {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, stuDBName, stuRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#rollno').focus();
}

function changeData() {
    $("#change").prop('disabled', true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stuDBName, stuRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#rollno').focus();
}
