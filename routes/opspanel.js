'use strict';

//Routing for opspanel factory only calls

const express = require('express');
const router = express.Router();

const dbOperations = require("../config/crudoperations/opspanel");
const validate = require("../config/validate");
const logger = require("../config/logger");
const multer = require('multer');

///New podcast upload

var memberStorage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, "./public/Members_temp");
    },
    filename: function (request, file, callback) {
        callback(null, request.memberId + '.jpeg');
    }
});

var uploadMember = multer({
    storage: memberStorage,
    limits: { fileSize: 1000000 },
    fileFilter: function (request, file, cb) {
        logger.debug('routes opspanel fileFilterMember');
        if (file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') {
            request.fileValidationError = true;
            return cb(null, false, new Error('Invalid file type'));
        }
        cb(null, true);
    }
}).single('file');


var uploadAndSave = function (request, response, userData) {
    const utils = require('../config/utils');
    if (!request.body.name) {
        request.fileValidationError = false;
        request.memberId = utils.randomStringGenerate(16);
        try {
            uploadMember(request, response, function (error) {
                if (error) {
                    logger.error(error);
                    response.json({ message: "fail" });
                } else if (request.fileValidationError === true) {
                    logger.error("request.fileValidationError", request.fileValidationError);
                    response.json({ message: "fail" });
                }
                else {
                    request.session.user.currentmemberId = request.memberId;
                    ///NOT READY FOR APP CALL YET
                    response.json({ message: "success" });
                }
            })
        }
        catch (error) {
            logger.error(error);
        }
    }
    else if (request.body.name) {
        var memberObject = request.body;
        var isValidName = validate.name(memberObject.name);
        var isValidDesignation = validate.string(memberObject.designation);
        var isValidDescription = validate.longString(memberObject.description);
        var isValidFblink = validate.string(memberObject.fblink);
        var isValidTwlink = validate.string(memberObject.twlink);
        var isValidLklink = validate.string(memberObject.lklink);

        if(isValidName && isValidDesignation && isValidDescription && isValidFblink && isValidTwlink && isValidLklink && memberObject.priority<10){
            var oldpath="./public/Members_temp/"+userData.currentmemberId+".jpeg";
            var newpath="./public/Members/"+userData.currentmemberId+".jpeg";
            utils.fsmove(oldpath,newpath,function(error,result){
                if(error){
                    logger.error(error);
                }
                else{
                    dbOperations.createMember(request, response, userData);
                }
            });
        }
        else{
           response.json({ message: "fail" }); 
        }
    }
    else {
        response.json({ message: "fail" });
    }
};


router.post('/postMember', function (request, response) {
    logger.debug('routes opspanel postmember');

    var isValidSessionid = false;
    var webSessionExist = false;
    var sessionVerified = false;

    if (request.body.appCall === true && request.body.sessionid != undefined) {
        isValidSessionid = validate.string(request.body.sessionid);
    }
    else if (request.session.user) {
        webSessionExist = true;
    }

    if (webSessionExist === true && (request.session.user.role==='admin' || request.session.user.role==='ops')) {
        uploadAndSave(request, response, request.session.user);
    }
    else if (isValidSessionid === true) {
        var userData = {};
        commonOperations.getProfileData(request.body.sessionid, userData, function (userData) {
            if (userData != undefined && (userData.role==='admin' || userData.role==='ops')) {
                uploadAndSave(request, response, userData);
            }
            else {
                response.json({ message: "unknown" });
            }
        });
    }
    else {
        response.json({ message: "unknown" });
    }

});

router.post('/deleteMember', function (request, response) {
    logger.debug('routes opspanel deleteMember');
    var isValidSessionid = false;
    var webSessionExist = false;

    if (request.body.appCall === true && request.body.sessionid != undefined) {
        isValidSessionid = validate.string(request.body.sessionid);
    }
    else if (request.session.user) {
        webSessionExist = true;
    }

    if (webSessionExist === true && (request.session.user.role==='admin' || request.session.user.role==='ops')) {
        dbOperations.deleteMember(request.body.memberId, response);
    }
    else if (isValidSessionid === true) {
        var userData = {};
        commonOperations.getProfileData(request.body.sessionid, userData, function (userData) {
            if (userData != undefined && (userData.role==='admin' || userData.role==='ops')) {
                dbOperations.deleteMember(request.body.memberId, response);
            }
            else {
                response.json({ message: "unknown" });
            }
        });
    }
    else {
        response.json({ message: "unknown" });
    }
});

router.post('/loadMembers', function (request, response) {
    logger.debug('routes opspanel loadmembers');
    dbOperations.loadMembers(response);
});

module.exports = router;