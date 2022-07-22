/**
 * @Author KYH
 * @Detail File 관련 스크립트
 *         File 제어 관련 스크립트 모음 별도 파일로 분리
 * @lib jQuery
 * @prefix : fl_{your function name}
 * @Since 2022-07-07
 */
/*===================== File 관련 함수 ==========================*/

/**
 * @Author KYH
 * @Detail input tag요소에 현재 file이 업로드 되어있는지 판단하는 함수
 * @Param 요소 ID(ex. <xxx id = 'test11' /> )
 * @Since 2021-08-UNKNWON(KYH)
**/
function fl_isFileExist(id) {
    let target = document.querySelector("#" + id);
    if(target == null) {
        console.log("There's no element with that id");
        return false;
    }
    if(target.value.length > 0) {
        return true;
    }else {
        console.log("no file imported");
        return false;
    }
}


/*===================== File 관련 함수  끝 =======================*/