package com.aStatic.stringParsingMethod;


import com.aStatic.aTestModule.testModels.ApiResultVO;
import com.google.gson.Gson;

public class StringParsingTestMain {
    public static void main(String[] args) {
        String testMsg = "{responseText={\"responseDatetime\":\"2022-06-29 16:52:00\",\"responseMessage\":\"success\",\"responseCode\":\"200\"}\n" +
                ", responseCode=200}";
        Gson gson = new Gson();

        ApiResultVO arv = gson.fromJson(testMsg, ApiResultVO.class);
        if (arv.getResponseCode() != 200) {
            System.out.println("CALL API RESULT ERROR - " + arv.getResponseText());
        }else {
            System.out.println(Integer.toString(arv.getResponseCode()));
            System.out.println(arv.getResponseText().toString());
        }
    }

}
