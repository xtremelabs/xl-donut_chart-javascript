var DonutChart = function(paper, columns, radius, text) {
    this._paper = paper;
    this._columns = columns;
    this._radius = radius;
    this._text = text;
    this._arcs = [];
    
    this._addPercentagesToColumns = function() {
        var totalValue = 0;
        var columns = this._columns;
    
        for (var i=0;i<columns.length;i++) {
            var column = columns[i];
            totalValue += column.value;
        }
        
        for (var i=0;i<columns.length;i++) {
            var column = columns[i];
            column.percentage = (column.value / totalValue) * 100;
        }
    }
    
    this._addCustomAttributes = function() {
        paper.customAttributes.arc = function(xloc, yloc, value, total, R) {
            var alpha = 360 / total * value,
                a = (90 - alpha) * Math.PI / 180,
                x = xloc + R * Math.cos(a),
                y = yloc - R * Math.sin(a),
                path;
            if (total == value) {
                path = [
                    ["M", xloc, yloc - R],
                    ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
                    ];
            } else {
                path = [
                    ["M", xloc, yloc - R],
                    ["A", R, R, 0, +(alpha > 180), 1, x, y]
                    ];
            }
            return {
                path: path
            };
        };
        paper.customAttributes.column = function(column) {
            return column;
        }
    }
    
    this._drawArcs = function() {
        var arcs = this._arcs;
        var radius = this._radius;
        
        for (var i=0;i<columns.length;i++) {
            var arc = paper.path().attr({
                "stroke": columns[i].color,
                "stroke-width": 25,
                arc: [100, 100, 0, 100, radius],
                column: columns[i]
            });
            arcs.push(arc);
        }
    }

    this._animateArcs = function() {
        var arcs = this._arcs;
        var radius = this._radius;
        var animateToValue = 100;
        
        for (var i=0;i<arcs.length;i++) {
            //the animated arc
            arc = arcs[i];
            column = arcs[i].attrs.column 
            
            arc.animate({
                arc: [100, 100, animateToValue, 100, radius]
            }, 1900);
            animateToValue -= column.percentage;
        }    
    }

    this._drawText = function() {
        var radius = this._radius;
        
        //text in the middle
        theText = paper.text(100, 100, this._text).attr({
            "font-size": radius*0.9,
            "fill": "grey",
            "font-weight": "bold"
        });
    }
    
    this._addPercentagesToColumns();
    this._addCustomAttributes();
    this._drawText();
    this._drawArcs();
    this._animateArcs();
}
