var DonutChart = function(paper, columns, radius, text, options) {
    this._paper = paper;
    this._columns = columns;
    this._radius = radius;
    this._text = text;
    this._arcs = [];
    this._options = (typeof options === "undefined") ? {} : options;
    this._strokeWidth  = this._options.strokeWidth || 25;
    this._legendOptions = (typeof this._options.legend === "undefined") ? {} : this._options.legend;

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
                "stroke-width": this._strokeWidth,
                arc: [100, 100, 0, 100, radius],
                column: columns[i]
            });
            arcs.push(arc);
        }
    };

    this._animateArcs = function() {
        var arcs = this._arcs;
        var radius = this._radius;
        var animateToValue = 100;

        for (var i=0;i<arcs.length;i++) {
            //the animated arc
            arc = arcs[i];
            column = arcs[i].attrs.column;

            arc.animate({
                arc: [100, 100, animateToValue, 100, radius]
            }, 1900);
            animateToValue -= column.percentage;
        }
    };

    this._drawText = function() {
        var radius = this._radius;

        //text in the middle
        theText = paper.text(100, 100, this._text).attr({
            "font-size": radius*0.9,
            "fill": "grey",
            "font-weight": "bold"
        });
    };

    this._drawLegendText = function(xCood, yCood, label) {
        var text = this._paper.text(xCood, yCood, label);
        var options = ({
            "text-anchor": "start",
            "font-size": "13px"
        });

        if (this._legendOptions["font-color"]) { options["fill"]      = this._legendOptions["font-color"]; }
        if (this._legendOptions["font-size"])  { options["font-size"] = this._legendOptions["font-size"]; }
        if (this._legendOptions["font"])       { options["font"]      = this._legendOptions["font"]; }

        text.attr(options);
        return text;
    };

    this._drawLegendSquare = function(xCood, yCood, width, color) {
        var square = this._paper.rect(xCood, yCood, width, width, 0);
        square.attr({
            stroke: color,
            fill: color
        });
        return square;
    };

    this._drawLegend = function() {
        var rectHeight = 20,
            rectWidth  = 20,
            rectYAxis  = (this._radius * 2) + (this._strokeWidth) + rectHeight + 20,
            rectXAxis  = 10,
            textXAxis  = rectXAxis + rectWidth + 20;
            startYAxis = rectYAxis,
            startXAxis = rectXAxis,
            withinBounds = false;

        var paperHeight = this._paper.height,
            paperWidth  = this._paper.width;

        var maxLegendWidth = 0;

        withinBounds = ( (rectYAxis + rectHeight) <= paperHeight );

        for(var i=0, length=this._columns.length; (i < length) && withinBounds; i++){
            var color = this._columns[i].color,
                label = this._columns[i].label;

            var square = this._drawLegendSquare(rectXAxis, rectYAxis, rectWidth, color);

            textXAxis = rectXAxis + rectWidth + 10;
            var text = this._drawLegendText(textXAxis, (rectYAxis + 10), label);
            if ((text.getBBox().x2 - rectXAxis) > maxLegendWidth) {
                maxLegendWidth = (text.getBBox().x2 - rectXAxis);
            }

            rectYAxis = rectYAxis + rectHeight + 10;
            if ( (rectYAxis + rectHeight) <= paperHeight ) {
                withinBounds = true;
            }
            else if ((rectXAxis + maxLegendWidth + maxLegendWidth) <= paperWidth) {
                withinBounds = true;
                rectYAxis = startYAxis;
                rectXAxis = rectXAxis + maxLegendWidth + 10;
                maxLegendWidth = 0;
            }
            else {
                withinBounds = false;
            }
        }
    };

    this._addPercentagesToColumns();
    this._addCustomAttributes();
    this._drawText();
    this._drawArcs();
    this._animateArcs();

    if (this._legendOptions.visible) {
      this._drawLegend();
    }
};
