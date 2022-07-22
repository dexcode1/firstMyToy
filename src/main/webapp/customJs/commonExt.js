/*===================더이상 쓰이지 않는 공통함수 모음 ==============================*/
function fn_accessPage(pageId) {
    cmm_accessPage(pageId);
}

/*===================더이상 쓰이지 않는 공통함수 모음 끝============================*/



/*===================화면 제어 함수 모음============================*/

/**
 * 설명 : breadcrumb 상위분류 클릭 시 sidebar 펼쳐지도록 하는 스크립트
 * 작성자 : KYH
 * 작성일 : 2021-08-05
 */
$("#pre_menu_area").click(function(e){
    let pre_menuId = e.currentTarget.getAttribute("aria-label");
    $("#sidenav-collapse-main").children().find("[aria-label="+ pre_menuId +"]").trigger("click");
});
/*===================화면 제어 함수 모음 끝============================*/



/*=================== Sweet Alert 관련 함수 ==========================*/

/**
 * 함수명: swal.fire(success / error)
 * 함수설명: swal.fire alert 발생
 * 파라메타 : alert 메세지, 필요한 함수 있을 시 추가[없어도 무방함](msg, icon) - icon : error or success
 * 작성자 : KYH
 * 작성일 : 2021-08-13
 * 수정일 : 2021-11-12
 * 수정자 : KYH
 * 수정내용 : 모든 swalFire공통함수를 하나로 줄이고 파라메터로 아이콘 변경
 * - default : error
 * - forcus() 나 AfterClose 값은 호출페이지에서 처리할수 있도록 swal구문자체를 return(.then등으로 받을 수 있음)
 */
function cmm_swalFire(msg, icon) {
    if(typeof icon == 'function'){
        return Swal.fire({
            type: "error",
            title: msg,
            showConfirmButton: true
        }).then(function() {
            icon();
        })
    }

    let defaultIcon;
    if(icon == null){
        defaultIcon = "error";
    }else {
        defaultIcon = icon;
    }
    return Swal.fire({
        type: defaultIcon,
        title: msg,
        showConfirmButton: true
    })
}

//기존 confirmModal 대체하는 함수. Swal.fire 옵션 사용
//사용법 : 해당 함수 호출구문 뒤에 .then(function(result){여기서 파라메터 함수 처리됨});
//처리부분에서 confirm버튼을 눌렀는지 취소를 눌렀는지 확인법 : result.value가 true일때 : confirm(확인)을 누름
//간단설명 : 기존 confirmModal호출 함수구문에서 함수호출부(confirmModal(...))를 cmm_swalConfFire(...)으로 바꿔주면 됨
//아래의 설명은 .then()으로 받았을 때 유효하다
//Swal.fire에서 then구문으로 받아온 result를 value로 찍을 경우
//true or false가 찍힌다(확인 안누르고 Alert 바깥 클릭 시 undefined);
//ex) result.value != false
function cmm_swalConfFire(msg, detail, callback) {
    if(callback == null) {
        return new Promise(function(succ, fail) {
            Swal.fire({
                type: "warning",
                title: msg,
                html: detail,
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: '확인'
            }).then(function(result) {
                if(result.value) {
                    succ(result);
                }else {
                    fail("cancled");
                }
            })
        })
    }else {
        return Swal.fire({
            type: "warning",
            title: msg,
            text: detail,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '확인'
        }).then(function(result) {
            if(result.value) {
                callback(true);
                return;
            }else {
                callback(false);
                return;
            }
        })
    }
}

//지정한 시간동안 로딩 아이콘이 표시되는 Swal.fire 모달
//Swal.getTitle().innerText = ~~~ 식으로 도중에 내용 바꿀 수 있음
//Swal.getContent().children[0].innerText = ~~~ 식으로 도중에 내용 바꿀 수 있음
//Swal.hideLoading(); 구문으로 loading아이콘 멈출 수 있음
//이름규칙통일
function cmm_swalLoadFire(msg, content) {
    let prefix_H2 = "<div class='loadingH2'>";
    let prefix_sub = "<div class='loadingSub'>";

    let fullMsg = prefix_H2 + msg + "</div>";
    let fullSub = prefix_sub + content + "</div>";

    let htmlText = "";
    if(content != null)
        htmlText = content;

    return new Promise(function(succ, fail) {
        Swal.fire({
            type:"info",
            title: fullMsg,
            width: 400,
            html : fullSub,
            allowOutsideClick: false,
            onBeforeOpen: function() {
                Swal.showLoading()
            },
        })

        succ("succeed");
    })
}

