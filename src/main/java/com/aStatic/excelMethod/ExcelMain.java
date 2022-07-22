package com.aStatic.excelMethod;

import com.aStatic.aTestModule.testModels.OutExcVO;
import com.aStatic.aTestModule.testSetters.VoAutoSetterBasic;
import com.aStatic.excelMethod.excelMaking.StaticExcelMaker;
import com.google.gson.Gson;
import org.json.JSONArray;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExcelMain {

    public static void main(String args[]) {
        StaticExcelMaker sem = new StaticExcelMaker();
        try {
            sem.buildExcel(exampleExcelView(), "C:\\dummy\\abdc3.xlsx");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }


    public static Map<String, Object> exampleExcelView() {
        List<OutExcVO> list = new ArrayList<>();
        Map<String, Object> model = new HashMap<>();
        Gson gson = new Gson();
        JSONArray json = null;

        try {
            String[] keys = { "taskId", "outInsttCode", "outUsrNm", "outDe", "outCn" };
            //엑셀에 표시될 헤더
            String[] headers = { "테스트순번", "단체명", "테스터", "시험날짜", "설명"};
            //컬럼 별 데이터 길이에 따른 길이 비율. 알파벳 대문자, 알파벳 소문자, 숫자, 기호, 한글에 따라서 길이가 다 다르기 때문에 비율로 크기 조절
            double[] ratido = {4, 5, 4, 4, 7};

            List<String[]> contentList = new ArrayList<>();

            contentList.add(new String[]{"2022-001", "테스트기관", "김탁구", "2020.1.20", "예시데이터_001"});
            contentList.add(new String[]{"2022-002", "테스트기관", "김탁구", "2020.1.20", "예시데이터_002"});
            contentList.add(new String[]{"2022-008", "테스트기관", "김탁구", "2020.1.20", "예시데이터_003"});
            contentList.add(new String[]{"2022-004", "테스트기관", "김탁구", "2020.1.20", "예시데이터_004"});
            contentList.add(new String[]{"2022-005", "테스트기관", "김탁구", "2020.1.20", "예시데이터_005"});
            contentList.add(new String[]{"2022-006", "테스트기관", "김탁구", "2020.1.20", "예시데이터_006"});
            contentList.add(new String[]{"2022-007", "테스트기관", "김탁구", "2020.1.20", "예시데이터_007"});
            contentList.add(new String[]{"2022-008", "테스트기관", "김탁구", "2020.1.20", "예시데이터_008"});

            VoAutoSetterBasic<OutExcVO> vasbModule = new VoAutoSetterBasic<>(OutExcVO.class);
            list = vasbModule.autoSettingListValue(keys, contentList);
            json = new JSONArray(gson.toJson(list));

            //그리드 생성에 필요한 데이터
            model.put("excelName", "DONTN_EXCEL_EXAMPLE");
            model.put("row", json);
            model.put("headers", headers);
            model.put("keys", keys);
            model.put("cellratio", ratido);

        }catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return model;
    }
}
