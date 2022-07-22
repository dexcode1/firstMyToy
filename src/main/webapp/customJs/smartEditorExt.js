
/* SmartEditor 공통 Script */
const smartEditorArr = [];
function se_loadSmartEditor(id, editMod) {
    function se_makeSmartEditor(ei, ableStatus, height){
        let sLang = "ko_KR";	// 언어 (ko_KR/ en_US/ ja_JP/ zh_CN/ zh_TW), default = ko_KR
        let ele = $("#" + ei);
        let editId = ele.attr('id');
        // 추가 글꼴 목록
        //let aAdditionalFontSet = [["MS UI Gothic", "MS UI Gothic"], ["Comic Sans MS", "Comic Sans MS"],["TEST","TEST"]];
        nhn.husky.EZCreator.createInIFrame({
            oAppRef: smartEditorArr,
            elPlaceHolder: editId,
            sSkinURI: "/assets/smartEditor/SmartEditor2Skin.html",
            htParams : {
                bUseToolbar : true,				// 툴바 사용 여부 (true:사용/ false:사용하지 않음)
                bUseVerticalResizer : true,		// 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
                bUseModeChanger : true,			// 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
                //bSkipXssFilter : true,		// client-side xss filter 무시 여부 (true:사용하지 않음 / 그외:사용)
                //aAdditionalFontList : aAdditionalFontSet,		// 추가 글꼴 목록
                fOnBeforeUnload : function(){

                },
                I18N_LOCALE : sLang
            }, //boolean
            fOnAppLoad : function(){
                //iframe 그려지는 방식이 비동기 방식이라 생성시점과 로직처리 시점이 달라서 적용 페이지에서 기능 추가가 어려움
                if(ableStatus==='OFF'){
                    smartEditorArr.getById[editId].exec("DISABLE_WYSIWYG");
                    smartEditorArr.getById[editId].exec("DISABLE_ALL_UI");
                }else {
                    smartEditorArr.getById[editId].exec("ENABLE_WYSIWYG");
                    smartEditorArr.getById[editId].exec("ENABLE_ALL_UI");
                }
                //값 초기화
                //smartEditorArr.getById[ei].exec("RESIZE_EDITING_AREA", [0, ele.parent().width()-(30 + 'px')]);
                smartEditorArr.getById[ei].exec("SET_IR", [""]);
                smartEditorArr.getById[ei].exec("UPDATE_CONTENTS_FIELD", []);
                smartEditorArr.getById[ei].exec("MSG_EDITING_AREA_RESIZE_STARTED", []);
                smartEditorArr.getById[ei].exec("RESIZE_EDITING_AREA", [0, height]);
                smartEditorArr.getById[ei].exec("MSG_EDITING_AREA_RESIZE_ENDED", []);
                smartEditorArr.getById[ei].exec("SE_FIT_IFRAME", []);
            },
            fCreator: "createSEditor2"
        });
    }

    function se_smartHeightCalc() {
        let others = 17;
        let buttonHeight;

        if(2363 < window.innerWidth){
            buttonHeight = 69;
        }else if(2175 < window.innerWidth && window.innerWidth < 2362){
            buttonHeight = 90;
        }else if(1442 < window.innerWidth && window.innerWidth < 2176){
            buttonHeight = 90;
        }else if(1412 < window.innerWidth && window.innerWidth < 1443){
            buttonHeight = 111;
        }else if(1070 < window.innerWidth && window.innerWidth < 1413){
            buttonHeight = 132;
        }else if(1067 < window.innerWidth && window.innerWidth < 1071){
            buttonHeight = 153;
        }else if(820 < window.innerWidth && window.innerWidth < 1068){
            buttonHeight = 174;
        }else {
            buttonHeight = 174;
        }
        buttonHeight += others;
        return buttonHeight;
    }

    function se_initEditorSize(id) {
        return new Promise(function(succ, fail) {
            try {
                let labelName = $("#editor-label");
                let editorLabelHeight = (labelName.length > 0) ?
                    labelName.outerHeight() : 0;

                let contentBody = $("#content-body");
                let searchArea = contentBody.children().find('.card').eq(0).height();
                let headArea = $("#head-body").height();
                let paddingArea = $("#" + id).parents().find(".card-body").css('padding-top');
                let total_extra = (paddingArea.substring(0, paddingArea.length-2)*4);
                let textHeight = $("#inputHeight").outerHeight() + editorLabelHeight;
                let buttonHeight = se_smartHeightCalc();
                let result = window.innerHeight-headArea-searchArea-total_extra-textHeight-buttonHeight;
                succ(result);
            }catch (e) {
                fail(e);
            }
        })
    }

    function se_smartInit(result, id) {
        return new Promise(function(succ1, fail1) {
            // disable된 상태로 height값을 설정하고 smartEditor 생성한다.
            if(result < 39){
                se_makeSmartEditor(id, "OFF", 39);
                succ1();
            }else {
                se_makeSmartEditor(id, "OFF", result);
                succ1();
            }
        })
    }

    function se_smartResizer(result, id) {
        return new Promise(function(succ2, fail2) {
            if(result < 39){
                smartEditorArr.getById[id].exec("MSG_EDITING_AREA_RESIZE_STARTED", []);
                smartEditorArr.getById[id].exec("RESIZE_EDITING_AREA", [0, 39]); //타입은 px단위의 Number
                smartEditorArr.getById[id].exec("MSG_EDITING_AREA_RESIZE_ENDED", []);
                smartEditorArr.getById[id].exec("SE_FIT_IFRAME", []);
                succ2();
            }else {
                smartEditorArr.getById[id].exec("MSG_EDITING_AREA_RESIZE_STARTED", []);
                smartEditorArr.getById[id].exec("RESIZE_EDITING_AREA", [0, result]); //타입은 px단위의 Number
                smartEditorArr.getById[id].exec("MSG_EDITING_AREA_RESIZE_ENDED", []);
                smartEditorArr.getById[id].exec("SE_FIT_IFRAME", []);
                succ2();
            }
        })
    }

    se_initEditorSize(id).then(function(cs){
        (editMod != null) ? se_smartResizer(cs, id) : se_smartInit(cs, id);
    });
}