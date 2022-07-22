package com.aStatic.starPrintMethod;

import java.util.Scanner;

public class StartPrintMain {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("choose your shape : ");
        System.out.println("right triangle - type 1");
        System.out.println("equilateral triangle - type 2");

        String userSelect = sc.next();
        switch (userSelect) {
            case "1" :
                rightTriangle(sc);
                break;

            case "2" :
                equilateralTriangle(sc);
                break;

            default:
                System.out.println("해당하는 기능이 없습니다");
                break;
        }
    }

    private static void rightTriangle(Scanner sc) {
        int level = 0;
        System.out.println("how many layer u wanna draw : ");
        level = sc.nextInt();

        for(int i=0; i< level; i++) {
            for(int j=0; j < i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }

    private static void equilateralTriangle(Scanner sc) {
        int level = 0;
        System.out.println("how many layer u wanna draw : ");
        level = sc.nextInt();

        int space = level*3;
        for(int i=1; i< level*3; i+= 2) {
            for(int x=space; x > 1; x--) {
                System.out.print(" ");
            }
            for(int j=0; j < i; j++) {
                System.out.print("*");
            }
            System.out.println();
            space --;
        }
    }
}