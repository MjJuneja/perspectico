'use strict';

///Routing for shared calls

const express = require('express');
const router = express.Router();

const dbOperations = require("../config/crudoperations/commonoperations");
const validate = require("../config/validate");
const logger = require("../config/logger");

////////////Activate Email
router.post('/activateEmail', function (request, response) {
    logger.debug('routes common activateemail');
    var activationObject = request.body;
    var isValidUserEmail = validate.email(activationObject.userEmail);
    var isValidToken = validate.string(activationObject.token);
    if (isValidUserEmail === true && isValidToken === true) {
        dbOperations.checkToken(request, response);
    }
    else {
        response.json({ message: "fail" });
    }
});

// /////////////Social SignIn
// router.post('/socialSignin',function(request,response){
//     var socialObject=request.body;
//     var isValidUserEmail=validate.email(socialObject.Email);
//     var isValidName=validate.name(socialObject.FullName);
//     var isValidSocial=validate.name(socialObject.Social);
//     if(isValidUserEmail===true && isValidSocial===true && isValidName===true){
//         dbOperations.socialSignin(request,response);
//     }
//     else{
//         response.json({message:"fail"});
//     }
// });

////////////CheckUsername if already exists
router.post('/checkUsername', function (request, response) {
    logger.debug('routes common checkUsername');
    request.body.username = request.body.username.toLowerCase();
    var usernameObj = request.body;
    usernameObj.notFound = undefined;
    dbOperations.checkUsername(usernameObj, function () {
        if (usernameObj.notFound == true) {
            response.json({ "message": "notfound" });
        }
        else {
            response.json({ "message": "found" });
        }
    });
});

///////////Load Pods
router.post('/loadPods', function (request, response) {
    logger.debug('routes common loadPods');

    if ((request.body.type === "search" || request.body.type === "top") && !request.session.user && !request.body.sessionid) {
        var userData = {};
        dbOperations.loadPods(request, response, userData);
    }
    else {
        var isValidSessionid = false;
        var webSessionExist = false;

        if (request.body.appCall === true && request.body.sessionid != undefined) {
            isValidSessionid = validate.string(request.body.sessionid);
        }
        else if (request.session.user) {
            webSessionExist = true;
        }

        if (webSessionExist === true) {
            var userData = request.session.user;
            dbOperations.loadPods(request, response, userData);
        }
        else if (isValidSessionid === true) {
            var userData = {};
            commonOperations.getProfileData(request.body.sessionid, userData, function (userData) {
                if (userData != undefined) {
                    dbOperations.loadPods(request, response, userData);
                }
                else {
                    response.json({ message: "unknown" });
                }
            });
        }
        else {
            response.json({ message: "unknown" });
        }
    }

});


///////////Delete Pod
router.post('/deletePod', function (request, response) {
    logger.debug('routes common deletePod');

    var isValidSessionid = false;
    var webSessionExist = false;

    if (request.body.appCall === true && request.body.sessionid != undefined) {
        isValidSessionid = validate.string(request.body.sessionid);
    }
    else if (request.session.user) {
        webSessionExist = true;
    }

    if (webSessionExist === true) {
        var userData = request.session.user;
        dbOperations.checkRights(request, response, userData);
    }
    else if (isValidSessionid === true) {
        var userData = {};
        commonOperations.getProfileData(request.body.sessionid, userData, function (userData) {
            if (userData != undefined) {
                dbOperations.checkRights(request, response, userData);
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


///////////Like Pod
router.post('/likePod', function (request, response) {
    logger.debug('routes common likePod');

    var isValidSessionid = false;
    var webSessionExist = false;

    if (request.body.appCall === true && request.body.sessionid != undefined) {
        isValidSessionid = validate.string(request.body.sessionid);
    }
    else if (request.session.user) {
        webSessionExist = true;
    }

    if (webSessionExist === true) {
        var userData = request.session.user;
        dbOperations.likePod(request.body.podId, response, userData);
    }
    else if (isValidSessionid === true) {
        var userData = {};
        commonOperations.getProfileData(request.body.sessionid, userData, function (userData) {
            if (userData != undefined) {
                dbOperations.likePod(request.body.podId, response, userData);
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

///////////Wish Pod
router.post('/wishPod', function (request, response) {
    logger.debug('routes common wishPod');

    var isValidSessionid = false;
    var webSessionExist = false;

    if (request.body.appCall === true && request.body.sessionid != undefined) {
        isValidSessionid = validate.string(request.body.sessionid);
    }
    else if (request.session.user) {
        webSessionExist = true;
    }

    if (webSessionExist === true) {
        var userData = request.session.user;
        dbOperations.wishPod(request.body.podId, response, userData);
    }
    else if (isValidSessionid === true) {
        var userData = {};
        commonOperations.getProfileData(request.body.sessionid, userData, function (userData) {
            if (userData != undefined) {
                dbOperations.wishPod(request.body.podId, response, userData);
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



