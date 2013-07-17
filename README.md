###Overview

A simple animated donut chart for [Raphaël JS](http://raphaeljs.com/). You can check out an example [here](http://jsfiddle.net/Osis/be6bE/6/light/).

###Usage

Include donut_chart.js in your header:
```html
<script src="http://yourdomain.com/donut_chart.js" type="text/javascript"></script>
```

Prepare some data:
```javascript
    var columns = [
        { value: 900, color: "#CFCFCF" },
        { value: 600, color: "#ACACAC" }, 
        { value: 400, color: "#B4DDFF" },
        { value: 100, color: "#91CCF7" },
        { value: 1000, color: "#60ABF0" }
    ]
    var text = "5.0"
```

Instantiate Raphael:
```javascript
  var paper = Raphael("canvas", 800, 800);
```

Create the donut:
```javascript
  new DonutChart(paper, columns, 80, "5.0");
```

###Roadmap
* Interface to update chart and animate to new values
* Text animations
* Improve arc animation efficiency
