sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller , Filter , FilterOperator) {
    "use strict";

    return Controller.extend("usattachment.usattachment.controller.MainView", {
        onInit: function () {

            this.setAttachmentModel();
            
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
                            url: "/sap/opu/odata/sap/ZATTACHMENTS_SRV/AttachmentSet('" + oData.results[i].Guid + "')/$value",
                            uploadState: "Complete",
                            CreatedBy: oData.results[i].CreatedBy,
                            Erdat: oData.results[i].Erdat,
                            selected: false
                        };

                        /* json.items.push(item); */
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
