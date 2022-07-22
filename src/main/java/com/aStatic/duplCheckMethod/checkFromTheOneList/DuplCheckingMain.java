package com.aStatic.duplCheckMethod.checkFromTheOneList;

import com.aStatic.aTestModule.testModels.OutExcVO;
import com.aStatic.aTestModule.testSetters.VoAutoSetterBasic;

import java.util.ArrayList;
import java.util.List;

public class DuplCheckingMain {


    public static void main(String[] args) {
        List<OutExcVO> list = new ArrayList<>();
        List<OutExcVO> checkList = new ArrayList<>();
        String[] keys = { "taskId", "outInsttCode", "outUsrNm", "outDe", "outCn" };
        List<String[]> contentList = new ArrayList<>();

        contentList.add(new String[]{"2022-001", "테스트기관", "김탁구", "2020.1.20", "예시데이터_001"});
        contentList.add(new String[]{"2022-002", "테스트기관", "김탁구", "2020.1.20", "예시데이터_002"});
        contentList.add(new String[]{"2022-008", "테스트기관", "김탁구", "2020.1.20", "예시데이터_003"});
        contentList.add(new String[]{"2022-004", "테스트기관", "김탁구", "2020.1.20", "예시데이터_004"});
        contentList.add(new String[]{"2022-005", "테스트기관", "김탁구", "2020.1.20", "예시데이터_005"});
        contentList.add(new String[]{"2022-006", "테스트기관", "김탁구", "2020.1.20", "예시데이터_006"});
        contentList.add(new String[]{"2022-007", "테스트기관", "김탁구", "2020.1.20", "예시데이터_007"});
        contentList.add(new String[]{"2022-008", "테스트기관", "김탁구", "2020.1.20", "예시데이터_008"});

        try {
            VoAutoSetterBasic<OutExcVO> vasbModule = new VoAutoSetterBasic<>(OutExcVO.class);
            list = vasbModule.autoSettingListValue(keys, contentList);

            setMsgInsideDuplFromList(list);

        }catch(Exception e) {
            System.out.println(e.getMessage());
        }

        for (OutExcVO outExcVO : list) {
            System.out.println(outExcVO.toString());
        }

    }

    public static void setMsgInsideDuplFromList(List<OutExcVO> targetList) {
        int listSize = 0;
        for (OutExcVO temp : targetList) {

            for(int i=0; i<targetList.size(); i++) {
                if(i == listSize) continue;

                if(temp.getTaskId().equals(targetList.get(i).getTaskId())) {
                    targetList.get(i).setMsg("INVALIND_INSIDEDUPL");
                    temp.setMsg("INVALIND_INSIDEDUPL");
                }
            }
            listSize ++;
        }
    }


}
