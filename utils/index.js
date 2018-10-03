exports.getFullUrl = (req, fileName) => {
    return req.protocol + '://' + req.get('host') + '/public/images/' + fileName;
};

exports.getExtension = fileName => fileName.split('.').pop();