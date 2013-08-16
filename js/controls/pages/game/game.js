define(['knockout', 'BaseControl', 'extend'], function(ko, BaseControl, extend){

	function GameControl(options, dataContext){
		BaseControl.call(this, dataContext);

		this.map = new Map();

		for(var x = 0; x < this.map.collsCount; x++){
			for (var y = 0; y < this.map.rowsCount; y++) {
				var weight = randomFromInterval(1,2);
				var cell = new Cell(x, y, this.map.cellWidth, this.map.cellHeight, weight, this.map);
				this.map.add(cell);
			};
		}

		this.map.cells()[0].weight(0);
		var winCell = this.map.getCell(this.map.collsCount - 1, this.map.rowsCount - 1);
		winCell.weight.subscribe(function(val){
			if(val === 0){
				alert('you won!');
			}
		}, this);
	
		function Map(){
			this.cells = ko.observableArray();
			this.collsCount = 20;
			this.rowsCount = 10;
			this.cellWidth = 50;
			this.cellHeight = 50;

			this.add = function(cell){
				var index = cell.y * this.collsCount + cell.x;
				this.cells()[index] = cell;
			};
			this.getCell = function(x, y){
				return this.cells()[ y*this.collsCount + x ];
			};
		}

		function Cell(x, y, w, h, weight, map){
			this.x = x;
			this.y = y;
			this.width = w;
			this.height = h;
			this.weight = ko.observable(weight);
			this.click = function(){
				var checkedCell = this.checkCell();
				if(checkedCell){
					var currentWeight = this.weight();
					this.weight( currentWeight > 0 ? currentWeight - 1 : 0 );
				}
			}.bind(this);

			this.checkCell = function(){
				if(this.weight() === 0){
					return true;
				}
				var neighbor = null;
				//virtical
				//y-1
				neighbor = map.getCell(this.x, this.y - 1);
				if(neighbor && neighbor.weight() === 0){
					return true;
				}
				neighbor = null;
				//y+1
				neighbor = map.getCell(this.x, this.y + 1);
				if(neighbor && neighbor.weight() === 0){
					return true;
				}
				neighbor = null;

				//horizontal
				//x-1
				neighbor = map.getCell(this.x - 1, this.y);
				if(neighbor && neighbor.weight() === 0){
					return true;
				}
				neighbor = null;
				//x+1
				neighbor = map.getCell(this.x + 1, this.y);
				if(neighbor && neighbor.weight() === 0){
					return true;
				}
				return false;
			}.bind(this);


			this.valid = ko.computed(function(){
				return this.checkCell();
			}, this);

		}

	}

	extend(GameControl, BaseControl);

	return GameControl;
});

function randomFromInterval(from,to)
{
    return Math.floor(Math.random()*(to-from+1)+from);
}