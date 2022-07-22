/*================== date 관련 함수 ======================*/
/**
 * Date 관련 스크립트(getString / dateInputFinish)
 * BO떄 사용하기 위해 작성한 Date관련 parsing 및 valid 함수
 * 작성자 : KYH
 */
//Date 객체를 원하는 포맷으로 돌려주는 함수 정의
function dt_getStringDate(dtf, unitSize){
    let year = dtf.getFullYear();
    let month = (dtf.getMonth() + 1) + "";
    month = cmm_lpad(month, 2 , "0")
    let day = dtf.getDate() + "";
    day = cmm_lpad(day, 2 , "0")
    let hour = dtf.getHours()+ "";
    hour = cmm_lpad(hour, 2 , "0")
    let minute = dtf.getMinutes() + "";
    minute = cmm_lpad(minute, 2 , "0")

    // 원하는 year, month의 마지막 날 얻어오기(윤년 2월 등 대비)
    let lastDay = (new Date(year, month, 0)).getDate();
    if(unitSize === "full"){ // full String(ex. 2021-05-12 13:15)
        return year + "-" + month + "-" + day + " " + hour + ":" + minute;
    }else if(unitSize === "back"){ // back String(ex. 13:15)
        return hour + ":" + minute;
    }else if(unitSize === "front"){ // front String(ex. 2021-05-12)
        return year + "-" + month + "-" + day;
    }else if(unitSize === "first"){ // first Day String (ex. 2021-05-01)
        return year + "-" + month + "-" + "01";
    }else if(unitSize === "last"){ // last day String (ex. 2021-05-31)
        return year + "-" + month + "-" + lastDay;
    }else if(unitSize === "onlyNum"){ // only number String (ex. 20210514)
        return year + month + day;
    }else if(unitSize === "dot"){
        return year + "." + month + "." + day;
    }
}

/*
 * @Author KYH
 * @Parameter 대상 Input요소(<input> tag 자체), Keyboard입력 이벤트 객체(e)
 * @EXP 정상적인 날짜 입력을 유도하는 함수
 *      숫자만 입력되고 형식에 따라 YYYY 및 MM 입력 시 Dash('-')가 추가된다
 * @Since 2022-06-27
 */
function dt_guideDate(ele, e) {
    function composeHandler(item) {
        const self = item;
        self.blur();
        requestAnimationFrame(function () {
            self.focus();
        });
    }

    let regex = /^\d+$/;
    let pushKey = e.originalEvent["key"];

    if(pushKey === 'Process') composeHandler(ele);
    if(pushKey.length > 1) return true;

    if(!regex.test(pushKey)) {
        e.preventDefault();
        return false;
    }

    let regDash = /-/g;
    let dashCnt = ele.value.match(regDash) + "";
    let targetLength = ele.value.length + "";

    if(targetLength === '4') {
        if(dashCnt === "null" && regex.test(pushKey)) {
            ele.value += "-";
        }
    }

    if(targetLength === '7') {
        if(dashCnt === '-' && regex.test(pushKey)) {
            ele.value += "-";
        }
    }
}

/*
 * @Author KYH
 * @Parameter "문자열"로 된 날짜(형식 : YYYY-MM-DD)
 * @EXP 파라미터 날짜가 실제 날짜로 적합한지 체크하는 함수
 * @Since 2022-06-27
 */
function dt_validDate(dayStr) {
    function dateIsValid(date) {
        return date instanceof Date && !isNaN(date);
    }
    let targetDate = new Date(dayStr);
    let dayStrArr = dayStr.split("-");
    let targetMonth;
    if(dayStrArr[1].startsWith('0')){
        targetMonth = dayStrArr[1].replace('0', '');
    }else {
        targetMonth = dayStrArr[1];
    }

    let monthStr = targetDate.getMonth() + 1;

    if(monthStr+"" === targetMonth+""){
        return dateIsValid(targetDate);
    }else {
        return false;
    }
}

/*
 * @Author KYH
 * @EXP "문자열"로 된(형식 : YYYY-MM-DD) 날짜 2개를 비교
 *      parameter가 1개면 '오늘날짜'와 비교하고
 *      parameter가 2개면 2개 날짜를 비교하여
 *      '첫번째 인자'가 더 크면 '1'반납
 *      아닐 경우엔 '0'을 반납한다
 * @Since 2022-06-28
 */
function dt_compareDate(dateStr1, dateStr2) {
    let firstTarget = new Date(dateStr1);
    let secondTarget;
    if(dateStr2 !== undefined) {
        secondTarget = new Date(dateStr2);
    }else {
        secondTarget = new Date();
    }
    return (firstTarget.getTime() > secondTarget.getTime()) ? 1 : 0;
}
