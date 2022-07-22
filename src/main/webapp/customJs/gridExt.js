/**
 *  jqGrid function
 */
function grd_setWidthGrid(){
    setTimeout( function(){grd_resizeGrids()}, 300);
}

//사이드바 축소/확대 시키는 버튼(토글) 클릭 시 Grid도 화면 크기에 따라 변하도록하는 함수
function grd_whenToggleGrid(){
    //사이드바 토글 클릭 시 그리드 리사이즈
    Layout.afterPinSidenav = function(){
        grd_setWidthGrid();
    };
}

//그리드의 옵션 Default값을 호출한다
//jqgrid의 옵션 디폴트 값을 수정할 때 사용
function grd_grid_defaults(){
    $.jgrid.defaults = {
        rownumWidth : 60
    }
}

grd_whenToggleGrid();
grd_grid_defaults();

/**
 * 함수명:그리드 리사이징(resize End)
 * 파라메타 : grid card에 grid제외 row갯수, page id, smartEditor가 있을 시 smartEditor resize함수
 * 작성자 : KYH
 * 작성일 : 2021-08-03
 */
function grd_resizeSelector(rownum, page, fnEditor, cuttingHeight){
    // resize 종료 시점에 실행
    let delay = 300;
    let _div = $("#"+page+"-div");
    $(window).resize(function(){
        if(this.resizeTO) clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function(){
            $(this).trigger('resizeEnd');
        }, delay);
        grd_resizeGridWidth().then();
    })

    $(window).on("resizeEnd", function(){
        if(fnEditor != null) fnEditor();
        grd_resizeRatio(rownum, _div, cuttingHeight);
        grd_resizeGridWidth().then(function() {
            grd_resizeGrids(page);
        })

    });

    grd_resizeRatio(rownum, _div, cuttingHeight);
    grd_resizeGridWidth().then(function() {
        grd_resizeGrids(page);
    })
}

/**
 * 함수명:그리드 리사이징(화면비 적용)
 * 파라메타 : 각 그리드의 부모 div 객체
 * 작성자 : KYH
 * 작성일 : 2021-08-02
 */
function grd_resizeRatio(rownum, grid, mc) {
    //content-body와 head-body(이건 sideBar 페이지에 선언 되어있음)는 모든 페이지 공통이므로 아이디값으로 가져온다
    let contentBody = $("#content-body");
    let gridBody = 0;

    //grid-parent-card에 col-md-12(줄 한개)가 몇개 들어가는지 확인(이에 따라 grid 길이가 달라진다)
    for(let i=0; i<rownum; i++){
        gridBody += $("#grid-parent-card").children('.col-lg-12').eq(i).height();
    }

    if(rownum === "i"){
        gridBody = $("#inputHeight").height();
    }

    let insideLine = $(".insideLine");
    if(insideLine.eq(0).length > 0){
        gridBody += insideLine.eq(0).outerHeight(true);
    }

    gridBody += mc;

    let searchArea = contentBody.find('.card').eq(0).height();
    let headArea = $("#head-body").height();
    let paddingArea = grid.parents().find(".card-body").css('padding-top');
    let total_extra = (paddingArea.substring(0, paddingArea.length-2)*4);

    let minHeight = 630;
    let minWidth = 1087;//992; //minWidth가 없으면 축소시 세로모드로 전환 될 때 grid의 height값이 사라져버린다
    if (minHeight < window.innerHeight && minWidth < window.innerWidth) {
        let result = window.innerHeight-gridBody-headArea-searchArea-total_extra-60;
        if(result < 310){
            grid.height(310);
        }else {
            grid.height(result);
        }
    }
}

//grid width를 화면 넓이에 따라 재조정하는 함수
function grd_resizeGridWidth(){
    return new Promise(function(succ, fail) {
        try {
            $(".ui-jqgrid").each(function(){
                let _this = $(this);
                let grid = _this.find(".table-striped");
                let _ele = $(this).parent();
                let width = grid.getGridParam("width");

                if(width !== _ele.width()) width = _ele.width();

                grid.jqGrid( 'setGridWidth', width);
                let groupHeaders = grid.jqGrid("getGridParam", "groupHeader");
                if(groupHeaders != null){
                    grid.jqGrid("destroyGroupHeader");
                    grid.jqGrid('setGroupHeaders', groupHeaders[0] );
                }

                //길이에 따른 좌우 스크롤바 세팅
                _this.css( 'max-width', _ele.width());
                _this.css( 'overflow-x', "scroll");
                _this.find(".ui-jqgrid-bdiv").css( 'overflow-x', "hidden"); //스크롤이 두개 생기는 것에 대한 대처
            });
            succ();
        }catch (e) {
            fail(e);
        }
    })
}

