package com.aStatic.lamdaTest;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;


public class LamdaTestMain {

    public static void main(String[]args){
        List<CidExcVO> list = new ArrayList<>();
        list.add(new CidExcVO("10001", "1"));
        list.add(new CidExcVO("10002", "1"));
        list.add(new CidExcVO("10003", "1"));

        List<CidChkVO> iidList = new ArrayList<>();
        iidList.add(new CidChkVO("10001", "Y"));
        iidList.add(new CidChkVO("10004", "N"));
        iidList.add(new CidChkVO("10003", "N"));

        AtomicBoolean compareGeneId = new AtomicBoolean(false);

        list.stream().map((uploaded) -> {
            String uploadGeneId = uploaded.getGeneId();
            if( iidList.stream().noneMatch(item -> item.getIndId().equals(uploadGeneId)) ) {
                uploaded.setMsg("NO_SUCH_GENEID");
                compareGeneId.set(true);
            }

            for (CidChkVO cidChkVO : iidList) {
                String iid = cidChkVO.getIndId();
                if (uploadGeneId.equals(iid) && cidChkVO.getDeleteAt().equals("Y")) {
                    uploaded.setMsg("REMOVED");
                }
            }
            return uploaded;
        }).collect(Collectors.toList());


        for(CidExcVO e : list) {
            System.out.println(e);
        }
    }
}

@Data
class CidChkVO {
    private String indId;
    private String deleteAt;

    public CidChkVO(String s1, String s2) {
        this.indId = s1;
        this.deleteAt = s2;
    }
}

@Data
class CidExcVO {
    private String msg;
    private String geneId;
    private String famId;
    public CidExcVO(String s1, String s2) {
        this.geneId = s1;
        this.famId = s2;
    }
}