//custom swalFire
function cmm_customSwalFire(pageOption, pageFunc) {
    // 공통으로 실행할 부분은 여기에 추가한다.
    // swal.fire 옵션만 가능하다
    let commonOption = {

    }
    let fullOption = Object.assign(pageOption, commonOption);
    return Swal.fire(fullOption)
}

/*=================== Sweet Alert 관련 함수 끝=========================*/

/*================== Data Parsing 관련 함수 =====================*/
/**
 * 함수명: DataPacking(JSON / FORM)
 * 함수설명 : 전달받은 객체 내부 input객체들 데이터를 수집하여 return 하는 함수
 * 파라메타 : div 객체 / 예외처리할 객체(ex. $("#id")) - 제외된 객체는 return data에 포함되지 않음
 * 작성자 : KYH
 * 작성일 : 2021-08-09
 */
/* JSONData Parsing 함수*/
function cmm_inputJSONDataPacking(ele, except){
    let data = {}; //JSONDataPacking이므로 객체 준비
    let search_ele = ele.find('.inputEle');
    if(except != null){
        let exception = except.join();
        search_ele = search_ele.not(exception);
    }

    search_ele.each(function(index){
        let keyname = "";
        if(this.name != undefined && this.name.length > 0){
            keyname = this.name;
        }else {
            keyname = this.id;
        }
        let valueParsing = "";

        if(cmm_hasClass(this, 'dateInput')){
            valueParsing = this.value.replaceAll("-","");
        }else if(cmm_hasClass(this, 'smartedit')){
            smartEditorArr.getById[keyname].exec("UPDATE_CONTENTS_FIELD", []);
            valueParsing = this.value;
        }else if(cmm_hasClass(this, 'radioBtn')){
            valueParsing = $(":input:radio[name='" + keyname + "']:checked").val();
            if(valueParsing == undefined)
                valueParsing = "";
        }else {
            valueParsing = this.value;
        }
        data[keyname] = valueParsing.trim();
    });
    return data;
}

/* FormData Parsing 함수*/
function cmm_inputFormDataPacking(ele, except){
    let form = document.createElement("form");
    let formData = new FormData(form);
    let search_ele = ele.find('.inputEle');
    if(except != null){
        exception = except.join();
        search_ele = search_ele.not(exception);
    }

    search_ele.each(function(){
        //search 에서 쓰는 id값의 경우는 객체의 변수 이름과 다른 경우가 있어서 name으로 맞춘다.
        let keyname = this.name.length > 0 ? this.name + '' : this.id + '';
        let valueParsing = this.value;

        if(cmm_hasClass(this, 'dateInput')){
            formData.append(keyname, this.value.trim().replaceAll("-",""));
        }else if(this.type == "file"){
            formData.append("file", this.files[0]);
        }else if(cmm_hasClass(this, 'smartedit')){
            smartEditorArr.getById[keyname].exec("UPDATE_CONTENTS_FIELD", []);
            formData.append(keyname, this.value);
        }else{
            formData.append(keyname, this.value.trim());
        }
    });

    return formData;
}
/*================== Data Parsing 관련 함수 끝=====================*/

/*================ Form 혹은 Element 상태 관련 함수 ==================*/
/**
 * 함수명: Grid Click Event 2nd(insert value)
 * 파라메타 : inputForm객체, Grid Row 데이터
 * 작성자 : KYH
 * 작성일 : 2021-07-22
 * 수정자 : KYH
 * 수정내용 : 하나에 화면에 같은 데이터를 받아야될 서로 다른 id의 input element가 있을 수 있음
 *         teminateId로 해당 element id에서 전달된 특정문구를 제거하여 input 하도록 하는 공통함수로 변경
 * 수정일 : 2021-08-11
 * 수정자 : KYH
 * 수정내용 : teminatedId 제거 후 except 배열 추가
 *        데이터 수정 시 search영역을 변경하거나 할 수 있음 해당 상황에서 일어날 오류 사전 차단
 * 수정일 : 2021-09-02
 * 수정자 : KYH
 * 수정내용 : cmm_valueInsert와 valueInsertBack 함수로 나눔(리턴값 유무)
 *         리소스 관리 차원
 * 수정일 : 2021-09-29
 * 수정자 : KYH
 * 수정내용 : target항목이 null값이라 undefined 발생할 경우 빈값("")으로 대체
 * 수정일 : 2021-11-04
 */
