'use strict';

const Pods = require("../podschema");
const logger = require("../logger");


const dbOperations = {

    //Create a new Pod
    createPod: function (request, response, session) {
        logger.debug('crud userdash createPod');
        const utils = require('../utils');
        var randomNumber=utils.randomNumberGenerate(0, 9);

        var pod = {
            podId: session.currentpodId,
            coverUrl: session.currentpodId + ".jpeg",
            fileUrl: session.currentpodId + ".mp3",
            title: request.body.title,
            subtext: request.body.subtext,
            description: request.body.description,
            type: request.body.type,
            uploadDate: new Date(),
            likes: 0,
            postedByUsername: session.username,
            postedByEmail: session.useremail,
            randomNumber: randomNumber,
            verified: request.body.verified
        }
        
        Pods.create(pod,function(error,result){
            
            if(error){
                logger.error(error);
            }
            else{
                logger.debug('crud result'+ result); 
                response.json("success");
            }
        });
    },

};

module.exports = dbOperations;