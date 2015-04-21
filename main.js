/*
* Алгоритм Эллера
* FKataev
*/

labirint = {
    set : {
        wsize : 8, //размеры лабиринта
        hsize : 8
    },
    labirint : {},
    draw : function() {
        
    },
    //стянул с javascript.ru
    getRandomInt : function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    //рекурсивный метод для слияния правых стенок
    merge : function(k, arr) {
        for(var i = k; i < arr.length; i++) {
            if(this.getRandomInt(0,1) === 0 && typeof arr[i+1] != 'undefined') {
                arr.splice((i+1), 1, arr[i]);
                this.merge((i+1), arr);
            }
        }
        
        return arr;
    },
    //нижние границы
    floor : function(sample) {
        var floor = [];

        for(var i = 0; i < this.set.wsize; i++) {
            floor.push(this.getRandomInt(0,1));
        }
        
        //единица, так как правые границы считаем от 1
        for(var i = sample[sample.length-1]; i >= 1; i--) {
            floor = this.floor_unique(floor, sample, i);
        }
    },
    //Если ячейка одна в своем множестве без нижней границы, то не создавайте нижнюю границу
    floor_unique : function(floor, sample, right) {
        var floor_unique = [];
        
        for(var i = 0; i < this.sample; i++) {
            if(sample[i] === right && floor[i] === 0) {
                return floor;
            }
            else if(sample[i] === right) {
                floor_unique.push(i);
            }
        }
        
        var r = this.getRandomInt(0, (floor_unique.length - 1));
        floor[r] = 0;
        
        return floor;
    },
    init : function() {
        
    }
};