/**
 * 함수명:그리드 리사이징
 * 각 그리드의 부모 div
 */
/**
 * 수정자 : KYH
 * 수정일 : 2021-08-04
 * 수정내용 : width < _ele.width() -> width != _ele.width()
 * (토글 되돌렸을 때 scrollbar늘어나는 문제 해결)
 */
function grd_resizeGrids(id, iht){
    $(".ui-jqgrid").each(function(){
        let _this = $(this);
        let grid = _this.find(".table-striped");
        let _ele = $(this).parent();
        let width = grid.getGridParam("width");

        if(width !== _ele.width()) width = _ele.width();

        if(iht != null) grid.jqGrid( 'setGridHeight', iht);

        grid.jqGrid( 'setGridWidth', width);
        /*grid.jqGrid( 'setGridWidth', grid.find(".ui-jqgrid-bdiv").width());
        grid.parents(".ui-jqgrid").find(".ui-jqgrid-btable").width($("#" + id + "-div").width())*/

        let height =  _ele.height()-89;
        if(_ele.find("table.ui-jqgrid-btable").getGridParam("caption") !== "")
            height -= _ele.find(".ui-jqgrid-caption").height()

        grid.jqGrid( 'setGridHeight' , height );
        //groupheader는 reszie되면 width가 깨지기 때문에 다시 세팅해 주어야 한다.
        let groupHeaders = grid.jqGrid("getGridParam", "groupHeader");
        if(groupHeaders != null){
            grid.jqGrid("destroyGroupHeader");
            grid.jqGrid('setGroupHeaders', groupHeaders[0] );
        }

        //길이에 따른 좌우 스크롤바 세팅
        _this.css( 'max-width', _ele.width());
        _this.css( 'overflow-x', "hidden"); // 기존 : scroll 변경 : hidden(가로 스크롤바 없애기)
        _this.find(".ui-jqgrid-bdiv").css( 'overflow-x', "hidden"); //스크롤이 두개 생기는 것에 대한 대처
    });
}


/**
 * 함수명:그리드 data 없을 시 표현 함수
 */
function setEmptyGrid(gridId){
    let _grid = "#" + gridId + "Grid";

    let colSpanNum = $(_grid).getGridParam("colModel").length;
    if($(_grid).getGridParam("reccount") === 0){
        if($(_grid).getGridParam("colModel")[0].name === 'rn') {
            $(_grid).append("<tr><td></td><td style='text-align: center;' colspan='" + colSpanNum + "'>조회 내역이 없습니다.</td></tr>");
        }else {
            $(_grid).append("<tr><td style='text-align: center;' colspan='" + colSpanNum + "'>조회 내역이 없습니다.</td></tr>");
        }
    }
}

/**
 * 함수명:그리드 Check 시 select표현
 * 파라미터로 전달된 'rowEle'를 파라미터로 전달된 checked(true or false) 값에 따라 처리한다
 */
function grd_jqGrid_CheckRow(rowEle, checked){
    rowEle.querySelector("input[type=checkbox]").checked = checked;

    let ariaSelected = rowEle.getAttribute("aria-selected");
    ariaSelected = ariaSelected == null ? "false" : ariaSelected;

    if( ( checked && ariaSelected === "false" ) || ( !checked && ariaSelected === "true" )){
        //closest : 부모 찾기
        let grid = $(rowEle.closest(".ui-jqgrid-btable"));
        grid.setSelection(rowEle.id);
    }
}

