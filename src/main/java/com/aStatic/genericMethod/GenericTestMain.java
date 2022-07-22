package com.aStatic.genericMethod;

import com.ojt.statics.genericMethod.model.Apple2;
import com.ojt.statics.genericMethod.model.Fruit2;
import com.ojt.statics.genericMethod.model.Grape2;

import java.util.ArrayList;

class Box2<T> {
    ArrayList<T> list = new ArrayList<>();
    void add(T item) {
        list.add(item);
    }
    T getItem(int num) {
        return list.get(num);
    }
    ArrayList<T> getList() {
        return list;
    }
    int size() {
        return list.size();
    }
    public String toString() {
        return list.toString();
    }
}
class FruitBox2<T extends Fruit2> extends Box2<T> {}
public class GenericTestMain {
    public static void main(String[] args) {
        FruitBox2<Fruit2> fruitBox = new FruitBox2<Fruit2>();
        fruitBox.add(new Fruit2());
        fruitBox.add(new Apple2());
        fruitBox.add(new Grape2());

        FruitBox2<? extends Fruit2>fruitBox2 = new FruitBox2<>();
        //fruitBox2.add(new Apple2());
        //System.out.println(Juicer.makeJuice(fruitBox));
    }
}


