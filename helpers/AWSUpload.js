const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

AWS.config.update({
    accessKeyId: 'ASIAV7CGGL24DHM43GEF',
    secretAccessKey: 'HISo+tS9yNn8bThFyryDGSMrb+GHWNisJn00MMCX',
    sessionToken: 'FwoGZXIvYXdzEBEaDDj7R88MPlo63uNTQiLKAUpUi0Rgvs9iPiUJs9fFpXl7e6/6wJIbYHQUAfi0pWyCnYOMT0m/tLJ3SEKSlRmSxdixzNX3an4NjKNhU6re+iH/GpyNKF2XdbaqnWv1cHvC3dMIvLg4XdcC2MpG9KUxi+yK0nfA0gGHvZF6178Ku4iQG8Ue0iEanqVbAlb+xGWS634P3stfC7M+sTSYN/AHbgF9d/8DmUxs1E78Wq3PVLIKUiPjqixUBSXBdcEIBVdkqzCk63FWJw1Z/EWMvFvUFe+p/CuOdl4tmiAo/M727QUyLeww4Nh7ua2o7aB7fGR3O2vD4K5GLMu61VhXpCbreo+e94kYhI77LyuoDMA6cw==',
    region: 'us-east-1',
    Bucket: 'onclick'
});

const s0 = new AWS.S3({});
const upload = multer({
    storage: multerS3({
        s3: s0,
        bucket: 'youmechat',
        acl: 'public-read',
        metadata: function(req, file, cb){
            cb(null, {fieldName: file.fieldname});
        },
        key: function(req, file, cb){
            cb(null, file.originalname);
        }
    }),

    rename: function (fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase();
    }
})

exports.Upload = upload;











