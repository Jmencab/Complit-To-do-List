Resolutions = new Mongo.Collection('resolutions');

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';
import './resolutions.html'

Router.configure({
    layoutTemplate: 'hdrftr'
});

Roles.addUsersToRoles( 'v7MfDYn2kKC2wA8wb', 'admin' );
Roles.addUsersToRoles( 'Xeiy27jRWocxSHRFv', 'employee' );

Meteor.subscribe("resolutions");

Template.main.helpers
({
	resolutions: function()
	{
		if (Session.get('hideFinished'))
		{
			return Resolutions.find({checked: { $ne: true}});
		} 
		else 
		{
			return Resolutions.find();	
		} 
	},
	hideFinished: function()
	{
		return Session.get('hideFinished');
	} 

});

Template.main.events
({
	'submit .new-resolution': function(event)
	{
		var title = event.target.title.value;

		Meteor.call("addResolution", title);

		event.target.title.value = "";

		return false;
	},
	'change .hide-finished': function(event)
	{
		Session.set('hideFinished', event.target.checked)
	}
});



Accounts.ui.config
({
	passwordSignupFields: "USERNAME_ONLY"
});

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


//Register routing
Router.route('/', {
	name: 'home',
    template: 'home'
});
Router.route('/main');
Router.route('/UsefulInfo');

//Dropdown menu for Useful Info
//
// if the ESC key is pressed or a mouse is clicked anywhere, close any open dropdowns
//

$(document).keyup(function(evt) {
    if (evt.keyCode === 27) {
        Session.set('dropdown', null);
    }
});

 Template.UsefulInfo.events({

    'click': function() {
        Session.set('dropdown', null);
    }
});


Template.dropdown.helpers({

    "templateName": function() {
        return 'dropdown_' + this.name;
    },

    "templateData": function() {
        // add an 'open' property to the template for the child to tell if it is open
        // _.extend(dest, src) copies all the properties in src to dest and returns dest
        return _.extend({open: Session.equals('dropdown', this.name)}, this);
    }

});

Template.dropdown.events({

    'click button': function(evt) {
    	if(!(Roles.userIsInRole( Meteor.userId(), 'admin')) && 
			!(Roles.userIsInRole( Meteor.userId(), 'employee'))) 
		{
			throw new Meteor.Error('not authorized');
			 
		}
		else {
        evt.preventDefault();
        evt.stopPropagation();  // stops the full-page click handler above from firing
        Session.set('dropdown', this.name);
    	}
    },

    'click .dropdown-menu li a': function(evt) {
        evt.preventDefault();
        Session.set('dropdown', null);
    }

});