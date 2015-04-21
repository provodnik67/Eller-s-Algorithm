/*
* Алгоритм Эллера
* FKataev
*/
var canvas_app = {
    ctx : {},
    field : {},
    canv_w : 15,
    canv_h : 1,
    color : '#4F94CD',
    init : function() {
        this.field = document.getElementById("example"); 
        this.ctx = this.field.getContext('2d');
    },
    draw : function(matrix) {
        //чистим холст
        this.ctx.clearRect(0, 0, this.field.width, this.field.height);
        
        for(var i = 0; i < matrix.length; i++) {
            for(var j = 0; j < matrix[i].length; j++) {
                //рисуем верхнюю границу ячейки
                if(matrix[i][j][0] === 1) {
                    var y = i*this.canv_w;
                    var x = j*this.canv_w;
                    this.ctx.beginPath();
                    this.ctx.fillStyle = this.color;
                    this.ctx.rect(x, y, this.canv_w, this.canv_h);
                    this.ctx.fill();
                }
                
                //рисуем правые границы
                if(matrix[i][j][1] === 1) {
                    var y = i*this.canv_w;
                    var x = j*this.canv_w + this.canv_w;
                    this.ctx.beginPath();
                    this.ctx.fillStyle = this.color;
                    this.ctx.rect(x, y, this.canv_h, this.canv_w);
                    this.ctx.fill();
                }
                
                //рисуем нижние границы
                if(matrix[i][j][2] === 1) {
                    var y = i*this.canv_w + this.canv_w;
                    var x = j*this.canv_w;
                    this.ctx.beginPath();
                    this.ctx.fillStyle = this.color;
                    this.ctx.rect(x, y, this.canv_w, this.canv_h);
                    this.ctx.fill();
                }
                
                //рисуем левую границу ячейки
                if(matrix[i][j][3] === 1) {
                    var y = i*this.canv_w;
                    var x = j*this.canv_w;
                    this.ctx.beginPath();
                    this.ctx.fillStyle = this.color;
                    this.ctx.rect(x, y, this.canv_h, this.canv_w);
                    this.ctx.fill();
                }
            }
        }
    }
};

labirint = {
    set : {
        wsize : 30, //размеры лабиринта
        hsize : 30,
        rand : 5
    },
    main : [],
    //стянул с javascript.ru
    getRandomInt : function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    //рекурсивный метод для слияния правых стенок
    merge : function(k, arr) {
        if(k === (arr.length - 1)) {
            return arr;
        }
        
        for(var i = k; i < arr.length; i++) {
            if(this.getRandomInt(0, this.set.rand) === 0 && typeof arr[i+1] !== 'undefined') {
                arr.splice((i+1), 1, arr[i]);
                this.merge((i+1), arr);
            }
        }
        
        return arr;
    },
    //нижние границы
    floor : function(right) {
        var floor = [];

        for(var i = 0; i < this.set.wsize; i++) {
            floor.push(this.getRandomInt(0,1));
        }
        
        //так формируем уникальные множества
        var uniqueRight = right.filter(function(item, pos) {
            return right.indexOf(item) == pos;
        });
        
        for(var i = 0; i < uniqueRight.length; i++) {
            floor = this.floor_unique(floor, right, uniqueRight[i]);
        }
        
        return floor;
    },
    //если ячейка одна в своем множестве без нижней границы, то нижнюю границу не создаем
    floor_unique : function(floor, right, border) {
        var floor_unique = [];
        
        for(var i = 0; i < right.length; i++) {
            if(right[i] === border && floor[i] === 0) {
                return floor;
            }
            else if(right[i] === border) {
                floor_unique.push(i);
            }
        }
        
        if(floor_unique.length === 0) {
            return floor;
        }
        
        var r = floor_unique.length === 1 ? 0 : this.getRandomInt(0, (floor_unique.length - 1));
        floor[floor_unique[r]] = 0;
        
        return floor;
    },
    //создание строки лабиринта, присоединение к общему массиву
    create_line : function(right, floor, mode) {
        var line = [], cell = [];
        
        for(var i = 0; i < this.set.wsize; i++) {
            cell.length = 0;
            
            //верхняя граница
            if(mode === 'first') {
                cell.push(1);
            }
            else {
                cell.push(0);
            }
            
            //правая граница
            if((i === (this.set.wsize - 1)) || (typeof right[(i+1)] !== 'undefined' && right[i] !== right[(i+1)])) {
                cell.push(1);
            }
            else {
                cell.push(0);
            }
            
            //нижняя граница
            if(mode === 'last') {
                cell.push(1);
            }
            else if(typeof floor[i] !== 'undefined' && floor[i] === 1) {
                cell.push(1);
            }
            else {
                cell.push(0);
            }
            
            //левая граница
            if(i === 0) {
                cell.push(1);
            }
            else {
                cell.push(0);
            }
            
            line.push(cell.slice(0));
            
        }
        
        this.main.push(line);
    },
    init : function() {
        //заполняем лабиринт
        var right = [], floor = [], mode = 'other';;
        
        for(var i = 0; i < this.set.hsize; i++) {
            
            right.length = 0;
            floor.length = 0;
            
            for(var j = 0; j < this.set.wsize; j++) {
                right.push((j+1));
            }
            
            right = this.merge(0, right);
            
            if(i === (this.set.hsize - 1)) {
                for(var j = 0; j < right.length; j++) {
                    right[j] = 1;
                }
            }
                
            floor = this.floor(right);
            mode = 'other';
            
            if(i === 0) {
                mode = 'first';
            }
            else if(i === (this.set.hsize - 1)) {
                mode = 'last';
            }
            
            this.create_line(right, floor, mode);
        }
    }
};

//запуск
window.onload = function() {
    labirint.init();
    canvas_app.init();
    canvas_app.draw(labirint.main);
};