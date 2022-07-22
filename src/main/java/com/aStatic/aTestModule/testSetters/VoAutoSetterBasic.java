package com.aStatic.aTestModule.testSetters;

import org.jetbrains.annotations.NotNull;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

// VoAutoSetter는 VO를 가리지 않고 처리할 수 있어야한다
public class VoAutoSetterBasic<T> {

    private final Constructor<? extends T> tempConstruct;

    public VoAutoSetterBasic(Class<? extends T> impl) throws NoSuchMethodException {
        this.tempConstruct = impl.getConstructor();
    }

    private void setFieldItem(T tb, String @NotNull [] keys, String[] content) {
        List<Field> fieldList = new ArrayList<>();
        for (int i = 0; i < keys.length; i++) {
            fieldList.add(ReflectionUtils.findField(tb.getClass(), keys[i]));
            fieldList.get(i).setAccessible(true);
            try {
                fieldList.get(i).set(tb, content[i]);
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }

    //객체와, 객체의 키 배열과, 데이터 배열이 주어지면 자동으로 해당 vo객체 해당 key값에 데이터 insert하고 vo객체를 반납하는 메소드
    public T autoSettingValue(T t, String @NotNull [] keys, String[] contents) {
        setFieldItem(t, keys, contents);
        return t;
    }

    //객체와, 객체의 키 배열과, 데이터 배열이 주어지면 자동으로 해당 vo객체 해당 key값에 데이터 insert하고 vo "List" 객체를 반납하는 메소드
    public List<T> autoSettingListValue(String[] keys, List<String[]> contents) {
        List<T> makingResult = new ArrayList<>();
        try {
            for (String[] content : contents) {
                T tb = tempConstruct.newInstance();
                setFieldItem(tb, keys, content);
                makingResult.add(tb);
            }
        }catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return makingResult;
    }

    //객체를 파라메터로 받아서, 해당 객체 모든 데이터에서 trim()을 수행하는 메소드
    public T autoTrimAllValue(T t, String @NotNull [] keys) {
        List<Field> fieldList = new ArrayList<>();

        for(int i=0; i<keys.length; i++) {
            fieldList.add(ReflectionUtils.findField(t.getClass(), keys[i]));
            fieldList.get(i).setAccessible(true);
            try {
                String value = fieldList.get(i).get(t).toString();
                fieldList.get(i).set(t, value.trim());
            } catch (Exception e) {
                System.out.println(e.getMessage());
                return null;
            }
        }
        return t;
    }

}
