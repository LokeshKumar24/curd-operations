sap.ui.define([
        "sap/ui/core/mvc/Controller",
        	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/m/MessageBox"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller,JSONModel,ODataModel,MessageBox) {
		"use strict";

		return Controller.extend("ns.DEMOAPP.controller.View1", {
			onInit: function () {
                this.reLoad();
            },

            reLoad:function(){
                  var that = this;
              var  oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZLKBATCH_SRV/");
				oModel.read("/EMPLOYEESet", {
					success: function (oData, oResponse) {
                        var alldata={
			EMPLOYEESet:oData.results
		};
		
		            var Model= new JSONModel(alldata);
                        that.getOwnerComponent().setModel(Model,"odata");
					},
					error: function (oError) {

					}

				});
			
            },
    
            	oPopUp: null,
		popUp: function () {
			if (!this.oPopUp) {
				var oid = this.createId("empFrag");
				this.oPopUp = new sap.ui.xmlfragment(oid, "ns.DEMOAPP.view.employee", this);
				this.getView().addDependent(this.oPopUp);
			}
			this.oPopUp.open();
		},
		onClose: function () {
			this.oPopUp.close();
		},
		itemData: [],
		onSubmit: function () {
			var id = this.getView().getModel("empModel").getProperty("/id");
			var name = this.getView().getModel("empModel").getProperty("/empName");
			var designation = this.getView().getModel("empModel").getProperty("/empDesignation");
		
			var items = {
				Employeeid: id,
				Employeename: name,
				Employeedesignation:designation
			};
		
		if(this.update===null){
			this.onCreate(items);
		}
		else if(this.update==="update"){
			this.onUpdate(items);
			this.update=null;
		}
			 this.getView().getModel("empModel").setProperty("/id","");
			 this.getView().getModel("empModel").setProperty("/empName","");
			 this.getView().getModel("empModel").setProperty("/empDesignation","");
			this.onClose();
		},
		update:null,
		onEdit:function(oEvent){
             var empID = oEvent.getSource().sId;
    empID = empID[empID.length-1]
    empID = Number(empID) ;
    empID = this.getOwnerComponent().getModel("odata").getProperty("/EMPLOYEESet/" + empID)
    
				// var empID=	oEvent.getSource().getBindingContext().getObject().Employeeid;
			
		var payLoad={
		Id:empID.Employeeid,
		 Name:empID.Employeename,
		 Designation:empID.Employeedesignation
		};
			 this.getView().getModel("empModel").setProperty("/id",payLoad.Id);
			 this.getView().getModel("empModel").setProperty("/empName",payLoad.Name);
			 this.getView().getModel("empModel").setProperty("/empDesignation",payLoad.Designation);
			 this.update="update";
			 this.popUp();
		},
		onCreate:function(obj){
            // debugger;
		var empID=obj.Employeeid;
		var empName=obj.Employeename;
		var empDesignation=obj.Employeedesignation;
			if (empID === "" || empID=== undefined || empName=== "" || empName === undefined || empDesignation=== "" || empDesignation ===
				undefined) {
				MessageBox.error("Please enter mandatory details");
			} else {
                var that = this;
              var  oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZLKBATCH_SRV/");
				oModel.read("/EMPLOYEESet", {
					success: function (oData, oResponse) {
						var vFlag = false;
						var sParam = "";
						for (var i = 0; i < oData.results.length; i++) {
							if (oData.results[i].Employeeid === empID) {
								vFlag = true;
								sParam = "Id";
								break;

							}
						}
						if (vFlag) {
							MessageBox.error("Record with the same " + sParam + " already exists. Please select a unique value");
						} else {
							that.commonFunc(obj);
						}
					},
					error: function (oError) {
                   MessageBox.error("Not created.");
					}

				});
			}

		},
		onUpdate:function(payLoad){
        var empID=payLoad.Employeeid;
        var that= this;
        this.getOwnerComponent().setModel("empModel",payLoad);
         var  oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZLKBATCH_SRV/");
				oModel.update("/EMPLOYEESet('" + empID + "')", payLoad, {
				method: "PUT",
				success: function (odata, Response) {

					if (odata !== "" || odata !== undefined) {
                        MessageBox.success("Updated successfully.");
                        that.reLoad();
					} else {
						MessageBox.error("Not updated.");
					}

				},
				error: function () {
	MessageBox.error("Not updated.");
				}

			});
		},
		onDelete:function(oEvent){
            var that = this;
            // debugger;
    //	var empID=	oEvent.getSource().getBindingContext().getObject().Employeeid;
    var empID = oEvent.getSource().sId;
    empID = empID[empID.length-1]
    empID = Number(empID) ;
    empID = this.getOwnerComponent().getModel("odata").getProperty("/EMPLOYEESet/" + empID)
    empID = empID.Employeeid;
	// var  oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZLKBATCH_SRV/");
             //   oModel.
               this.getOwnerComponent().getModel().remove("/EMPLOYEESet('" + empID + "')", {
				method: "DELETE",
				success: function (odata, Response) {

					if (odata !== "" || odata !== undefined) {
                        MessageBox.success("Deleted successfully.");
                        that.reLoad();
					} else {
						MessageBox.error("Not able to delete.");
					}

				},
				error: function () {
                    MessageBox.error("Not able to delete.");
				}

			});
		},
		commonFunc: function (obj) {
// debugger
		
				var payLoad={
		Employeeid:obj.Employeeid,
		 Employeename:obj.Employeename,
		 Employeedesignation:obj.Employeedesignation
        };
        var that=this;
         var  oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZLKBATCH_SRV/");
				oModel.create("/EMPLOYEESet", payLoad, {
				success: function (odata, Response) {

					if (odata !== "" || odata !== undefined) {
                        MessageBox.success("Created successfully.");
                        that.reLoad();
					} else {
						MessageBox.error("New entry not created.");
					}
				},
				error: function () {
                    MessageBox.error("New entry not created.");
				}
			});
		}
		
		});
	});