//그리드 함수 추가
$.jgrid.extend({

    //그리드 search 공통 함수. 추 후, 그리드 조회 시 공통으로 작업되어야 할 내용이 있다면 여기서 추가.
    gridSearch : function(option){
        $(this).setGridParam(option).trigger("reloadGrid");
    },

    /**
     * 함수설명 : jqgrid 함수 재정의
     * 추가사유 : 기존 jqGrid에는 '이전 선택한 Row ID'를 반납하는 옵션이나 로직이 없어
     *         전역변수나 closure, 익명함수()등을 이용하는 문제가 있음
     *         관련하여 beforeRow 라는 변수값을 jqgrid 함수 안에 추가하는 재정의로직
     *         (beforeRow에는 이전 선택한 Row id값이 담기도록 구성 - 조회시에는 null로 초기화)
     * 파라메타 : 기존 jqgrid와 동일
     * 작성자 : KYH
     * 작성일 : 2021-09-08
     * 수정자 : KYH
     * 수정내용 : 페이지에서 Grid에서 정의한 모든 옵션을 icgGrid옵션으로 추가하는 것보다
     각 페이지에서 필요한 옵션만 추가하고 사용하도록 변경 icgGrid는 beforeRow변수와
     줄바꿈 기능을 기본적으로 제공하는 옵션으로만 사용한다
     * 수정일 : 2021-09-29
     */
    icgGrid : function(paramlist){
        let beforeRow = null;

        //페이지에서 가져온 함수들 저장(실행은 하면 안되고 소스만 let변수에 저장)
        let pageCellSelect = paramlist.onCellSelect;
        let pageSelectRow = paramlist.onSelectRow;
        let pageBeforeRequest = paramlist.beforeRequest;
        let pageWrapFlag = paramlist["rowrap"];

        let gridParam = {
            onSelectRow : function(rowid, status, e){ //여기에 before추가하게되면 인식안됨(새로 beforeRow라는 전역변수 만들어져 덮어씌워짐)
                if(pageWrapFlag == null || pageWrapFlag) {
                    if(typeof pageSelectRow === "function") pageSelectRow(rowid,status,e,beforeRow); //beforeRow는 이전에 선택한 Rowid
                    if(!status) {
                        if(!$(this).getGridParam("multiselect")){
                            $(this).jqGrid("resetSelection");
                            grd_scrollOverOut(rowid, grid_id);
                            beforeRow = null;
                        }else if($(this).getGridParam("multiselect")){
                            grd_scrollOverOutBack(rowid, grid_id);
                        }
                        return;
                    }

                    if(!$(this).getGridParam("multiselect")){
                        grd_scrollOver(rowid, "select", grid_id, beforeRow);
                        beforeRow = rowid;
                    }else if($(this).getGridParam("multiselect")){
                        grd_scrollOver(rowid, "select", grid_id);
                    }
                }else {
                    if(typeof pageSelectRow === "function") pageSelectRow(rowid,status,e); //beforeRow는 이전에 선택한 Rowid
                    if (status) {
                        if (!$(this).getGridParam("multiselect")) beforeRow = rowid;
                        if (typeof pageSelectRow === "function") pageSelectRow(rowid, status, e, beforeRow);
                    } else {
                        if (!$(this).getGridParam("multiselect")) {
                            $(this).jqGrid("resetSelection");
                            beforeRow = null;
                        }
                    }
                }

            },
            beforeRequest: function () {
                beforeRow = null;
                if(typeof pageBeforeRequest === "function") pageBeforeRequest(beforeRow);
            },
            onCellSelect: function(rowid, icol, cellcontent, e) {
                if(typeof pageCellSelect === "function") pageCellSelect(rowid, icol, cellcontent, e, beforeRow);
            }
        };
        let fullParameter = Object.assign(paramlist, gridParam);
        let grid_id = $(this).attr("id").replace("Grid", '').trim();
        $(this).jqGrid(fullParameter);
    },

    /**
     * 함수명: Grid Click Event 1st(get Row Data)
     * 작성일 : 2021-07-21
     * 작성자 : SungHwanJung
     * 함수설명 : 선택된 row의 데이터 조회
     * 파라메타 : Grid 객체
     * 수정일 : 2021-08-10
     * 수정자 : KYH
     * 함수설명 : Grid sortable 시 콜백함수 실행하는 옵션 추가
     * 파라메타 : sortable 시 실행될 콜백함수, 그리드 접두사(ex. "bbs")
     * 수정일 : 2021-11-11
     * 수정자 : KYH
     * 수정내용 : 그리드 접두사 제거("bbs" 등)
     * 		   더이상 콜백함수로 넘기지 않고 promise로 드래그 함수를 실행함
     */
    getSelectedRowData : function(){
        let grid = $(this);
        let selectedRow = grid.getGridParam('selrow');
        let data;

        if(selectedRow != null) data = grid.getRowData(selectedRow);

        return data;
    },

    //그리드 드래그 옵션
    gridSortable : function(updateFunc){
        $(this).jqGrid('sortableRows',{
            update : function(e, ui){
                    updateFunc(e, ui);
            }
        });
    }
});

