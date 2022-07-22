package com.aStatic.aTestModule.testModels;

import lombok.Data;

@Data
public class ApiResultVO {
    public int responseCode;
    public ApiResultListVO responseText;
}