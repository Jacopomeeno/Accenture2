sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/library"
], function (Controller, UIComponent, mobileLibrary) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return Controller.extend("project1.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		openDialog: function (dialogPath) {
            if (!this.__dialog) {
                this.__dialog = sap.ui.xmlfragment(dialogPath, this);
                this.getView().addDependent(this.__dialog);
            }
            return this.__dialog;
        },
        closeDialog: function() {
            if (this.__dialog) {
                if( this.__dialog.close ) {
                    this.__dialog.close();
                }
                this.__dialog.destroy();
                this.__dialog = null;
            }
        },

		handleValueHelp: function(oEvent){
            var oSource = oEvent.getSource(),
                oValue= oSource.getValue(),
				oSelectedItem = oEvent.getParameter("selectedItem"),
            	sField = oEvent.getSource().data("filterTableField"),
                sName = oSource.data("FieldName");
				
            var oDialog = this.openDialog("project1.fragment.Help."+sField).open();
        },

        _handleValueHelpSetValueClose : function (evt) {
            var that = this,
            oSelectedItem = evt.getParameter("selectedItem"),
            sField = evt.getSource().data("filterTableField"),
            Input = this.getView().byId(sField);
            if (oSelectedItem) {            
                var sValueTitle = oSelectedItem.getTitle();
                Input.setValue(sValueTitle);
                this.getOtherData(sValueTitle);
            }
            this.closeDialog();
        },

		_handleValueHelpValueClose : function (evt) {
            var that = this,
            oSelectedItem = evt.getParameter("selectedItem"),
            sField = evt.getSource().data("filterTableField"),
            Input = this.getView().byId(sField);
            if (oSelectedItem) {            
                var sValueTitle = oSelectedItem.getTitle();
                Input.setValue(sValueTitle);
                //this.getOtherData(sValueTitle);
            }
            this.closeDialog();
        },

		_handleValueHelpClose : function (evt) {
            var that = this,
            oSelectedItem = evt.getParameter("selectedItem"),
            sField = evt.getSource().data("filterTableField"),
            Input = this.getView().byId(sField);
            if (oSelectedItem) {            
                var sValueTitle = oSelectedItem.getTitle();
                Input.setValue(sValueTitle);
            }
            this.closeDialog();
        },

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */


		/**
		 * Adds a history entry in the FLP page history
		 * @public
		 * @param {object} oEntry An entry object to add to the hierachy array as expected from the ShellUIService.setHierarchy method
		 * @param {boolean} bReset If true resets the history before the new entry is added
		 */


	});

});