/**
 * 함수명:그리드 data 표시 형식(줄바꿈)
 */
function grd_scrollOver(rowid, release, gridid, befRow){
    let gridName = $("#" + gridid + "Grid").closest(".ui-jqgrid-btable");

    let currentRow = gridName.find("[id=" + rowid + "]");
    let previousRow = gridName.find("[id=" + befRow + "]");
    if(release === "select"){
        //줄바꿈으로 표기
        currentRow.children("td").each(function(){
            //jquery보다는 javascript 스타일이 더 빠르고 important속성 사용 가능함
            this.style.setProperty('white-space', 'normal', 'important');
        });

        if(befRow != null){
            previousRow.children("td").each(function(){
                this.style.setProperty('white-space', 'nowrap', 'important');
            });
        }
    }else {
        //줄바꿈으로 표기
        previousRow.children("td").each(function(){
            this.style.setProperty('white-space', 'nowrap', 'important');
        });
    }
}
function grd_scrollOverOut(rowid, gridid) {
    let currentRow = $("#" + gridid + "Grid").closest(".ui-jqgrid-btable").find("[id=" + rowid + "]");
    currentRow.children("td").each(function(){
        this.style.setProperty('white-space', 'nowrap', 'important');
    });
}

function grd_scrollOverOutBack(rowid, gridid) {
    let currentRow = $("#" + gridid + "Grid").closest(".ui-jqgrid-btable").find("[id=" + rowid + "]");
    currentRow.children("td").each(function(){
        this.style.setProperty('white-space', 'pre', 'important');
    });
}

/*===================GRID 제어 함수 모음============================*/

function grd_setGridSizeOut(rowNum, gridNameList, optHeight) {
    let microCutting = 0;
    if(optHeight != null) microCutting = optHeight;

    function settingSize() {
        return new Promise(function(succ, fail) {
            try {
                setTimeout(function() {
                    for(let i=0; i<gridNameList.length; i++) {
                        grd_resizeSelector(rowNum, gridNameList[i], null, microCutting);
                    }
                    succ();
                },300);
            }catch (e) {
                fail(e);
            }
        })
    }

    if(gridNameList != null && gridNameList !== '') {
        return new Promise(function(fin, none) {
            try {
                settingSize().then(function() {
                    fin();
                })
            } catch(e) {
                none(e);
            }

        })
    }
}

/*
 * 많이 쓰이는 옵션들 고정, assign 시 뒤쪽 Object값이 우선하므로
 * 뒤쪽에서 중복값을 합치더라도 문제는 없다
 */
function grd_commonGridSetting(gridAddOptions, gridNameList) {
    let commonGridOption = {};
    function makeGridResult() {
        return new Promise(function(succ, fail) {
            try {
                for(let i=0; i<gridNameList.length; i++) {
                    let pageNum = "page" + i;
                    commonGridOption[pageNum] = {
                        styleUI : 'Bootstrap',
                        datatype: "json",
                        scrollrows:true,
                        rownumbers: true,
                        rowNum: 100,
                        viewrecords: true,
                        loadonce: true,
                        gridview : true,
                        page : 1,
                        scroll: false,
                        recordpos: "none",
                        pgbuttons : true,
                        pager: "#jqGridPager" + (i+1) + "",
                        width: $("#" + gridNameList[i] + "-div").width(),
                        onSelectRow : {}
                    }
                }
                succ("succeed");
            }catch (e) {
                fail(e);
            }
        })
    }

    return new Promise(function(fin, none) {
        try {
            makeGridResult().then(function() {
                for(let i=0; i<gridAddOptions.length; i++) {
                    $("#" + gridNameList[i] + "Grid").icgGrid(
                        Object.assign(commonGridOption["page" + i], gridAddOptions[i])
                    );
                }
                fin();
            })
        }catch (e) {
            none(e);
        }
    })
}

/* @Author KYH
 * @parameter GRID이름, (opt : 선택된 row값, 0 전달 시 '선택되어있는 모든 row', selectOpt없이 사용시 : 모든 row reset)
 * @Comment 선택된, 혹은 전체 GRID Row의 줄바꿈 로직을 해제하는 함수,
 *			이 함수 없이 reset만 하게되면 grid 선택은 해제되지만 줄바꿈은 그대로 남는다
 * @Since 2022-04-19
 */
