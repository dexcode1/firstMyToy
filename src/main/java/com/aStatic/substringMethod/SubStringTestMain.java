package com.aStatic.substringMethod;

public class SubStringTestMain {
    public static void main(String[] args) {
        String pathName = "/home/test/mnt/dataStorage/2022-007/test3/ERR2123_3.txt";

        int splitor = pathName.lastIndexOf("/");
        String localDir = pathName.substring(0,splitor);
        String fileName = pathName.substring(splitor+1);

        System.out.println(localDir);
        System.out.println(fileName);

    }
}
