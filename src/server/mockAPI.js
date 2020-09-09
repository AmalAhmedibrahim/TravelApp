/// <reference path="common.js" />

var ATD_inspectionrequest;
(function (ATD_inspectionrequest) {
    atd_inspectionrequest = {
        Stages: {
            Request_Submission: "ec442d8e-cc61-4eb6-abd5-9efa1ca7350b",
            Inspection_Review: "e52c4d3b-b318-4ac9-bbc3-b72b215a0517",
            Inspection_NotNeeded: "b2cbc8fb-cfd9-4fb8-bfeb-ef0b79a191f0",
            Inspection_Execution_Auto: "93d1541a-02df-499b-98bf-bf7929cf75ed",
            Chief_Review_Auto: "f7c312e7-2272-43a7-a41b-55eee0c7a952",
            Pending_On_MainRequest: "4f675c1e-1830-40a0-a95b-288f309e00f7",
            Pending_On_Modification: "36c1afd8-1239-434e-b904-d99cd5db1c3a",
            Rejected_Manually: "284faa0e-f37f-47d9-9778-623e4dbd21f4",
            Inspection_Execution_Manually: "0a6b3a54-4d88-47cb-9f07-6f45eb2f7bff",
            Chief_Review_Manually: "0a08a5e9-1622-4a11-9a8d-6292ca653c77",
            Closed_Manually: "f71f154d-bcdf-4d3b-84e2-8299f308b1a0"
        },
        BPF_Fields: {
            RequestType: "ldv_requesttypecode",
            IsInspectionNeeded: "ldv_isinspectionneeded",
            CancellationReason: "ldv_cancellationreason",
            CancellationReason_1: "ldv_cancellationreason_1",
            InspectorDecision: "ldv_inspectordecisioncode",
            InspectorDecisionManually: "ldv_inspectordecisioncode_1",
            DefectRejectReason: "ldv_defectrejectreasoncode",
            DefectRejectReason_1: "ldv_defectrejectreasoncode_1",
            ChiefDecision: "ldv_chiefdecisioncode",
            ChiefComment: "ldv_chiefcomment",
            ChiefComment_1: "ldv_chiefcomment_1",
            IsInspectionDone: "ldv_isinspectiondone",
            IsInspectionDoneManually: "isinspectiondone_1",
            RejectionReason: "ldv_rejectionreason",
            RejectionReasonManually: "ldv_rejectionreason_1",
            statecode: "statecode",
            mainrequestdecision: "ldv_mainrequestdecisioncode",
            isUpdated: "ldv_isupdatedcode"
        },
        Fields: {
            InspectionReason: "ldv_inspectionreason",
            Company: "ldv_accountid",
            Branch: "ldv_branchid"
        },
        Enums: {
            InspectionDecision: {
                Approve: 1,
                Reject: 2,
                SendBack: 3
            },
            ChiefDecision: {
                Approve: 1,
                SendBack: 2
            },
            RequestType: {
                New_License: 1,
                Renew_License: 2,
                AdHoc: 3,
                Address_Modification: 4
            },
            ActivityInspectionDecision: {
                Approve: 1,
                Reject: 2,
                SendBack: 3
            }
        },
        Tabs: {
            IssuanceTab: "Issuance_Tab",
            LicenseRenewalTab: "License_Renewal_Tab",
            ActivitiesTab: "Activities_Tab",

        }
    };
    function OnFormLoad(executionContext) {
        debugger;
        var formContext = typeof executionContext != 'undefined' ? executionContext.getFormContext() : Xrm.Page; // get formContext 
        Common.SetBPFBackActionVisabilty("none");
        Common.SetBPFSetActiveActionVisabilty(true);
        Common.HideBPFProcessName();
        Common.CollapseBusinessProcess(formContext, true);
        var activeStage = Xrm.Page.data.process.getActiveStage().getId();
        ShowBPFBackButton(formContext, activeStage);
        Xrm.Page.data.process.addOnStageChange(function () {
            DisableBPFFields(formContext, activeStage);
        });
        (activeStage != atd_inspectionrequest.Stages.Request_Submission){
            EnableOrDisableGrid(Ldv_activitiessubgrid, 'none')
        }

        HookOn_BPF();
        HideBPFSetActive();
        SetTabVisibility(atd_inspectionrequest.Tabs.IssuanceTab, false);
        SetTabVisibility(atd_inspectionrequest.Tabs.LicenseRenewalTab, false);
        SetTabVisibility(atd_inspectionrequest.Tabs.ActivitiesTab, false);
        Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, false);
        Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason, true, false);
        //    Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, false);
        Common.SetControlVisibility(formContext, atd_inspectionrequest.Fields.InspectionReason, false, false);
        OnChangeInspectionNeeded(executionContext);
        OnChangeChefDecision(executionContext);
        OnChangeInspectorDecision(executionContext);
        OnChangeRequestType(executionContext);
        DisableBPFFields(formContext, activeStage);
        if (formContext.ui.getFormType() != 1) {
            SetMainDecision(executionContext);
        }
        else {
            formContext.getControl(atd_inspectionrequest.BPF_Fields.RequestType).
                removeOption(atd_inspectionrequest.Enums.RequestType.New_License);
            formContext.getControl(atd_inspectionrequest.BPF_Fields.RequestType).
                removeOption(atd_inspectionrequest.Enums.RequestType.Renew_License);
            //   formContext.getControl( `header_process_${atd_inspectionrequest.BPF_Fields.RequestType}`).
            //     removeOption(atd_inspectionrequest.Enums.RequestType.New_License);
            formContext.getControl(`header_process_${atd_inspectionrequest.BPF_Fields.RequestType}`).
                removeOption(atd_inspectionrequest.Enums.RequestType.Renew_License);
        }
    }
    ATD_inspectionrequest.OnFormLoad = OnFormLoad;
    function OnChangeInspectionNeeded(executionContext) {
        var formContext = typeof executionContext != 'undefined' ? executionContext.getFormContext() : Xrm.Page; // get formContext 
        var isInspectionNeeded = formContext.getAttribute(atd_inspectionrequest.BPF_Fields.IsInspectionNeeded).getValue();
        if (!isInspectionNeeded) {
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason, true, true);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.CancellationReason).getAttribute().setRequiredLevel("required");
        }
        else {
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.CancellationReason).getAttribute().setRequiredLevel("none");
        }
    }
    ATD_inspectionrequest.OnChangeInspectionNeeded = OnChangeInspectionNeeded;
    function OnChangeInspectorDecision(executionContext) {
        var formContext = typeof executionContext != 'undefined' ? executionContext.getFormContext() : Xrm.Page; // get formContext 
        var inspectorDecision = formContext.getAttribute(atd_inspectionrequest.BPF_Fields.InspectorDecision).getValue();
        var activeStage = Xrm.Page.data.process.getActiveStage().getId();
        if (inspectorDecision == atd_inspectionrequest.Enums.InspectionDecision.Reject) {
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, false);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason_1, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.RejectionReasonManually).getAttribute().setRequiredLevel("required");
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.RejectionReason).getAttribute().setRequiredLevel("required");
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.RejectionReason, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RejectionReason, true, false);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.RejectionReasonManually, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RejectionReasonManually, true, false);
        }
        else if (inspectorDecision == atd_inspectionrequest.Enums.InspectionDecision.SendBack) {
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason_1, true, true);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.DefectRejectReason).getAttribute().setRequiredLevel("required");
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.RejectionReason, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RejectionReason, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.RejectionReasonManually, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RejectionReasonManually, true, true);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.RejectionReasonManually).getAttribute().setRequiredLevel("none");
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.RejectionReason).getAttribute().setRequiredLevel("none");
        }
        else {
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, false);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason_1, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.DefectRejectReason).getAttribute().setRequiredLevel("none");
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.RejectionReason, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RejectionReason, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.RejectionReasonManually, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RejectionReasonManually, true, true);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.RejectionReasonManually).getAttribute().setRequiredLevel("none");
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.RejectionReason).getAttribute().setRequiredLevel("none");
        }
        ShowBPFBackButton(formContext, activeStage);
    }
    ATD_inspectionrequest.OnChangeInspectorDecision = OnChangeInspectorDecision;
    function OnChangeChefDecision(executionContext) {
        var formContext = typeof executionContext != 'undefined' ? executionContext.getFormContext() : Xrm.Page; // get formContext 
        var chiefDecision = formContext.getAttribute(atd_inspectionrequest.BPF_Fields.ChiefDecision).getValue();
        var activeStage = Xrm.Page.data.process.getActiveStage().getId();
        if (chiefDecision == atd_inspectionrequest.Enums.ChiefDecision.SendBack) {
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, false);
            // Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, true);
            // Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment_1, true, true);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.ChiefComment).getAttribute().setRequiredLevel("required");
        }
        else {
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, false);
            //   Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, false);
            //   Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment_1, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.ChiefComment).getAttribute().setRequiredLevel("none");
        }
        ShowBPFBackButton(formContext, activeStage);
    }
    ATD_inspectionrequest.OnChangeChefDecision = OnChangeChefDecision;
    function OnChangeRequestType(executionContext) {
        var formContext = typeof executionContext != 'undefined' ? executionContext.getFormContext() : Xrm.Page; // get formContext 
        var requestType = formContext.getAttribute(atd_inspectionrequest.BPF_Fields.RequestType).getValue();
        if (requestType == atd_inspectionrequest.Enums.RequestType.AdHoc ||
            requestType == atd_inspectionrequest.Enums.RequestType.Address_Modification) // Manually
        {
            Common.SetControlVisibility(formContext, atd_inspectionrequest.Fields.InspectionReason, false, true);
            formContext.getControl(atd_inspectionrequest.Fields.InspectionReason).getAttribute().setRequiredLevel("required");
            formContext.getControl("header_process_ldv_inspectordecisioncode_1").removeOption(3);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.Company, false, false); //
            SetTabVisibility(atd_inspectionrequest.Tabs.ActivitiesTab, true);
            SetTabVisibility(atd_inspectionrequest.Tabs.LicenseRenewalTab, false);
            SetTabVisibility(atd_inspectionrequest.Tabs.IssuanceTab, false);
        }
        else if (requestType == atd_inspectionrequest.Enums.RequestType.New_License) // issuence
        {
            Common.SetControlVisibility(formContext, atd_inspectionrequest.Fields.InspectionReason, false, false);
            formContext.getControl(atd_inspectionrequest.Fields.InspectionReason).getAttribute().setRequiredLevel("none");
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.Branch, false, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.Company, false, true); //
            SetTabVisibility(atd_inspectionrequest.Tabs.IssuanceTab, true);
            SetTabVisibility(atd_inspectionrequest.Tabs.LicenseRenewalTab, false);
            SetTabVisibility(atd_inspectionrequest.Tabs.ActivitiesTab, false);
        }
        else if (requestType == atd_inspectionrequest.Enums.RequestType.Renew_License) // Renew
        {
            Common.SetControlVisibility(formContext, atd_inspectionrequest.Fields.InspectionReason, false, false);
            formContext.getControl(atd_inspectionrequest.Fields.InspectionReason).getAttribute().setRequiredLevel("none");
            SetTabVisibility(atd_inspectionrequest.Tabs.IssuanceTab, false);
            SetTabVisibility(atd_inspectionrequest.Tabs.LicenseRenewalTab, true);
            SetTabVisibility(atd_inspectionrequest.Tabs.ActivitiesTab, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.Branch, false, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.Company, false, true); //
        }
    }
    ATD_inspectionrequest.OnChangeRequestType = OnChangeRequestType;
    function SetMainDecision(executionContext) {
        debugger;
        var rejectFlag = false;
        var approveFlag = false;
        var sendbackFlag = false;


        var formContext = typeof executionContext != 'undefined' ? executionContext.getFormContext() : Xrm.Page; // get formContext 
        var InspectionRequestId = Xrm.Page.data.entity.getId();
        if ((InspectionRequestId != null) && InspectionRequestId != undefined) {
            InspectionRequestId = RemoveGuidBrackets(InspectionRequestId);
            var result = Common.SyncWebApiRequest("/api/data/v9.0/msdyn_workorders?$select=ldv_activityinspectiondecisioncode&$filter=(ldv_activityinspectiondecisioncode eq 2 or ldv_activityinspectiondecisioncode eq 3 or ldv_activityinspectiondecisioncode eq 1) and _ldv_atdinspectionrequestid_value eq " + InspectionRequestId);
            if (result != undefined && result.value.length > 0) {
                var options = formContext.getControl("header_process_ldv_inspectordecisioncode_1").getOptions();
                for (var i = 0; i < result.value.length; i++) {
                    if (result.value[i].ldv_activityinspectiondecisioncode == atd_inspectionrequest.Enums.ActivityInspectionDecision.Reject) {

                        rejectFlag = true;

                    }
                    else if (result.value[i].ldv_activityinspectiondecisioncode == atd_inspectionrequest.Enums.ActivityInspectionDecision.SendBack) {
                        sendbackFlag = true;
                    }
                    else if (result.value[i].ldv_activityinspectiondecisioncode == atd_inspectionrequest.Enums.ActivityInspectionDecision.Approve) {
                        approveFlag = true;
                    }
                }
                if (rejectFlag == true && sendbackFlag == true) {

                    for (var i = 0; i < options.length; i++) {
                        if (options[i].value == atd_inspectionrequest.Enums.InspectionDecision.Approve) {
                            formContext.getControl("header_process_ldv_inspectordecisioncode_1").
                                removeOption(atd_inspectionrequest.Enums.InspectionDecision.Approve);
                            formContext.getControl("header_process_ldv_inspectordecisioncode").
                                removeOption(atd_inspectionrequest.Enums.InspectionDecision.Approve);
                        }
                    }
                }
                else if (rejectFlag == true && sendbackFlag == false) {

                    for (var i = 0; i < options.length; i++) {
                        if (options[i].value == atd_inspectionrequest.Enums.InspectionDecision.Approve) {
                            formContext.getControl("header_process_ldv_inspectordecisioncode_1").
                                removeOption(atd_inspectionrequest.Enums.InspectionDecision.Approve);
                            formContext.getControl("header_process_ldv_inspectordecisioncode").
                                removeOption(atd_inspectionrequest.Enums.InspectionDecision.Approve);
                        }
                        else if (options[i].value == atd_inspectionrequest.Enums.InspectionDecision.SendBack) {
                            formContext.getControl("header_process_ldv_inspectordecisioncode_1").
                                removeOption(atd_inspectionrequest.Enums.InspectionDecision.SendBack);
                            formContext.getControl("header_process_ldv_inspectordecisioncode").
                                removeOption(atd_inspectionrequest.Enums.InspectionDecision.SendBack);
                        }
                    }

                }
                else if (rejectFlag == false && sendbackFlag == true) {

                    for (var i = 0; i < options.length; i++) {
                        if (options[i].value == atd_inspectionrequest.Enums.InspectionDecision.Approve) {
                            formContext.getControl("header_process_ldv_inspectordecisioncode_1").
                                removeOption(atd_inspectionrequest.Enums.InspectionDecision.Approve);
                            formContext.getControl("header_process_ldv_inspectordecisioncode").
                                removeOption(atd_inspectionrequest.Enums.InspectionDecision.Approve);
                        }
                        else if (options[i].value == atd_inspectionrequest.Enums.InspectionDecision.Reject) {
                            formContext.getControl("header_process_ldv_inspectordecisioncode_1").
                                removeOption(atd_inspectionrequest.Enums.InspectionDecision.Reject);
                            formContext.getControl("header_process_ldv_inspectordecisioncode").
                                removeOption(atd_inspectionrequest.Enums.InspectionDecision.Reject);
                        }
                    }
                }
                else if (rejectFlag == false && sendbackFlag == false && approveFlag == true) { // approve
                    for (var i = 0; i < options.length; i++) {
                        if (options[i].value == atd_inspectionrequest.Enums.InspectionDecision.Reject) {
                            formContext.getControl("header_process_ldv_inspectordecisioncode_1").
                                removeOption(atd_inspectionrequest.Enums.InspectionDecision.Reject);
                            formContext.getControl("header_process_ldv_inspectordecisioncode").
                                removeOption(atd_inspectionrequest.Enums.InspectionDecision.Reject);
                        }
                        else if (options[i].value == atd_inspectionrequest.Enums.InspectionDecision.SendBack) {
                            formContext.getControl("header_process_ldv_inspectordecisioncode_1").
                                removeOption(atd_inspectionrequest.Enums.InspectionDecision.SendBack);
                            formContext.getControl("header_process_ldv_inspectordecisioncode").
                                removeOption(atd_inspectionrequest.Enums.InspectionDecision.SendBack);
                        }
                    }
                }
                OnChangeInspectorDecision(executionContext);
            }
        }
    }
    ATD_inspectionrequest.SetMainDecision = SetMainDecision;
    //--------------Private Functions ---------------
    function DisableBPFFields(formContext, activeStage) {
        debugger;
        ShowBPFBackButton(formContext, activeStage);

        if (activeStage == atd_inspectionrequest.Stages.Request_Submission) {
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.IsInspectionNeeded, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.statecode, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.ChiefDecision, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.InspectorDecision, true, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.InspectorDecisionManually, true, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.IsInspectionDone, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.IsInspectionDoneManually, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.RejectionReason, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RejectionReason, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.RejectionReasonManually, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RejectionReasonManually, true, true);
            // defect reason 
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.DefectRejectReason).getAttribute().setRequiredLevel("none");
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason_1, true, false);
            //chief Comment
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, true);
            //  Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.ChiefComment).getAttribute().setRequiredLevel("none");
            //   Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment_1, true, false);
            // cancel Reason 
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.CancellationReason).getAttribute().setRequiredLevel("none");
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason_1, true, false);
            //ShowBPFNextAction();
        }
        else if (activeStage == atd_inspectionrequest.Stages.Inspection_Review) {
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RequestType, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.IsInspectionNeeded, true, false); //
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.IsInspectionNeeded).getAttribute().setRequiredLevel("required");
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.statecode, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.Branch, false, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.Company, false, true); //
            //cancel Reason
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason, true, false);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.CancellationReason).getAttribute().setRequiredLevel("none");
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason_1, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.InspectorDecision, true, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.InspectorDecisionManually, true, true); //
            //defect reason
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.DefectRejectReason).getAttribute().setRequiredLevel("none");
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.ChiefDecision, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason_1, true, false);
            //cheif Comment
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, true);
            // Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.ChiefComment).getAttribute().setRequiredLevel("none");
            // Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment_1, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.IsInspectionDone, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.IsInspectionDoneManually, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.RejectionReason, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RejectionReason, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.RejectionReasonManually, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RejectionReasonManually, true, true);

            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.InspectionReason, false, true);

            //ShowBPFNextAction();
        }
        else if (activeStage == atd_inspectionrequest.Stages.Inspection_Execution_Auto ||
            activeStage == atd_inspectionrequest.Stages.Inspection_Execution_Manually) {
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RequestType, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.IsInspectionNeeded, true, true);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.IsInspectionNeeded).getAttribute().setRequiredLevel("none");
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.statecode, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.InspectorDecision, true, false); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.InspectorDecisionManually, true, false); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.Branch, false, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.Company, false, true); //
            //cancel Reason
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.CancellationReason).getAttribute().setRequiredLevel("none");
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason_1, true, false);
            // Defect reason 
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, false);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.DefectRejectReason).getAttribute().setRequiredLevel("none");
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.ChiefDecision, true, true);
            //Chief Comment
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, true);
            // Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.ChiefComment).getAttribute().setRequiredLevel("none");
            //  Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment_1, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.IsInspectionDone, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.IsInspectionDoneManually, true, false);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.RejectionReason, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RejectionReason, true, false);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.RejectionReasonManually, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RejectionReasonManually, true, false);
            //ShowBPFNextAction();
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.InspectionReason, false, true);

        }
        else if (activeStage == atd_inspectionrequest.Stages.Chief_Review_Auto
            || activeStage == atd_inspectionrequest.Stages.Chief_Review_Manually) {
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.InspectorDecision, true, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.InspectorDecisionManually, true, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RequestType, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.IsInspectionNeeded, true, true);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.IsInspectionNeeded).getAttribute().setRequiredLevel("none");
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.statecode, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.ChiefDecision, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.Branch, true, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.Company, true, true); //
            //defect Reason 
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.DefectRejectReason).getAttribute().setRequiredLevel("none");
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason_1, true, false);
            //Chief Comment
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, false);
            // Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.ChiefComment).getAttribute().setRequiredLevel("none");
            // Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment_1, true, false);
            // Cancellation Reason
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.CancellationReason).getAttribute().setRequiredLevel("none");
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason_1, true, false);
            //ShowBPFNextAction();
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.InspectionReason, false, true);

        }
        else if (activeStage == atd_inspectionrequest.Stages.Chief_Review_Auto) {
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.InspectorDecision, true, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.InspectorDecisionManually, true, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RequestType, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.IsInspectionNeeded, true, true);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.IsInspectionNeeded).getAttribute().setRequiredLevel("none");
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.Branch, false, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.Company, false, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.ChiefDecision, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.statecode, true, true);
            //defect Reason 
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.DefectRejectReason).getAttribute().setRequiredLevel("none");
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason_1, true, false);
            // chief comment
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, false);
            //  Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.ChiefComment).getAttribute().setRequiredLevel("none");
            // Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment_1, true, false);
            //cancel Reason
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.CancellationReason).getAttribute().setRequiredLevel("none");
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason_1, true, false);
            //ShowBPFNextAction();
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.InspectionReason, false, true);

        }
        else if (activeStage == atd_inspectionrequest.Stages.Pending_On_MainRequest ||
            activeStage == atd_inspectionrequest.Stages.Rejected_Manually ||
            activeStage == atd_inspectionrequest.Stages.Pending_On_Modification ||
            activeStage == atd_inspectionrequest.Stages.Closed_Manually) {
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.InspectorDecision, true, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.InspectorDecisionManually, true, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.RequestType, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.IsInspectionNeeded, true, true);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.IsInspectionNeeded).getAttribute().setRequiredLevel("none");
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.statecode, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.ChiefDecision, true, true);
            //defect Reason 
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.DefectRejectReason).getAttribute().setRequiredLevel("none");
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.DefectRejectReason_1, true, false);
            //chef comment 
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, true);
            //  Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.ChiefComment).getAttribute().setRequiredLevel("none");
            //  Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.ChiefComment_1, true, false);
            // cancel reason 
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason, true, true);
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason, true, false);
            formContext.getControl("header_process_" + atd_inspectionrequest.BPF_Fields.CancellationReason).getAttribute().setRequiredLevel("none");
            Common.SetControlVisibility(formContext, atd_inspectionrequest.BPF_Fields.CancellationReason_1, true, false);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.Branch, false, true); //
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.Company, false, true); //

            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.mainrequestdecision, true, true);
            Common.SetFieldDisabled(formContext, atd_inspectionrequest.BPF_Fields.isUpdated, true, true);

            Common.SetFieldDisabled(formContext, atd_inspectionrequest.Fields.InspectionReason, false, true);

        }
    }
    function ShowBPFBackButton(formContext, activeStage) {
        debugger;
        if (formContext != null) {
            var chiefDecision = formContext.getAttribute(atd_inspectionrequest.BPF_Fields.ChiefDecision).getValue();
            var inspectorDecision = formContext.getAttribute(atd_inspectionrequest.BPF_Fields.InspectorDecision).getValue();
            if (activeStage == atd_inspectionrequest.Stages.Chief_Review_Manually &&
                chiefDecision == atd_inspectionrequest.Enums.ChiefDecision.SendBack) {
                Common.SetBPFBackActionVisabilty("inline");
                HideBPFNextAction();
            }
            else if (activeStage == atd_inspectionrequest.Stages.Chief_Review_Auto &&
                chiefDecision == atd_inspectionrequest.Enums.ChiefDecision.SendBack) {
                Common.SetBPFBackActionVisabilty("inline");
                HideBPFNextAction();
            }
            else if (activeStage == atd_inspectionrequest.Stages.Pending_On_Modification) {
                Common.SetBPFBackActionVisabilty("none");
                HideBPFNextAction();
            }
            else if (activeStage == atd_inspectionrequest.Stages.Pending_On_MainRequest) {
                Common.SetBPFBackActionVisabilty("none");
                HideBPFNextAction();
            }
            else {
                Common.SetBPFBackActionVisabilty("none");
                ShowBPFNextAction();
            }
        }
    }

    function RefreshGrid(gridName) {
        setTimeout(
            function () {
                Xrm.Page.getControl(gridName).refresh();
            }
            , 20000); //20 seconds time
    }

    function EnableOrDisableGrid(gridName, disableFlag) {
        try {
            // updated to use 2016 function -- Sawalhy

            //Resolve Error $ is not defiend

            //  if (typeof ($) === 'undefined') {
            $ = parent.$;
            jQuery = parent.jQuery;
            //  }
            var currentSubgrid = Xrm.Page.getControl(gridName);
            if (currentSubgrid != null) {
                currentSubgrid.addOnLoad(function () {
                    $('#' + gridName + '_addImageButton').css('display', disableFlag ? 'none' : '');
                    $('#' + gridName + '_openAssociatedGridViewImageButton').css('display', disableFlag ? 'none' : '');

                    var hideDelete = function (delay) {
                        setTimeout(function () {
                            if ($('#' + gridName + '_divDataArea').find('#GridLoadingMessage').length <= 0) {
                                $('#' + gridName + '_gridBodyContainer .ms-crm-List-DeleteContainer')
                                    .css('display', disableFlag ? 'none' : '');
                            }
                            else {
                                hideDelete(500);
                            }
                        }, delay);
                    };
                    hideDelete(1000);
                });

                RefreshGrid(gridName);
            } /*else {
            setTimeout(function () { EnableOrDisableGrid(gridName, disableFlag); }, 500);
    
        }*/
        }
        catch (e) {

        }
    }


})(ATD_inspectionrequest || (ATD_inspectionrequest = {}));
//# sourceMappingURL=ATDInspectionRequest.js.map