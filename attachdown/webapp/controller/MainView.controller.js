sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller , Filter , FilterOperator) {
    "use strict";

    return Controller.extend("attachdown.attachdown.controller.MainView", {
        onInit: function () {
            this.setAttachmentModel();
        },

        onDownloadSelectedButton: function (oEvent) {
           var oUploadSet = this.getView().byId("idAttach");
           let filename;
           let Guid;
           let ownercomponent;
           let actual_item;

            ownercomponent = this.getOwnerComponent();
			oUploadSet.getItems().forEach(function (oItem) {
             
				if (oItem.getListItem().getSelected()) {
                filename = null;
                filename = oItem.getFileName();
                actual_item = oItem;
                ownercomponent.getModel().read("/AttachmentSet", {
                filters: [new Filter ("Filename", FilterOperator.EQ, filename )],
                success: function (oData) {
                    var json = new sap.ui.model.json.JSONModel([]);
                    json.items = [];
        
                    for (var i = 0; i < oData.results.length; i++) {
                        var item = {
                            Guid: oData.results[i].Guid,
                            fileName: oData.results[i].Filename,
                            meddiaType: oData.results[i].Mimetype,
                            url: "/sap/opu/odata/sap/ZFILE_EX_SRV/AttachmentSet('" + oData.results[i].Guid + "')/$value",
                            uploadState: "Complete",
                            CreatedBy: oData.results[i].CreatedBy,
                            Erdat: oData.results[i].Erdat,
                            selected: false
                        };
                                                      
                        Guid = oData.results[i].Guid;
                        /* json.items.push(item); */

                        actual_item.setUrl("/sap/opu/odata/sap/ZFILE_EX_SRV/AttachmentSet('" + Guid + "')/$value");+
                        actual_item.download(true);   
                    }
                    console.log(oData.results);
  /*               this.getView().getModel("oModelAttach").setData(json);  */
                         }.bind(this),
        error: function (oError) {
            sap.m.MessageToast.show("Error occured reading data");
        }
    });  

        }
}); 
		},


        onDownloadSelectedButtonDB: function () {
            var oUploadSet = this.getView().byId("idAttach");
            let filename;
            let Guid;
            let ownercomponent;
            let actual_item;
 
             ownercomponent = this.getOwnerComponent();
             oUploadSet.getItems().forEach(function (oItem) {
              
                 if (oItem.getListItem().getSelected()) {
                 filename = null;
                 filename = oItem.getFileName();
                 actual_item = oItem;
                 ownercomponent.getModel().read("/AttachmentSet", {
                 filters: [new Filter ("Filename", FilterOperator.EQ, filename ) 
                 ],
                 success: function (oData) {
                     var json = new sap.ui.model.json.JSONModel([]);
                     json.items = [];
         
                     for (var i = 0; i < oData.results.length; i++) {
                         var item = {
                             Guid: oData.results[i].Guid,
                             fileName: oData.results[i].Filename,
                             meddiaType: oData.results[i].Mimetype,
                             url: "/sap/opu/odata/sap/ZFILE_EX_SRV/AttachmentSet('" + oData.results[i].Guid + "')/$value",
                          
                             uploadState: "Complete",
                             CreatedBy: oData.results[i].CreatedBy,
                             Erdat: oData.results[i].Erdat,
                             value: oData.results[i].value,
                             selected: false
                         };
                                                       
                         Guid = oData.results[i].Guid;
                         /* json.items.push(item); */
                         var slugVal = "X";
                             actual_item.removeAllStatuses();
                            actual_item.addHeaderField(new sap.ui.core.Item({
                            key: "slug",
                            text: slugVal
                        })); 

                        actual_item.addHeaderField(new sap.ui.core.Item({
                            key: "x-csrf-token",
                            text: ownercomponent.getModel().getSecurityToken()
                        }));

                        actual_item.addHeaderField(new sap.ui.core.Item({
                            "name": 'Dbdownload',
                            "value": 'X'
                        })); 

                     actual_item.setUrl("/sap/opu/odata/sap/ZFILE_EX_SRV/AttachmentSet('" + Guid + "')/$value"); 
                     actual_item.download(true);   
                     }
                     console.log(oData.results);
   /*               this.getView().getModel("oModelAttach").setData(json);  */
                          }.bind(this),
         error: function (oError) {
             sap.m.MessageToast.show("Error occured reading data");
         }
     });  
         }
 }); 
         },

        onBeforeUploadStarts: function (oEvent) {
            var oHeaderItem = oEvent.getParameter("item"),
            slugVal = oHeaderItem.getFileName() + ",1234,ZSD_SAMPLES";
        oHeaderItem.removeAllStatuses();
        oHeaderItem.addHeaderField(new sap.ui.core.Item({
            key: "slug",
            text: slugVal
        }));
        oHeaderItem.addHeaderField(new sap.ui.core.Item({
            key: "x-csrf-token",
            text: this.getOwnerComponent().getModel().getSecurityToken()
        }));
        },

        onUploadComplete: function (oEvent) {
            var oStatus = oEvent.getParameter("status"),
                oItem = oEvent.getParameter("item"),
                oUploadSet = this.getView().byId("idAttach");
            if (oStatus && oStatus !== 201) {
                oItem.setUploadState("Error");
                oItem.removeAllStatuses();
            } else {
/*                 oUploadSet.removeIncompleteItem(oItem); */
                this.setAttachmentModel();
            }
        },

        setAttachmentModel: function () {
            this.getOwnerComponent().getModel().read("/AttachmentSet", {
                filters: [new Filter ("RefGuid", FilterOperator.EQ, "1234")],
                success: function (oData) {
                    var json = new sap.ui.model.json.JSONModel([]);
                    json.items = [];
        
                    for (var i = 0; i < oData.results.length; i++) {
                        var item = {
                            Guid: oData.results[i].Guid,
                            fileName: oData.results[i].Filename,
                            meddiaType: oData.results[i].Mimetype,
                            url: "/sap/opu/odata/sap/ZFILE_EX_SRV/AttachmentSet('" + oData.results[i].Guid + "')/$value",
                            uploadState: "Complete",
                            CreatedBy: oData.results[i].CreatedBy,
                            Erdat: oData.results[i].Erdat,
                            selected: false,
                        };

                         json.items.push(item); 
                    }
                    console.log(oData.results);
                    json.setData(oData.results);
                    this.getView().setModel(json , "oModelAttach");
                    sap.ui.getCore().setModel(json);

  /*               this.getView().getModel("oModelAttach").setData(json);  */
                   
                         }.bind(this),

                error: function (oError) {
                    sap.m.MessageToast.show("Error occured reading data");
                }
            });
        }
    });
});
