// Write your package code here!
var cloudinary = Cloudinary;

cloudinary.config({
	cloud_name:'datodq9yr',
	api_key: '195557755776848',
	api_secret: 'RP7EPikRQu7wdh_9Qtj7BmINtOU'
});

var intakeOptions = {
	width: 1280,
	height: 1280,
	crop: 'limit',
	effect: 'improve',
	detection: 'rekognition_face'
};

var uploadImage = function(imageUrl,cb) {
	cloudinary.uploader.upload(imageUrl,function(result) {
		cb(undefined,result);
	},intakeOptions);
};

var getTransformation = function(id,transformation) {
	return cloudinary.url(id,transformation);
};

Textuality.uploadImage = Meteor.wrapAsync(uploadImage);
Textuality.transformImage = getTransformation;

/*var uploadOptions = {
	detection:'rekognition_face'
};

var cloudinary = Npm.require('cloudinary');
cloudinary.configure({

});

var wrappedUpload = Meteor.wrapAsync(function(url,options,cb) {
	cloudinary.uploader.upload(url, function(result) {
		cb(result);
	},options);
});



Cloudinary.uploadImage = function(url,options) {
	var options = {
		detection:'rekognition_face'
	};
	var result = wrappedUpload(url);


};

Cloudinary.detectFace = function(url) {
	var result = wrapped
}*/