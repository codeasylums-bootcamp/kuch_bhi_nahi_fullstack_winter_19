const mongoose = require('mongoose');

	let infoSchema = mongoose.Schema({
		nick: {
			type : String,
			required : true
		},
		password: {
			type : String,
			required : true
		},
		email: {
			type : String,
			required : true
		},
		description : {
			type : String,
			required : true 
		},
		target : {
			name : {
				type : String
			},
			address : {
				type : String
			},
			way : {
				type : String
			},
			latitude : {
				type : Number
			},
			longitude : {
				type : Number
			}
			
			
		},
		status : {
			type : String
		}
    });
    
    let Info = module.exports = mongoose.model('Info', infoSchema);