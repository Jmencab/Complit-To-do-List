
Resolutions = new Mongo.Collection('resolutions');

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Router.configure({
    layoutTemplate: 'hdrftr'
});


//Manually setting roles:
//Google Id: "v7MfDYn2kKC2wA8wb"
//Facebook Id: "Xeiy27jRWocxSHRFv"

Roles.addUsersToRoles( 'v7MfDYn2kKC2wA8wb', 'admin' );
Roles.addUsersToRoles( 'Xeiy27jRWocxSHRFv', 'employee' );


Meteor.methods
({
	addResolution: function(title)
	{
		Resolutions.insert
		({
			title: title,
			createdAt: new Date(),
			owner: Meteor.userId()
		});
	},

	deleteResolution: function(id)
	{
		if(!(Roles.userIsInRole( Meteor.userId(), 'admin'))) 
		
		{
			throw new Meteor.Error('not authorized');
			 
		}
		
		
			Resolutions.remove(id);
		
		

	},
	updateResolution: function(id, checked)
	{
		if(!(Roles.userIsInRole( Meteor.userId(), 'admin')) && 
			!(Roles.userIsInRole( Meteor.userId(), 'employee'))) 
		{
			throw new Meteor.Error('not authorized');
			 
		}

		else
		{
			Resolutions.update(id, {$set: {checked: checked}});	
		}
	
	},
	setPrivate: function(id, private)
	{
		

		if(!(Roles.userIsInRole( Meteor.userId(), 'admin'))) 
		{
			throw new Meteor.Error('not authorized');
		}

		Resolutions.update(id, {$set: {private: private}});
	}
});

Meteor.publish("resolutions", function() 
{
	return Resolutions.find
	({
		$or:
		[
			{ private: {$ne: true}},
			{owner: this.userId}
		]
	});
});

//Register routing
Router.route('/', {
	name: 'home',
    template: 'home'
});
Router.route('/register');
Router.route('/login');
Router.route('/main');
Router.route('/UsefulInfo');