function cmm_valueInsert(ele, row, except){
    let insertArray = new Object;
    let search_ele = ele.find('.inputEle');
    if(ele == null || row == null)
        console.log("required not supposed");

    if(except != null){
        let exception = except.join();
        search_ele = search_ele.not(exception);
    }

    search_ele.each(function(){
        let target_nm = this.name.length > 0 ? this.name + '' : this.id + '';
        if(row[target_nm] == null || row[target_nm] == 'undefined')
            row[target_nm] = "";

        if(cmm_hasClass(this, 'dateInput')){
            let value = row[target_nm];
            insertArray[target_nm] = value;

            if(value != "" && value != null) {
                if(value.includes("-")){
                    $(this).datepicker().
                    datepicker('setDate', value);
                }else {
                    $(this).datepicker().
                    datepicker('setDate',
                        value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6,8));
                }
            }else {
                $(this).datepicker().datepicker('setDate', "");
            }
        }else if(this.type == "file"){
            $(this).val(row[target_nm]);
            insertArray[target_nm] = row[target_nm];
        }else if(cmm_hasClass(this, 'smartedit')){
            smartEditorArr.getById[target_nm].exec("SET_IR", [""]); //초기화
            smartEditorArr.getById[target_nm].exec("PASTE_HTML", [row[target_nm]]);
            insertArray[target_nm] = row[this.id];
        }else {
            this.value = row[target_nm];
            insertArray[target_nm] = row[target_nm];
        }
    });
}

function cmm_valueInsertBack(ele, row, except){
    let insertArray = {};
    let search_ele = ele.find('.inputEle');
    if(except != null){
        let exception = except.join();
        search_ele = search_ele.not(exception);
    }

    search_ele.each(function(){
        let target_nm = this.name.length > 0 ? this.name + '' : this.id + '';
        if(row[target_nm] == null || row[target_nm] == 'undefined')
            row[target_nm] = "";

        if(cmm_hasClass(this, 'dateInput')){
            let value = row[target_nm];
            insertArray[target_nm] = value;

            if(value != "" && value != null) {
                if(value.includes("-")){
                    $(this).datepicker().
                    datepicker('setDate', value);
                }else {
                    $(this).datepicker().
                    datepicker('setDate',
                        value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6,8));
                }
            }else {
                $(this).datepicker().datepicker('setDate', "");
            }
        }else if(this.type == "file"){
            $(this).val(row[target_nm]);
            insertArray[target_nm] = row[target_nm];
        }else if(cmm_hasClass(this, 'smartedit')){
            smartEditorArr.getById[target_nm].exec("SET_IR", [""]); //초기화
            smartEditorArr.getById[target_nm].exec("PASTE_HTML", [row[target_nm]]);
            let unLessStr = row[this.id].lastIndexOf("</p>");
            let opticalStr = row[this.id].substring(0, unLessStr);

            insertArray[target_nm] = opticalStr;
        }else {
            this.value = row[target_nm];
            insertArray[target_nm] = row[target_nm];
        }
    });
    return insertArray;
}

/**
 * 함수명: sensoringChange(변경사항감지)
 * 함수설명 : input요소 변경사항 감지
 * 파라메타 : form영역 객체
 * 작성자 : KYH
 * 작성일 : 2021-08-09
 * 수정자 : KYH
 * 수정내용 : 함수이름변경(cmm_changeInsertBack) : valueInsertBack과 세트로 움직이므로 통일
 * 함수필요 : 변경된 데이터 저장 필요할 경우(순서변경 등)
 * 수정일 : 2021-09-29
 */
