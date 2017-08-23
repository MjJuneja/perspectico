'use strict';

//Routing for userdashboard factory only calls

const express = require('express');
const router = express.Router();

const dbOperations = require("../config/crudoperations/userdashboard");
const validate = require("../config/validate");
const logger = require("../config/logger");
const multer = require('multer');

///New podcast upload

var podStorage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, "./public/Podcasts_temp");
    },
    filename: function (request, file, callback) {
        callback(null, request.podId + '.mp3');
    }
});

var uploadPod = multer({
    storage: podStorage,
    limits: { fileSize: 20000000 },
    fileFilter: function (request, file, cb) {
        logger.debug('routes userdash fileFilterPod');
        if (file.mimetype != 'audio/mpeg3' && file.mimetype != 'audio/x-mpeg-3' && file.mimetype != 'audio/mp3') {
            request.fileValidationError = true;
            return cb(null, false, new Error('Invalid file type'));
        }
        cb(null, true);
    }
}).single('file');


var uploadAndSave = function (request, response, userData) {

    if (!request.body.title) {
        request.fileValidationError = false;
        const utils = require('../config/utils');
        request.podId = utils.randomStringGenerate(16);
        try {
            uploadPod(request, response, function (error) {
                if (error) {
                    logger.error(error);
                    response.json({ message: "fail" });
                } else if (request.fileValidationError === true) {
                    logger.error("request.fileValidationError", request.fileValidationError);
                    response.json({ message: "fail" });
                }
                else {
                    request.session.user.currentpodId = request.podId;
                    ///NOT READY FOR APP CALL YET
                    response.json({ message: "success" });
                }
            })
        }
        catch (error) {
            logger.error(error);
        }
    }
    else if (request.body.title) {
        var podObject = request.body;
        var isValidTitle = validate.string(podObject.title);
        var isValidSub = validate.string(podObject.subtext);
        var isValidDescription = validate.longString(podObject.description);
        var isValidType = validate.string(podObject.type);

        request.body.verified = false;
        if (userData.role === 'admin' || userData.role === 'ops') {
            request.body.verified = true;
        }
        if(isValidTitle && isValidSub && isValidDescription && isValidType){
            dbOperations.createPod(request, response, userData);
        }
        else{
           response.json({ message: "fail" }); 
        }
    }
    else {
        response.json({ message: "fail" });
    }
};


router.post('/postPod', function (request, response) {
    logger.debug('routes userdashboard postPod');

    var isValidSessionid = false;
    var webSessionExist = false;
    var sessionVerified = false;

    if (request.body.appCall === true && request.body.sessionid != undefined) {
        isValidSessionid = validate.string(request.body.sessionid);
    }
    else if (request.session.user) {
        webSessionExist = true;
    }

    if (webSessionExist === true) {
        uploadAndSave(request, response, request.session.user);
    }
    else if (isValidSessionid === true) {
        var userData = {};
        commonOperations.getProfileData(request.body.sessionid, userData, function (userData) {
            if (userData != undefined) {
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

module.exports = router;