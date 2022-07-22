/**
 * @Author KYH
 * @Detail calendar 관련 스크립트
 *         Argon Dashboard fullCalendar 관련 로직 Custom Source
 * @lib dateExt.js / fullCalendar.js(v5.11.0)
 * @prefix : cld_{your function name}
 * @Since 2022-07-05
 */
/*================== date 관련 함수 ======================*/
let cld_globalCalendarVariable;

/**
 * @Author KYH
 * @Detail 기본적인 Simple calender 생성 및 옵션 설정 함수
 * @param cldOption {
 *      //default -- no calendarReactive
 *      calendarReactive : realTime or resizeEnd
 * }
 * @Since 2022-07-05
 */
function cld_commonCalendarSetting(cldOption) {
    let initializedCalendar;
    let reactiveFlag = cldOption["calendarReactive"];

    cld_reactiveCalendarCall(cldOption).then(function(resultObj) {
        initializedCalendar = resultObj;
        cld_globalCalendarVariable = resultObj;
        setTimeout(function() {
            initializedCalendar.render();
        }, 200);

        if(reactiveFlag == null || typeof reactiveFlag !== 'string') return true;

        if(initializedCalendar != null) {
            // resize 종료 시점에 실행
            let delay = 200;
            $(window).resize(function(){
                if(reactiveFlag === 'realTime') initializedCalendar.setOption('height', cld_getCalendarHeight()); //실시간됨
                if(reactiveFlag === 'resizeEnd') {
                    if(this.resizeTO) clearTimeout(this.resizeTO);
                    this.resizeTO = setTimeout(function(){
                        $(this).trigger('resizeEnd');
                    }, delay);
                }
            });
            $(window).on("resizeEnd", function(){
                initializedCalendar.setOption('height', cld_getCalendarHeight());
            });
        }
    });
}

/**
 * @Author KYH
 * @Detail 화면에 맞춰서 calendar를 그려준다
 * @param cldOption {
 *     calendarName : target이 되는 div의 id접두어(ex.<div id='svrCalendar'> => 'svr'),
 *     calendarTitle : header에 표시될 title이름 / false일 경우 title보이지 않음,
 *     calendarLanguage : calendar언어. 기본값 ko
 * }
 * @Since 2022-07-05
 */
function cld_reactiveCalendarCall(cldOption) {
    let calendarSize = cldOption["calendarSize"];
    if(calendarSize === 'browser') {
        cldOption["height"] = cld_getCalendarHeight();
    }else {
        cldOption["height"] = "auto";
    }

    return new Promise(function(succ) {
        cld_drawCalendar(cldOption).then(function(resultObj) {
            //resultObj.render();
            succ(resultObj);
        });
    });
}

/**
 * @Author KYH
 * @Detail 페이지 하나, Card 하나에 가득차는 높이 구해주는 함수
 * @returns Integer(Height)
 * @Since 2022-07-05
 */
function cld_getCalendarHeight() {
    let browserSize = window.innerHeight;
    let headerSize = $('#head-body').outerHeight();
    let cardObj = $($("#second-big-wrapper").find(".card")[0]);
    let calendarPadding = parseInt(cardObj.css('margin-bottom'));
    return browserSize - headerSize*2 - calendarPadding;
}

/**
 * @Author KYH
 * @Detail calendar 그리기 : 원하는 div를 fullCalendar로 구현한다
 * @param makingPart
 * @Since 2022-07-05
 */
function cld_drawCalendar(makingPart) {
    let mainFullName = makingPart["calendarName"];
    let customLoadComplete = makingPart["loadComplete"];
    let customOnSelectDay = makingPart["onSelectDay"];

    //초기화, 조회, Month이동 등이 일어났을 때 실행될 기본 함수
    //화면페이지에서 custom으로 가져올수도 있다.
    function basicLoadComplete(dateObj) {
        let dateInfo = dateObj["view"].getCurrentData();
        $('.fullcalendar-title').html(dateInfo["viewTitle"]);
        if(typeof customLoadComplete === 'function') {
            customLoadComplete(dateObj);
        }
    }

    //Calendar 내 날짜 클릭할 때 실행될 함수
    //화면페이지에서 custom으로 가져올수도 있다.
    function basicOnSelectDay(dayInfo) {
        console.log(dayInfo);
        if(typeof customLoadComplete === 'function') {
            customOnSelectDay(dayInfo);
        }
    }
    
    //실제 fullCalender에 존재하지 않는 option은 rendering전에 제거한다
    delete makingPart["calendarName"];
    delete makingPart["calendarSize"];
    delete makingPart["calendarReactive"];
    delete makingPart["loadComplete"];
    delete makingPart["onSelectDay"];

    return new Promise(function(succ) {
        let calendarEl = document.getElementById(mainFullName);
        let basicOption = {
            headerToolbar: false,
            locale: 'ko',
            height: 'auto',
            selectable: true,
            //initialDate: '2018-06-01',
            initialView: 'dayGridMonth',
            datesSet: function(dateObj) {
                basicLoadComplete(dateObj);
            },
            dateClick: function(dayInfo) {
                basicOnSelectDay(dayInfo);
            },
        };
        let fullOption = Object.assign(basicOption, makingPart);
        let calenderObj = new FullCalendar.Calendar(calendarEl, fullOption);
        succ(calenderObj);
    });
}

/**
 * @Author KYH
 * @Detail fullCalendar date관련 event 사용 공통함수
 * @Param 사전정의된 command와 option
 * @Since 2022-07-05
**/
function cld_dateNavigation(command, option) {
    if(typeof command !== 'string') {
        console.log("cld_validationNaviCommand error : 올바르지 않은 명령입니다");
        return false;
    }

    if(command.toLowerCase() === 'prev') {
        cld_globalCalendarVariable.prev();
        return true;
    }
    if(command.toLowerCase() === 'next') {
        cld_globalCalendarVariable.next();
        return true;
    }

    //option파라미터로 날짜를 전달해야함(ex.'2022-07-05')
    if(command.toLowerCase() === 'search') {
        if(option == null || typeof option !== 'string') {
            console.log("cld_dateNavigation error : search명령을 사용하기 위해선 날짜가 필요합니다(ex.'2022-07-05'");
            return false;
        }
        if(!dt_validDate(option)) {
            console.log("cld_dateNavigation error : 정상적인 날짜가 아닙니다");
            return false;
        }
        cld_globalCalendarVariable.gotoDate(option);
        return true;
    }
}


/*
$("#svrCalendar").fullCalendar('renderEvent', {
    id: '201265123',
    title: '테스트',
    start: '2022-07-06',
    end: '2022-07-10',
    allDay: true,
    className: $('.event-tag input:checked').val()
}, true);

$('.new-event--form')[0].reset();
$('.new-event--title').closest('.form-group').removeClass('has-danger');*/