function cmm_changeInsertBack(ele){
    let inputArr = new Array();
    ele.find('.inputEle').each(function(index, elem){
        inputArr[index] = $(elem).val();
        $(this).on('change', function(){
            inputArr[index] = $(elem).val();
        });
    });
    return inputArr;
}

//두 객체(arr)를 받아 차이점이 있는지 비교하는 함수, 차이점만큼 count를 반납(diffCount가 0 이면 동일한 데이터라는 뜻)
function cmm_compareRequired(orgArr, changeArr){
    let diffCount = 0;
    for(let i=0; i<orgArr.length; i++){
        if(orgArr[i] != changeArr[i]){
            diffCount ++;
        }
    }
    return diffCount;
}

/**
 * 설명 : 데이터 수정 시 수정 전후 비교하는 함수
 * 파라메터 : grid 데이터 , 변경 후 update할 데이터
 * 주의 : 해당 함수는 공통함수로 작동하지만, 비교할 데이터 파라메터 삽입 시
 *      작동 방식을 확인 후 정확한 데이터를 비교해야함
 * 참고 : valueInsertBack과 셋트로 붙어다님(valueInsertBack : oldData)(checkDataChanged : newData)
 * 작성자 : KYH
 * 작성일 : 2021-09-01
 */
function cmm_checkDataChanged(orgData, changeData){
    let key1 = Object.keys(orgData)
    let keyname = '';
    for(let i=0; i<key1.length; i++){
        keyname = key1[i];
        if(changeData[keyname] != null && changeData[keyname] != undefined){
            if(cmm_jqHasClass($("#"+keyname), 'smartedit'))
                orgData[keyname] += '<p><br></p>';

            if(orgData[keyname] != changeData[keyname]){
                return true;
            }else {
                continue;
            }
        }
    }
    return false;
}

/**
 * 함수명: form clear
 * 함수설명 : 전달받은 form객체 내부 input객체들 초기화하는 함수
 * 파라메타 : form영역 객체
 * 작성자 : KYH
 * 작성일 : 2021-08-09
 */
function cmm_formClear(ele, except){
    let search_ele = ele.find('.inputEle');
    if(except != null){
        let exception = except.join();
        search_ele = search_ele.not(exception);
    }

    search_ele.each(function(){
        if(cmm_hasClass(this, 'dateInput')){
            $(this).datepicker().datepicker('setDate', null);
            $(this).change();
        }else if(this.type == "file"){
            $(this).val();
            $(this).change();
        }else if(cmm_hasClass(this, 'smartedit')){
            smartEditorArr.getById[this.id].exec("SET_IR", [""]); //초기화
            $(this).change();
        }else if(cmm_hasClass(this, 'radioBtn')){
            $(this).find("input[type=radio]").each(function(inIndex) {
                $(this).prop("checked", false);
            });
        }else {
            this.value = "";
            $(this).change();
        }
    });
}

/**
 * 함수명: form disable / Enable
 * 함수설명 : 전달받은 form객체 내부 input객체들 disable하는 함수
 * 파라메타 : form영역 객체 / disable 유무(true or false)
 * 작성자 : KYH
 * 작성일 : 2021-08-09
 * 수정내용 : disable 예외를 추가하고 싶을 때 except 배열을 전달하여 예외를 추가한다.
 * 파라메타 : form영역 객체 / disable 유뮤 / 예외처리할 id(배열 형태로)
 * 수정자 : KYH
 * 수정일 : 2021-08-12
 * 수정내용 : disable / Enable로 함수 분리(파라메터 2개를 초과하지 않도록 관리)
 * 파라메타 : form영역 객체 / 예외로 두고 싶은 id(배열 형태로)[예외가 없다면 추가하지 않아도 무방]
 * 예시 :  cmm_formDisable($("#grp-inputForm"), ['#grp_grp_cd', '#dtl_use_yn']);
 * 수정자 : KYH
 * 수정일 : 2021-08-17
 */
