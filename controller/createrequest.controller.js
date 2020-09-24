sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(Controller, JSONModel, MessageBox) {
	"use strict";

	return Controller.extend("zovrtemprsrq.controller.createrequest", {

		onInit: function() {
			
		this.theTokenInput= this.getView().byId("empname");
		
		this.theTokenInput.setEnableMultiLineMode( sap.ui.Device.system.phone); 
		
		this.aKeys= ["Pernr", "Ename"];

			this._Oview = this.getView();

			var valdtmodel = new sap.ui.model.json.JSONModel();

			valdtmodel.setData({
				EmplyState: "None",
				date: "None",
				hours: "None",
				comments: "None"
			});

			this._Oview.setModel(valdtmodel, "vlstate");

			this._Oview.getModel("vlstate").setProperty("/EmplyState", "None");
			this._Oview.getModel("vlstate").setProperty("/date", "None");
			this._Oview.getModel("vlstate").setProperty("/hours", "None");
			this._Oview.getModel("vlstate").setProperty("/comments", "None");

		},
		onAfterRendering : function()
		{
		                       
			var that = this;
				that._Oview.byId("otrqtCreate").setBusy(true);
			
			var Omodel = this.getOwnerComponent().getModel();
			Omodel.read("/EmployeeListSet", {

				async: true,

				success: function(oData, response) {
					
					that.aItems = oData.results;
					
					 that._Oview.byId("otrqtCreate").setBusy(false);

				},
				error: function(oError) {

					
				}
			});

			
			
		},
		onValueHelpRequest : function() {
			
			var that= this;
			
			var oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
			basicSearchText: this.theTokenInput.getValue(), 
			title: "Employee Search",
			supportMultiselect: false,
			supportRanges: false,
			supportRangesOnly: false, 
			key: that .aKeys[0],				
			descriptionKey: this.aKeys[1],
			stretch: sap.ui.Device.system.phone, 

			ok: function(oControlEvent) {
				that.aTokens = oControlEvent.getParameter("tokens");
				that.theTokenInput.setTokens(that.aTokens);

				oValueHelpDialog.close();
			},

			cancel: function(oControlEvent) {
				
				oValueHelpDialog.close();
			},

			afterClose: function() {
				oValueHelpDialog.destroy();
			}
		});
		

		
		var oColModel = new sap.ui.model.json.JSONModel();
		oColModel.setData({
			cols: [
			      	{label: "Employee Id", template: "Pernr"},
			        {label: "Employee Name", template:"Ename"},
			        {label: "Organization", template: "Orgtx"},
			        {label: "Postion", template: "PositionTxt"}
			      ]
		});
			
			oValueHelpDialog.getTable().setModel(oColModel, "columns");
			
		var oRowsModel = new sap.ui.model.json.JSONModel();
		
		oRowsModel.setData(that.aItems);
		oValueHelpDialog.getTable().setModel(oRowsModel);
		if (oValueHelpDialog.getTable().bindRows) {
			oValueHelpDialog.getTable().bindRows("/"); 
		}
		if (oValueHelpDialog.getTable().bindItems) { 
			var oTable = oValueHelpDialog.getTable();
			
			oTable.bindAggregation("items", "/", function(sId, oContext) { 
				var aCols = oTable.getModel("columns").getData().cols;
			
				return new sap.m.ColumnListItem({
					cells: aCols.map(function (column) {
						var colname = column.template;
						return new sap.m.Label({ text: "{" + colname + "}" });
					})
				});
			});
		}
		
			oValueHelpDialog.setTokens(this.theTokenInput.getTokens());
		
		var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
			advancedMode:  true,
			filterBarExpanded: true,
			showGoOnFB: !sap.ui.Device.system.phone,
			filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "emplygp", groupName: "emplygn1", name: "n1", label: "Employee Id",control: new sap.m.Input()}),
			                   new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "emplygp", groupName: "emplygn1", name: "n2", label: "Employee Name", control: new sap.m.Input()}),
			                   new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "emplygp", groupName: "emplygn1", name: "n3", label: "Organization", control: new sap.m.Input()}),
			                   new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "emplygp", groupName: "emplygn1", name: "n4", label: "Postion", control: new sap.m.Input()})],
			search: function() {
				
				var empidfltr = "";
				var empnmfltr = "";
				var orgfltr = "";
				var posfltr = "";
				this.OrsAry = [];
				
				var binding = oValueHelpDialog.getTable().getBinding("rows");
				
				var empid = arguments[0].mParameters.selectionSet[0].getValue();
				var empname = arguments[0].mParameters.selectionSet[1].getValue();
				var orgnz =  arguments[0].mParameters.selectionSet[2].getValue();
				var pos  = arguments[0].mParameters.selectionSet[3].getValue();
				
				
					if(empid !== "")
				{
				 empidfltr = new sap.ui.model.Filter("Pernr",sap.ui.model.FilterOperator.Contains,empid);
                 this.OrsAry.push(empidfltr);
					
				}
				if(empname !== "")
				{
					
				empnmfltr =	 new sap.ui.model.Filter("Ename",sap.ui.model.FilterOperator.StartsWith,empname);
				this.OrsAry.push(empnmfltr);
					
				}
				if(orgnz !== "")
				{
					
				orgfltr =	 new sap.ui.model.Filter("Orgtx",sap.ui.model.FilterOperator.StartsWith,orgnz);
				this.OrsAry.push(orgfltr);
					
				}
				if(pos !== "")
				{
			     	posfltr =	 new sap.ui.model.Filter("PositionTxt",sap.ui.model.FilterOperator.StartsWith,pos);
			      	this.OrsAry.push(posfltr);
					
				}
				
				if (this.OrsAry.length !== 0) {

				var finalFilter = new sap.ui.model.Filter({
					filters: this.OrsAry,
					and: true
				});
				
				binding.filter(finalFilter);
				
				}
				else
				{
					
					binding.filter([]);
					
				}
			}
		});			
	/*			
		if (oFilterBar.setBasicSearch) {
			oFilterBar.setBasicSearch(new sap.m.SearchField({
				showSearchButton: sap.ui.Device.system.phone, 
				placeholder: "Search",
				search: function(event) {
					
					oValueHelpDialog.getFilterBar().search();
				} 
			}));  
		}*/
		
		oValueHelpDialog.setFilterBar(oFilterBar);
		
		if (this.theTokenInput.$().closest(".sapUiSizeCompact").length > 0) { // check if the Token field runs in Compact mode
		
			oValueHelpDialog.addStyleClass("sapUiSizeCompact");
		} else {
			
			oValueHelpDialog.addStyleClass("sapUiSizeCozy");			
		}
		
		oValueHelpDialog.open();
		oValueHelpDialog.update();
		
		
		
		
		
		},
		handlesave: function() {
			
			
			var oTokens = this.getView().byId("empname").getTokens();
			var empid = "";
			var _this = this;
			
			$.each(oTokens,function(Index,Token){
		
			 empid  = Token.getKey();
			
			
		  });
			
	         
			var date = this.getView().byId("myDate").getValue().trim();

			var hours = this.getView().byId("Hours").getValue().trim();

			var comments = this.getView().byId("inputcomments").getValue().trim();

			if (empid !== "") {

				this._Oview.getModel("vlstate").setProperty("/EmplyState", "None");

			} else {

				this._Oview.getModel("vlstate").setProperty("/EmplyState", "Error");
				this._Oview.getModel("vlstate").setProperty("/valueStateText1", "Employee Name  must be filled");

			}
			if (date !== "") {

				this._Oview.getModel("vlstate").setProperty("/date", "None");

			} else {

				this._Oview.getModel("vlstate").setProperty("/date", "Error");
				this._Oview.getModel("vlstate").setProperty("/valueStateText2", "Date must be filled");
			}

			if (hours !== "") {

				this._Oview.getModel("vlstate").setProperty("/hours", "None");

			} else {

				this._Oview.getModel("vlstate").setProperty("/hours", "Error");
				this._Oview.getModel("vlstate").setProperty("/valueStateText3", "Hours must be filled");
			}

			if (comments !== "") {

				this._Oview.getModel("vlstate").setProperty("/comments", "None");

			} else {

				this._Oview.getModel("vlstate").setProperty("/comments", "Error");
				this._Oview.getModel("vlstate").setProperty("/valueStateText4", "Comments must be filled");
			}

			var vldemp = this._Oview.getModel("vlstate").getProperty("/EmplyState");
			var vldate = this._Oview.getModel("vlstate").getProperty("/date");
			var vldhr = this._Oview.getModel("vlstate").getProperty("/hours");
			var vldcom = this._Oview.getModel("vlstate").getProperty("/comments");
			
			var params = {};

			if (vldemp === "None" && vldate === "None" && vldhr === "None" && vldcom === "None") {
				
				
				
				params.Impernr =  empid;
				params.Imhours = hours;
				params.Imreqdate = date;
				params.Imcomments= comments;
				var msgtype ="";
				var msgtitle = "";
				
			this.getView().getModel().create("/CreateOvertimeSet", params, {
					async: true,
					success: function(oData, response) {
						
						
						if(oData.Estatus === "Record Already Exist for the selected date")
						{
							msgtype = sap.m.MessageBox.Icon.WARNING;
							
							msgtitle = "WARNING";
						}
						else
						{
							msgtype = sap.m.MessageBox.Icon.SUCCESS;
							
							msgtitle = "SUCCESS";
							
						}
						MessageBox.show(
							oData.Estatus, {
								icon: msgtype,
								title: msgtitle,
								actions: [MessageBox.Action.OK],
								onClose: function(oAction) {

									if (MessageBox.Action.OK === oAction) {

										_this._clearelements();

									}

								}
							}
						);

					},
					error: function(oError) {

						MessageBox.show("Probelm occured during creation.", sap.m.MessageBox.Icon.ERROR, "ERROR");
					}
				});
				
				
				

			} else {


	            sap.m.MessageToast.show("Manditory field's must be filled");
				
			}

		},
		
		_clearelements : function()
		{
			this.getView().byId("empname").destroyTokens();

			 this.getView().byId("myDate").setValue("");

			 this.getView().byId("Hours").setValue("");
			 this.getView().byId("inputcomments").setValue("");
			 
			 this._Oview.getModel("vlstate").setProperty("/EmplyState", "None");
			 this._Oview.getModel("vlstate").setProperty("/date", "None");
			 this._Oview.getModel("vlstate").setProperty("/hours", "None");
			 this._Oview.getModel("vlstate").setProperty("/comments", "None");
			
		},
		handlereset : function()
		{
			 this._clearelements();
			
		}

	});
});