function grd_gridSelectReset(gridid, selectOpt) {
    let gridEle = "#" + gridid + "Grid";
    let gridRows = $(gridEle).closest(".ui-jqgrid-btable").children();
    let currentSelectedRow = "";

    let isMultiple = "selrow";
    if($(gridEle).getGridParam("multiselect")) isMultiple = "selarrrow";

    if(selectOpt == null || selectOpt.length === 0) {
        $(gridEle).jqGrid('resetSelection');
        gridRows.children("td").each(function(){
            this.style.setProperty('white-space', 'nowrap', 'important');
        });
        return;
    }

    if(typeof selectOpt != 'number') {
        console.log("grd_gridSelectReset : second parameter must be 'number' type");
        return null;
    }

    if(selectOpt === 0) {
        let selecteds = $(gridEle).jqGrid("getGridParam", isMultiple);
        let selectedTr = "";

        if(selecteds == null) return;
        for(let i=0; i<selecteds.length; i++) {
            selectedTr += "tr:eq(" + selecteds[i] + ")";
            if(i < selecteds.length -1) selectedTr += ", ";
        }
        currentSelectedRow = gridRows.find(selectedTr);
    }else {
        //currentSelectedRow = gridRows.children('tr').eq(selrow);
        currentSelectedRow = gridRows.find("tr:eq(" + selrow + ")");
    }

    currentSelectedRow.each(function() {
        $(gridEle).setSelection($(this).attr('id'));
        [].forEach.call(this.children, function(e1) {
            e1.style.setProperty('white-space', 'nowrap', 'important');
        })
    });
}

/*=================== jqGrid 관련 함수 ==========================*/
/**
 * 함수명: jqGridSearch(Grid공통검색:type json)
 * 함수설명: form Data로 검색 수행
 * 파라메타 : json Data, URL, grid접두사
 * 작성자 : KYH
 * 작성일 : 2021-08-03
 * 수정일 : 2021-08-09
 * 수정자 : KYH
 * 수정내용 : 페이지마다 환경이 달라 callBack함수 추가
 * 수정일 : 2021-11-11
 * 수정자 : KYH
 * 수정내용 : Promise구문 사용할 수 있게되어 내용 변경 후 각 페이지 Promise처리내용 추가 / CallBack 제거
 */
function grd_jqGridSearch(datas, url, grid, customOpt){
    let mtypeItem = "get";
    if(customOpt != null) {
        mtypeItem = (customOpt['mtype'] != null) ? customOpt['mtype'] : 'get';
    }

    let g_id = $("#"+grid+"Grid");
    g_id.jqGrid("clearGridData", true);
    let basicOpt = {
        datatype	: "json",
        mtype		: mtypeItem,
        postData 	: (datas === '') ? '' : datas,
        url: url,
        loadComplete	: function(data) {
            setEmptyGrid(grid);
            succ(data);
        },onPaging: function (pgButton){
            //페이지 이동버튼 누를 시 스크롤바 제일 위로 이동
            g_id.closest(".ui-jqgrid-bdiv").scrollTop(0);
        },loadError : function(xhr, status, error) {
            console.log("JqGrid 조회 에러");
            console.log(xhr);
            console.log(status);
            console.log(error);
            if(xhr.responseText.length > 0) {
                if(xhr.responseText === "ApiError"){
                    cmm_swalFire("내부 API호출에 실패했습니다.<br>문제 지속 시 관리자에게 문의바랍니다.");
                }else if(xhr.responseText === "callApi-fail") {
                    cmm_swalFire("조회 중 에러가 발생<br>관리자에게 문의 부탁 드립니다");
                }else {
                    cmm_swalFire("내부 API호출에 실패했습니다.<br>문제 지속 시 관리자에게 문의바랍니다.");
                }
            }
        }
    }

    if(customOpt == null) {
        return new Promise(function(succ, fail) {
            try {
                let base = {
                    loadComplete : function(data) {
                        setEmptyGrid(grid);
                        succ(data);
                    }
                };
                let baseGrid = Object.assign(basicOpt, base);
                g_id.gridSearch(baseGrid);
                succ('loaded');
            }catch (e) {
                fail(e);
            }
        })
    }

    let fullOption;
    fullOption = Object.assign(basicOpt, customOpt);

    if(customOpt["loadComplete"] == null) {
        return new Promise(function(succ, fail) {
            let base = {
                loadComplete : function(data) {
                    setEmptyGrid(grid);
                    succ(data);
                }
            };
            let baseGrid = Object.assign(basicOpt, base);
            g_id.gridSearch(baseGrid);
        })
    }

    if(customOpt["loadComplete"] != null) g_id.gridSearch(fullOption);
}