function cmm_formDisable(ele, except){
    let search_ele = ele.find('.inputEle, .btn');
    if(except != null){
        let exception = except.join();
        search_ele = search_ele.not(exception);
    }

    search_ele.each(function(){
        if(cmm_hasClass(this, 'dateInput')){
            $(this).prop("disabled",true);
        }else if(this.type === "file"){
            $(this).prop("disabled",true);
        }else if(cmm_hasClass(this, 'smartedit')){
            smartEditorArr.getById[this.id].exec("DISABLE_WYSIWYG");
            smartEditorArr.getById[this.id].exec("DISABLE_ALL_UI");
        }else if(cmm_hasClass(this, 'btn')){
            $(this).prop("disabled",true);
        }else {
            $(this).prop("disabled",true);
        }
    });
}

function cmm_formEnable(ele, except){
    let search_ele = ele.find('.inputEle, .btn');
    if(except != null){
        let exception = except.join();
        search_ele = search_ele.not(exception);
    }

    search_ele.each(function(){
        if(cmm_hasClass(this, 'dateInput')){
            $(this).prop("disabled",false);
        }else if(this.type === "file"){
            $(this).prop("disabled",false);
        }else if(cmm_hasClass(this, 'smartedit')){
            smartEditorArr.getById[this.id].exec("ENABLE_WYSIWYG");
            smartEditorArr.getById[this.id].exec("ENABLE_ALL_UI");
        }else if(cmm_hasClass(this, 'btn')){
            $(this).prop("disabled",false);
        }else {
            $(this).prop("disabled",false);
        }
    });
}

/**
 * 함수명: form validation(요구사항검증)
 * 함수설명 : form영역 required 검증
 * 파라메타 : form영역 객체
 * 작성자 : KYH
 * 작성일 : 2021-08-03
 * 수정내용 : smart_Editor값 valid체크 할 수 있도록 내용 추가
 * 수정자 : KYH
 * 수정일 : 2021-08-12
 * 수정내용 : 예외 아이디 기능 추가
 * 파라메타 : form영역 객체 / 예외로 두고 싶은 id(배열 형태로)[예외가 없다면 추가하지 않아도 무방]
 * 예시 :  cmm_formValidation($("#grp-inputForm"), ['#grp_grp_cd', '#dtl_use_yn']);
 * 수정자 : KYH
 * 수정일 : 2021-08-17
 */
function cmm_formValidation(ele, except){
    //ele로 한번에 2개 이상의 form을 전달하고 싶으면
    //ex.) $("#faq-searchForm").add("#faq-inputForm")와 같이 파라메터 전달, 예외는 객체 뒤에 전달하면 된다.
    //form 2개, 예외항목 2개를 전달하고 싶을 떄
    //ex) cmm_formValidation($("#bbs-searchForm").add("#bbs-inputForm"), ['#seq', '']);
    let result = "success";
    let requiredSelector = "";
    let search_ele = ele.find('.requiredEle');
    if(except != null){
        let exception = except.join();
        search_ele = search_ele.not(exception);
    }

    search_ele.each(function(){
        let keyname = "";
        if(!this.name === undefined && this.name.length > 0){
            keyname = this.name;
        }else {
            keyname = this.id;
        }

        if(cmm_hasClass(this, 'radioBtn')){
            this.value = $(":input:radio[name='" + keyname + "']:checked").val();
            if(this.value === undefined)
                this.value = "";
        }

        if(this.value == null || this.value === ""){
            /* let requiredSelector = $("label[for='" + this.id + "']").text(); */
            requiredSelector = $(this);
            result = requiredSelector;
            return false;
        }else if(cmm_hasClass(this, 'smartedit')){
            smartEditorArr.getById[this.id].exec("UPDATE_CONTENTS_FIELD", []);
            if(this.value == null || this.value === "<p><br></p>"){
                requiredSelector = $(this);
                result = requiredSelector;
                return false;
            }else {
                return true;
            }
        }
    });

    if(result !== "success") {
        cmm_swalFire(result.attr("title") + " 항목을 입력해주세요");
        return false;
    }else {
        return true;
    }
}

/*========================= 기타 공통 함수 ==========================*/

/* class name에 원하는 내용이 들어가 있는지 확인할 떄 쓰기 위한 함수
 * (inputDataPacking에서 date확인할때)
 * (argon은 date타입도 text로 선언한다)
 */
function cmm_hasClass(element, className) {
    return ('' + element.className + '').indexOf('' + className+ '') > -1;
}

