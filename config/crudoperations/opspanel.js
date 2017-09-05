'use strict';

const Members = require("../memberschema");
const logger = require("../logger");


const dbOperations = {

    //Create a new member
    createMember: function (request, response, session) {
        logger.debug('crud opspanel createMember');
        const utils = require('../utils');
        var randomNumber=utils.randomNumberGenerate(0, 9);

        var member = {
            memberId: session.currentmemberId,
            picUrl: session.currentmemberId + ".jpeg",
            name: request.body.name,
            designation: request.body.designation,
            description: request.body.description,
            fblink: request.body.fblink,
            twlink: request.body.twlink,
            lklink: request.body.lklink,
            priority: request.body.priority,
            joinDate: new Date(),
            postedByEmail: session.useremail,
            randomNumber: randomNumber,
        }
        
        Members.create(member,function(error,result){
            
            if(error){
                logger.error(error);
            }
            else{
                logger.debug('crud result'+ result); 
                response.json({message:"success"});
            }
        });
    },

    deleteMember: function (memberId, response) {
        logger.debug('crud opspanel deleteMember');
        Members.remove({
            memberId: memberId
        }
            , function (error, result) {
                if (error) {
                    logger.error(error);
                }
                else {
                    logger.debug('crud result' + result);
                    const fs = require('fs');
                    var filePath = './public/Members/' + memberId + '.jpeg';
                    fs.unlink(filePath, function (error) {
                        if (error) return logger.error(error);
                    });
                    response.json({ message: "success" });
                }
            });
    },

    loadMembers:function(response){
        logger.debug('crud opspanel loadMembers');
        Members.find({})
        .sort({priority:-1})
        .exec(function (error, result) {
            if (error) {
                    logger.error(error);
                }
                else {
                    logger.debug('crud result' + result);
                    if (result.length < 1) {
                        response.json({ message: "none" });
                    }
                    else {
                        response.send(result);
                    }
                }
        });
    },

    loadUsers:function(response){
        logger.debug('crud opspanel loadUsers');
        const Users = require('../userschema');
        Users.find({},
            {
                useremail:1,
                _id:0
            }
            , function (error, result) {
                if (error) {
                    logger.error(error);
                }
                else {
                    logger.debug('crud result' + result);
                    response.send(result);
                }
            });
    }

};

module.exports = dbOperations;