function grd_scrollGridTop(gridId, option) {
    return new Promise(function(succ, fail) {
        let gridEle = "#" + gridId + "Grid";

        try {
            if(option == null) {
                $(gridEle).closest(".ui-jqgrid-bdiv").scrollTop(0);
                succ();
                return;
            }
            let optFlag = option["funcNm"];
            if(optFlag == null) {
                let msg = "there is no function name(funcNm) in option\n"
                    + "You Must put function name in your option like : \n\n"
                    + "let option = {\n"
                    + '\t funcNm : "your_function_name"\n'
                    + "};\n";
                fail(msg);
                return;
            }

            /*=====HERE TO ADD FUNCTION OR SOURCE=====*/

            /*=====END TO ADD FUNCTION OR SOURCE=====*/
        }catch(e) {
            fail("a error occured at grd_scrollGridTop");
        }
    })
}

/**
 * @author KYH
 * @param targetName Grid 메인 이름(ex.svrGrid -> 'svr')
 * @param checkedFlag 체크된 아이템을 가져올 것인지, 그 반대인지(boolean)
 * @returns {*[]} 가공된 목록 List(isChecked : true라면 체크된 목록, false라면 체크 안된 목록) Default : true
 * @Since 2022-06-28
 */
function grd_checkboxRowDataPacking(targetName, checkedFlag) {
    //targetObj.jqGrid('getGridParam','data'); //GRID 전체 데이터를 가져오기 위해선 getRowData를 써서는 안됨
    let isChecked = true;
    if(checkedFlag != null && typeof checkedFlag !== 'boolean') {
        console.log("잘못된 형식의 파라미터가 전달되었습니다.");
        console.log("checkedFlag must be 'boolean'");
        return [];
    }

    let list = [];
    let targetObj = $("#" + targetName + "Grid");
    let rows = targetObj.getGridParam("selarrrow");

    if(isChecked) {
        rows.forEach(function(ele) {
            list.push(targetObj.getRowData(ele));
        });
    }else {
        let allDatas = targetObj.jqGrid('getGridParam','data');
        allDatas.forEach(function(ele) {
            if(ele["_id_"] + "" === rows[0] + "") rows.splice(0, 1);
            else list.push(ele);
        });
    }
    return list;
}

//GRID그룹 펼치고, 접는 함수
function grd_excollapseAll(gridId, methodType, option){
    return new Promise(function(succ, fail) {
        try {
            if(option == null) {
                let rows = document.querySelectorAll("[id^=" + gridId + "Gridghead]");
                for(let i = 0, len = rows.length; i<len; i++){
                    let span = rows[i].querySelector("span");
                    let flag = false;
                    let trt = span.className.indexOf("glyphicon-triangle-right");

                    if(methodType === "expand")
                        flag = trt !== -1;
                    if(methodType === "collapse")
                        flag = trt === -1;

                    if(flag)
                        span.click();
                }
                succ();
                return;
            }
            let optFlag = cmm_funcOptionVaild(option, fail);
            /*=====HERE TO ADD FUNCTION OR SOURCE=====*/
            /* if(optFlag != null && optFlag == '20220422_insertFunc') {

            } */
            /*=====END TO ADD FUNCTION OR SOURCE=====*/

        }catch(e) {
            console.log("a error occured at grd_excollapseAll");
            console.log(e);
            fail("a error occured at grd_excollapseAll");
        }
    })
}

function grd_gridSelectValid(gridId, opt) {
    let row = $("#" + gridId + "Grid").getSelectedRowData();
    if(row == null){
        cmm_swalFire("선택된 항목이 없습니다");
        return false;
    }
    if(opt == null) return row;
    if(typeof opt == 'function') opt();
    return row;
}

/*=================== jqGrid 관련 함수 끝=========================*/


/*===================END OF GRID CONTROL============================*/




