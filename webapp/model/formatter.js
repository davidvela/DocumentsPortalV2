sap.ui.define([
	] , function () {
		"use strict";

		return {
			toInt : function(value){
					return parseInt( value );	
			},
			
			toBoolean : function(value){
				if(value === undefined) return true; 
				
				var sValue;
				if(typeof value === 'boolean')	sValue = value.toString();
				if(typeof value === 'string')	sValue = value;

				if (sValue === 'true') return true;
				else return false;	
			},
			toBooleanF : function(value){
				if(value === undefined) return false; 
				
				var sValue;
				if(typeof value === 'boolean')	sValue = value.toString();
				if(typeof value === 'string')	sValue = value;

				if (sValue === 'true') return true;
				else return false;	
			},
			/**
			 * Rounds the number unit value to 2 digits
			 * @public
			 * @param {string} sValue the number string to be rounded
			 * @returns {string} sValue with 2 digits rounded
			 */
			numberUnit : function (sValue) {
				if (!sValue) {
					return "";
				}
				return parseFloat(sValue).toFixed(2);
			}

		};

	}
);