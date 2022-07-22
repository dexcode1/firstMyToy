/**
 * @Author KYH
 * @Detail ajax 관련 스크립트
 *         ajax요청 관련 스크립트 모음 별도 파일로 분리
 * @lib jQuery
 * @prefix : ajx_{your function name}
 * @Since 2022-07-07
 */
/*===================== Ajax 관련 함수 ==========================*/
/**
 * @Author KYH
 * @Detail form Data 전달 수행(json타입으로 선언했기 때문에 controller에서도 json타입으로 돌려줘야함)
 *  - 2021-08-11 : 각 페이지마다 별도의 callBack함수 실행할 수 있도록 동적 함수 실행 코드 추가
 *  - 2021-08-29 : callBack함수 대신에 .done구문으로 처리할 수 있도록 변경한 ajax함수
 * @Param json Data, URL, 반납받을 타입(text or json)
 * @Since 2021-08-03(KYH), 2021-08-11(KYH), 2021-08-29(KYH)
**/
function ajx_syncDefaultAjax(data, url, type) {
    let responseType = "";
    if(type != null) {
        responseType = type.toLowerCase();
    }
    let fullAjaxStr = "";
    if(responseType === null || responseType === "") {
        fullAjaxStr = $.ajax({
            url : url,
            method : "POST",
            data : (data.constructor === Object) ? data : JSON.stringify(data),
            contentType: (data.constructor === Object) ?
                "application/x-www-form-urlencoded; charset=UTF-8" :
                "application/json; charset=UTF-8"
        })
    }else if(responseType === "json" || responseType === "text") {
        fullAjaxStr = $.ajax({
            url : url,
            method : "POST",
            data : (data.constructor === Object) ? data : JSON.stringify(data),
            contentType: (data.constructor === Object) ?
                "application/x-www-form-urlencoded; charset=UTF-8" :
                "application/json; charset=UTF-8",
            dataType : responseType
        })
    }
    return fullAjaxStr.fail(function(jqXHR, status, error) {
        console.log("AJAX전송 에러 : " + url);
        console.log( jqXHR.status );
        console.log( jqXHR.statusText );
        console.log( jqXHR.responseText );
        console.log( jqXHR.readyState );

        cmm_swalFire("ajax Error 발생");
    })
}

/**
 * @Author KYH
 * @Detail ajax 원본 옵션을 custom해서 사용하고 싶을 때
 * @Param ajax option들을 object형태로 전달( option = { ... } )
 * @Since 2021-08-29(KYH)
**/
function ajx_customAjax(pageOption) {
    // 공통으로 실행할 부분은 여기에 추가한다.
    let commonOption = {
        beforeSend : function() {
            console.log("CUSTOM AJAX");
        },
    }
    //호출한 페이지에서 전달받은 옵션과 여기 공통함수부분에서 작성한 코드를 서로 합쳐서 하나의 Option으로 만든다.
    let fullOption = Object.assign(pageOption, commonOption);
    return $.ajax(fullOption)
        .fail(function(request, status, error) {
            //console.log("AJAX전송 에러 : " + url);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            cmm_swalFire("ajax Error 발생");
        })
}

/**
 * @Author KYH
 * @Detail 진행 중인 Ajax요청을 취소, global하게 작동한다
 * @Param global
 * @Since 2021-08-29(KYH)
 **/
function ajx_abortAjaxRequest() {
    httpRequest.abort();
    console.log("Ajax 요청을 취소했습니다.");
}

/*===================== Ajax 관련 함수 끝=========================*/