/**
 * @Author KYH
 * @Detail 클로저 함수를 셋팅하기 위한 별도 script
 * @lib commonExt.js
 * @prefix : cls_{your function name}
 * @Since 2022-07-07(KYH)
 * @Important : closure는 페이지 로딩 시 추가되어 페이지 내에 머무르는 동안 메모리 공간에 계속 상주한다
 *  - 너무 수가 늘어나지 않도록 세심히 관리한다
 *  - 불필요한 클로저 함수를 생성하지 않는다
 *  - 꼭 필요하지만, 대다수의 페이지에서 필요로 하는 기능이 아니라면 해당 페이지에 클로저함수를 생성한다
 */
/*===================전역함수 모음(클로저 포함)============================*/

/**
 * @Author KYH
 * @Detail 신규인지 수정인지 판단하기 위한 클로저 함수
 * @Param closure
 * @Since 2021-08-**(KYH)
**/
function cls_modifyFlag() {
    let update_env = 0;
    let original_key = "";
    let update_mod = "";

    function changeBy(val) { update_env = val + "";}
    function setKeyBy(val) { original_key = val + "";}
    function setMod(val) { update_mod = val + "";}
    return {
        update: function() { changeBy("update"); },
        insert: function() { changeBy("insert"); },
        remove: function() { changeBy("delete"); },
        setKey : function(originalKey) { setKeyBy(originalKey); },
        setMod : function(updateMod) { setMod(updateMod); },
        getKey : function() { return original_key; },
        getMod : function() { return update_mod; },
        value: function() { return update_env; },
        init : function() {
            changeBy(0);
            setKeyBy("");
            setMod("");
        }
    };
}

/**
 * @Author KYH
 * @Detail 변경된 내용 유무를 판단하기 위한 클로저 함수
 * @Param closure
 * @Since 2021-08-**(KYH)
 **/
function cls_valueChange() {
    let org_value = [];
    let change_value = [];
    let key_value = 0 + "";

    function changeBy(target, val) {
        switch(target) {
            case "org":
                org_value = val;
                break;
            case "new":
                change_value = val;
                break;
            case "key":
                key_value = val;
                break;
            case "init":
                org_value = val;
                change_value = val;
                key_value = val;
                break;
        }
    }

    function chkChangedCnt(orgData, changeData){
        if(orgData == null || changeData == null){
            console.log("정상적인 접근이 아닙니다");
            return false;
        }
        let key1 = Object.keys(orgData)
        let keyname = '';
        for(let i=0; i<key1.length; i++){
            keyname = key1[i];

            if(changeData[keyname] != null && changeData[keyname] != undefined){
                let emptySpace = "";
                if(cmm_jqHasClass($("#"+keyname), 'smartedit')) {
                    emptySpace = '<p><br></p>';
                }

                if(orgData[keyname]+emptySpace != changeData[keyname]){
                    return true;
                }else {
                    continue;
                }
            }
        }
        return false;
    }
    return {
        checkChanged : function() { return chkChangedCnt(org_value, change_value);},
        saveOldData: function(data) { changeBy("org", data);},
        saveNewData: function(data) { changeBy("new", data);},
        saveKey: function(data) { changeBy("key", data);},
        init : function() { changeBy("init", 0);},
        value: function(target) {
            if(target == "oldData"){
                return org_value;
            }else if(target == "newData"){
                return change_value;
            }else if(target == "key"){
                return key_value;
            }else {
                return "잘못된 접근 입니다.";
            }
        }
    };
}

/**
 * @Author KYH
 * @Detail 상태변수 저장을 위한 클로저함수
 * @Param closure
 * @Since 2021-08-**(KYH)
 **/
function cls_checkChangeStatus() {
    let isChange = false;
    let isAdd = false;
    let isOrded = false;
    let isUp = "";
    function changeBy(target, val) {
        switch(target) {
            case "Change":
                isChange = val;
                break;
            case "Add":
                isAdd = val;
                break;
            case "Orded":
                isOrded = val;
                break;
            case "Up":
                isUp = val;
                break;
        }
    }
    return {
        isChange: function(val) {changeBy("Change", val);},
        isAdd: function(val) {changeBy("Add", val);},
        isOrded: function(val) {changeBy("Orded", val);},
        isUp: function(val) {changeBy("Up", val);},
        value: function(target) {
            if(target == "isChange"){
                return isChange;
            }else if(target == "isAdd"){
                return isAdd;
            }else if(target == "isOrded"){
                return isOrded;
            }else if(target == "isUp"){
                return isUp;
            }else {
                return "잘못된 접근 입니다.";
            }
        }
    };
}

/*=================== 전역함수 모음 끝 =============================*/


/*=================== 각종 제어 함수 모음 ==========================*/


/* 2022-04-14 최신화 _ KYH */
function cmm_accessPage(pageId) {
    $.ajax({
        url : pageId,
        method : "GET",
        data : "",
        async:"true",
        success: function() {
            location.href = pageId;
        },
        error : function(error) {
            //서버에서 setStatus(~~)하여 임의의 값을 넣어도 19475 위로는 찍지 못함(Ajax의 최대값인듯)
            if(error.status === 19474)
                cmm_swalFire("해당 페이지에 접근할 권한이 없습니다<br>관리자에게 문의 바랍니다.");

        }
    })
}

// jQuery import 바로아래에 넣어 주면 됩니다.
// Cannot read property 'msie' of undefined 에러 나올때
jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();

//전역변수
$(document).ready(function() {
    //number 타입 input요소 max나 min값 설정해주기
    $('input[type="number"]').on('keyup',function(){
        v = parseInt($(this).val());
        min = parseInt($(this).attr('min'));
        max = parseInt($(this).attr('max'));

        if (v > max){
            $(this).val(max);
        }
    })


    //페이지에서 호출하는 모든 Ajax함수가 거쳐가는 함수
    //ajax함수 실행 후 response 403이 리턴될 경우에 세션 만료 alert를 발생시킴
    $.ajaxSetup({
        /* beforeSend : function(xhr, opts) {
            console.log("이것도?");
        }, */
        complete : function(xhr,status){
            if(xhr.status === 403){
                Swal.fire({
                    type: "error",
                    title: "세션이 만료되었습니다.\n로그인 페이지로 이동합니다.",
                    showConfirmButton: true,
                    onAfterClose : function () {
                        location.href="/login";
                    }
                })
                setTimeout(function(){location.href = "/login"}, 2000);
            }
        }
    });
});
/*=================== 각종 제어 함수 모음 끝==========================*/
