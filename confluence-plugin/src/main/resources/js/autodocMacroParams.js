(function ($) {
    var baseUrl = $("meta#confluence-base-url").attr("content");
    var bundleListUrl = baseUrl + "/rest/doc/1.0/configuration/bundles";
    var tokenCheckUrl = baseUrl + "/rest/doc/1.0/token/ask";
    var tokenGenerateUrl = baseUrl + "/rest/doc/1.0/token";
    var vm = {
        chosen: {
            bundle: null,
            macroOwner: null
        },
        macro: null
    };
    var bundles = null;
    var dialogInstance = null;

    var enableOrDisableSaveButton = function () {
        if ($("#doc_macroDialogOptions").find("input:checkbox:checked").length > 0 && vm.chosen.bundle != null) {
            $("#doc_macroDialogSaveButton").enable();
        } else {
            $("#doc_macroDialogSaveButton").disable();
        }
    };

    var checkCurrentUserHasToken = function () {
        return $.getJSON(tokenCheckUrl)
    };

    var save = function () {
        var macroName = "docMacro";

        var currentParams = $.extend({}, vm.chosen);
        currentParams.omniDoc = $("#doc_macroDialogOmniDocCheckbox").is(":checked");
        currentParams.classDiagram = $("#doc_macroDialogClassDiagramCheckbox").is(":checked");
        currentParams.structureGraph = $("#doc_macroDialogStructureGraphCheckbox").is(":checked");
        currentParams.markup = $("#doc_macroDialogMarkupCheckbox").is(":checked");
        tinymce.confluence.macrobrowser.macroBrowserComplete({
            "name": macroName,
            "bodyHtml": undefined,
            "params": currentParams
        });
        AJS.dialog2(getDialogInstance()).hide();
    };

    var getDialogInstance = function () {
        if (dialogInstance === null) {
            // region var html = ...;
            var html =
                '<section role="dialog" id="doc_macroDialog" class="aui-layer aui-dialog2 aui-dialog2-medium" aria-hidden="true">' +
                '   <header class="aui-dialog2-header">' +
                '       <h2 class="aui-dialog2-header-main">DoC macro parameters</h2>' +
                '       <a class="aui-dialog2-header-close">' +
                '           <span class="aui-icon aui-icon-small aui-iconfont-close-dialog">Close</span>' +
                '       </a>' +
                '   </header>' +
                '   <div class="aui-dialog2-content">' +
                '       <span class="aui-icon aui-icon-wait aui-icon-large" id="doc_macroDialogLoading">Loading...</span>' +
                '       <div id="doc_macroDialogError" style="text-align: center"  style="display:none">' +
                '           <div class="aui-message aui-message-error">' +
                '               <p class="title">' +
                '                   <strong>Unknown error occured</strong>' +
                '               </p>' +
                '               <p>Try refreshing the page.</p>' +
                '           </div>' +
                '       </div>' +
                '       <div id="doc_macro-login-form">' +
                '        <h2>Log in</h2>' +
                '        <div id="action-messages"></div>' +
                '        <form class="aui">' +
                '          <div class="field-group">' +
                '            <label for="doc_macro-login-email">Username</label>' +
                '             <input class="text" type="text" id="doc_macro-login-email" placeholder="username">' +
                '             <div class="description">Please type your username to Transformer</div>' +
                '          </div>' +
                '          <div class="field-group">' +
                '            <label for="doc_macro-login-password">Password</label>' +
                '             <input class="password" type="password" id="doc_macro-login-password" placeholder="password">' +
                '             <div class="description">Please type your password to Transformer</div>' +
                '             <div class="error" id="doc_macro-invalid-username">Invalid username and/or password</div>' +
                '           </div>' +
                '         </form>' +
                '         <div style="margin-left: 26%; margin-top:10px">' +
                '             <button class="aui-button aui-button-primary" id="doc_macro-login-submit">Log in</button>' +
                '         </div>' +
                '       </div>' +
                '       <div style="display: table; width: 100%" id="doc_macroDialogContent">' +
                '           <div style="display: table-row">' +
                '               <div id="doc_macroDialogSelectCntr" style="display: table-cell; width: 47%; padding-right: 3%; border-right: 1px solid #ccc"></div>' +
                '               <div id="doc_macroDialogOptions" style="display: table-cell; width: 46%; padding-left: 3%;">' +
                '                   <h3>Components</h3>' +
                '                   <form class="aui">' +
                '                       <div class="field-group"><label for="doc_macroDialogOmniDocCheckbox">OmniDoc</label><div class="checkbox"><input type="checkbox" id="doc_macroDialogOmniDocCheckbox"></div></div>' +
                '                       <div class="field-group"><label for="doc_macroDialogClassDiagramCheckbox">Class diagram</label><div class="checkbox"><input type="checkbox" id="doc_macroDialogClassDiagramCheckbox"></div></div>' +
                '                       <div class="field-group"><label for="doc_macroDialogStructureGraphCheckbox">Structure graph</label><div class="checkbox"><input type="checkbox" id="doc_macroDialogStructureGraphCheckbox"></div></div>' +
                '                       <div class="field-group"><label for="doc_macroDialogMarkupCheckbox">Markup</label><div class="checkbox"><input type="checkbox" id="doc_macroDialogMarkupCheckbox"></div></div>' +
                '                   </form>' +
                '               </div>' +
                '          </div>' +
                '       </div>' +
                '   </div>' +
                '   <footer class="aui-dialog2-footer">' +
                '       <div class="aui-dialog2-footer-actions">' +
                '           <button id="doc_macroDialogSaveButton" class="aui-button aui-button-primary" disabled>Save</button>' +
                '           <button id="doc_macroDialogCloseButton" class="aui-button aui-button-link">Close</button>' +
                '       </div>' +
                '   </footer>' +
                '</section>';
            // endregion
            dialogInstance = $(html).appendTo("body");

            dialogInstance.find("#doc_macroDialogCloseButton").click(function () {
                AJS.dialog2("#doc_macroDialog").hide();
            });

            dialogInstance.find("#doc_macroDialogSaveButton").click(function () {
                save();
            });

            dialogInstance.find("#doc_macroDialogOptions input:checkbox").change(function () {
                enableOrDisableSaveButton();
            });
        }
        return dialogInstance;
    };

    var load = function () {
        $("#doc_macroDialogLoading").fadeIn(0);
        $("#doc_macroDialogContent").fadeOut(0);
        $("#doc_macroDialogError").fadeOut(0);
        $("#doc_macro-login-form").fadeOut(0);

        var doTheRestOfTheWork = function () {
            $.ajax({
                dataType: "json",
                url: bundleListUrl,
                headers: {"X-Macro-Owner": vm.chosen.macroOwner}
            }).then(function (data) {
                console.log(data);
                vm.data = data;
                init();
            }, function () {
                $("#doc_macroDialogError").fadeIn(0);
                $("#doc_macroDialogLoading").fadeOut(0);
            });
        };

        checkCurrentUserHasToken().then(function (userHasToken) {
            if (userHasToken) {
                vm.chosen.macroOwner = (vm.macro.params && vm.macro.params.macroOwner) || AJS.params.remoteUserKey;
                doTheRestOfTheWork()
            } else {
                loginAndThen(function () {
                    vm.chosen.macroOwner = AJS.params.remoteUserKey;
                    doTheRestOfTheWork();
                });
            }
        }, /*else*/ function () {
            loginAndThen(function () {
                vm.chosen.macroOwner = AJS.params.remoteUserKey;
                doTheRestOfTheWork();
            });
        });

    };

    var loginAndThen = function (callback) {
        var loginForm = $("#doc_macro-login-form");
        loginForm.fadeIn(0);
        $("#doc_macroDialogLoading").fadeOut(0);

        var emailField = loginForm.find("#doc_macro-login-email");
        var passwordField = loginForm.find("#doc_macro-login-password");
        var invalidCredentialsMessage = loginForm.find("#doc_macro-invalid-username");
        var loginButton = loginForm.find("#doc_macro-login-submit");

        invalidCredentialsMessage.fadeOut(0);

        loginButton.click(function () {
            invalidCredentialsMessage.fadeOut(0);
            $.ajax({
                url: tokenGenerateUrl,
                contentType: "application/json",
                type: "PUT",
                data: JSON.stringify({username: emailField.val(), password: passwordField.val()}),
                processData: false
            }).then(function () {
                checkCurrentUserHasToken().then(function (userHasToken) {
                    if (userHasToken) {
                        loginForm.fadeOut(0);
                        callback();
                    } else {
                        invalidCredentialsMessage.fadeIn(0);
                    }
                }, function () {
                    invalidCredentialsMessage.fadeIn(0);
                })
            }, function () {
                invalidCredentialsMessage.fadeIn(0);
            });
        });
    };

    var init = function () {
        var cntr = $("#doc_macroDialogSelectCntr").empty().append('<h3>Bundle</h3>');
        bundles = $('<select style="width: 200px">' + vm.data.map(function (elem) {
                return "<option value='" + elem.id + "'>" + elem.name + "</option>"
            }).join("") + '</select>').appendTo(cntr);

        var bundleSelect = $(bundles);
        bundleSelect.auiSelect2();

        bundleSelect.change(function () {
            vm.chosen.bundle = bundleSelect.val();
        });

        bundleSelect.change();

        setParams();
        $("#doc_macroDialogLoading").fadeOut(0);
        $("#doc_macroDialogContent").fadeIn(0);
        enableOrDisableSaveButton();
    };

    var setParams = function () {
        if (vm.macro.params) {
            bundles.select2("val", vm.macro.params.bundle).change();

            // TODO refactor into a single array and couple foreach loops – for easier component addition in the future
            $("#doc_macroDialogOmniDocCheckbox").prop("checked", vm.macro.params.omniDoc === "true");
            $("#doc_macroDialogClassDiagramCheckbox").prop("checked", vm.macro.params.classDiagram === "true");
            $("#doc_macroDialogStructureDiagramCheckbox").prop("checked", vm.macro.params.structureGraph === "true");
            $("#doc_macroDialogMarkupCheckbox").prop("checked", vm.macro.params.markup === "true");
        } else {
            $("#doc_macroDialogOptions").find("input:checkbox").prop("checked", true);
        }
    };

    AJS.MacroBrowser.setMacroJsOverride("docMacro", {
        "opener": function (macro) {
            vm.macro = macro;
            AJS.dialog2(getDialogInstance()).show();
            load();
        }
    });
})(AJS.$);