function cmm_jqHasClass(element, className) {
    if(element.attr('class') != undefined){
        return element.attr('class').indexOf(className) > -1;
    }else {
        return false;
    }
}

/* name에 원하는 내용이 들어가 있는지 확인할 떄 쓰기 위한 함수*/
function cmm_hasName(element, Name) {
    return ('' + element.name + '').indexOf('' + Name+ '') > -1;
}

function cmm_lpad(str, padLen, padStr) {
    if (padStr.length > padLen) {
        return str;
    }
    str += ""; // 문자로
    padStr += ""; // 문자로
    while (str.length < padLen)
        str = padStr + str;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
}

function cmm_rpad(str, padLen, padStr) {
    if (padStr.length > padLen) {
        return str + "";
    }
    str += ""; // 문자로
    padStr += ""; // 문자로
    while (str.length < padLen)
        str += padStr;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
}

//clear 와 disable 등이 함께 작동하는 경우가 많아 만든 함수모음
function cmm_initFormSet(pagename){
    let inputForm = $("#"+pagename+"-inputForm");
    $("#"+pagename+"Grid").jqGrid("resetSelection");
    cmm_formClear(inputForm);
    cmm_formDisable(inputForm);
}

/*===================MODAL CONTROL AREA============================*/

/* @Author KYH
 * @EXP : option을 통해 소스코드를 제어한다(함수 수정 시 기존함수 내용이 사라지거나 동작하지 않는 문제 해결 위해)
 * 		option이 null일때 수행되는 코드를 최상위(제일 먼저 만들어진 default함수)에 두고
 *      제어를 위한 문자열을 항상 option 내부에 포함시키도록 작성필요
 *
 * @Detail :
 * 1. option 객체 있는지 없는지 검사
 * 1-1. option 없다면 #1 실행 후 Promise 반납
 * 2. option이 있다면 option객체 안에 option["optFlag"] 키값이 있는지 검사
 * 3. 키값에 따라 해당하는 함수 실행
 * @Since 2022-04-22
 */
function cmm_showDefaultModal(modalId, option) {
    return new Promise(function(succ, fail) {
        try {
            //#1
            if(option == null) {
                $("#" + modalId + "Modal").modal('show');
                succ();
                return;
            }
            let optFlag = cmm_funcOptionVaild(option, fail);

            /*=====HERE TO ADD FUNCTION OR SOURCE=====*/
            //2022-04-22 added option
            if(optFlag != null && optFlag === 'updateForm') {
                cmm_formClear(option["inputTarget"]);
                let inputedData = cmm_valueInsertBack(option["inputTarget"], option["inputRow"]);
                $("#" + modalId + "Modal").modal('show');
                succ(inputedData);
                return;
            }

            //2022-04-28 added option
            if(optFlag != null && optFlag === 'clearForm') {
                cmm_formClear(option["inputTarget"]);
                $("#" + modalId + "Modal").modal('show');
                succ("clear");
            }

            //2022-06-27 added option
            if(optFlag != null && optFlag === 'beforeFunc') {
                option["attachFunc"]();
                $("#" + modalId + "Modal").modal('show');
                succ("excuted");
            }

            /*=====END TO ADD FUNCTION OR SOURCE=====*/
        }catch(e) {
            console.log("a error occured at cmm_showDefaultModal");
            console.log(e);
            fail("a error occured at cmm_showDefaultModal");
        }
    })
}

function cmm_funcOptionVaild(opt, fail) {
    let optFlag = opt["optFlag"];
    if(optFlag == null) {
        let msg = "there is no function name(optFlag) in option\n"
            + "You Must put function name in your option like : \n\n"
            + "let option = {\n"
            + '\t funcNm : "your_function_name"\n'
            + "};\n";
        fail(msg);
    }else {
        return optFlag;
    }
}

function cmm_msgColoring(cellvalue, options, rowObject) {
    if(cellvalue === 'OK') {
        return "<p class='checkGreen'>" + '&#10003' + "</p>";
    }

    if(cellvalue !== 'OK') {
        return "<p class='infoValidMsg'>" + cellvalue + "</p>";
    }
}

function cmm_setDateFormat(cellvalue, options, rowObject) {
    if(cellvalue === undefined) {
        return '';
    }
    return cellvalue.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
}
