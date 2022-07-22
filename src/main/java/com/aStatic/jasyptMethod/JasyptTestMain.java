package com.aStatic.jasyptMethod;

import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;

public class JasyptTestMain {


    public static void main(String[] args) {
        StandardPBEStringEncryptor jasypt = new StandardPBEStringEncryptor();

        jasypt.setPassword("myJasyptTest");      //암호화 키(password)
        jasypt.setAlgorithm("SHA-1");  // 사용알고리즘

        String encryptedText = jasypt.encrypt("평서문입니다.");    //암호화
        String decryptedText = "";
        String plainText = jasypt.decrypt(encryptedText);  //복호화


        System.out.println("encryptedText:  " + encryptedText); //암호화된 값
        System.out.println("plainText:  " + plainText);         //복호화된 값

        System.out.println("decryptedText :  " + jasypt.decrypt(decryptedText));
    }
}
