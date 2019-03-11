'use strict';
var async = require('async');
var Joi = require('Joi');
module.exports = function (Studentdata) {
    const csv = require('csv-parser')
    const fs = require('fs')

    const results = [];

    const schema = Joi.object().keys({
        id: Joi.number().required(),
        lname: Joi.string().alphanum().min(3).max(10).required(),
        fname: Joi.string().alphanum().min(3).max(10).required(),
        emailid: Joi.string().email({ minDomainAtoms: 2 }),
        percentage: Joi.number().integer().less(101),
    }).with('emailid', 'percentage');

    Studentdata.postName = (results, callback)=> {
        fs.createReadStream('./data.csv')
            .pipe(csv())
            .on('data', (data) => {
                getdetails(data, callback);
                //return data;
            });
    }

    async function getdetails(result, callback) {
        console.log("result----", result);
        var object = {
            'id': result.id,
            'fname': result.fname,
            'lname': result.lname,
            'emailid': result.emailid,
            'percentage': result.percentage
        }
        try {
            const res = await Joi.validate(object, schema);
            // if(err){
            //   //next(err,null);
            //  console.log(err.message);

            // }
            // else{
            const createRes = await Studentdata.create(object);
            console.log(createRes);
            // }
        } catch (error) {
            console.log(error);
        }
        // .then(res => {
        //         {
        //         console.log('response',res);
        //         callback(null, res);
        //        }
        //     }).catch(err => {
        //       callback(err,null);
        //    })
    }
    Studentdata.remoteMethod(
        'postName',
        {
            returns: { root: true, type: 'object' },
            accepts: [{
                arg: 'data',
                type: 'object',
                required: false,
                http: {
                    source: 'body'
                }
            }],
            http: { path: '/postName', verb: 'post' },
        }
    );

};