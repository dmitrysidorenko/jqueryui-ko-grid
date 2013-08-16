define(['knockout', 'BaseControl', 'extend'], function(ko, BaseControl, extend){

	function GameControl(options, dataContext){
		BaseControl.call(this, dataContext);

		this.map = new Map();
		this.mapBlueprint = [];
		this.win = ko.observable();

		this.applyBlueprint = function(bp){
			for (var i = 0; i < bp.length; i++) {
				var bpCell = bp[i];
				var cell = new Cell(bpCell.x, bpCell.y, this.map.cellWidth, this.map.cellHeight, bpCell.weight, this.map);
				this.map.add(cell);
			};
			this.map.counter(0);
			this.map.cells()[0].weight(0);
			var winCell = this.map.getCell(this.map.collsCount - 1, this.map.rowsCount - 1);
			winCell.weight.subscribe(function(val){
				if(val === 0){
					this.win({msg:"Победа за " + this.map.counter() + " шагов! Можешь попробовать еще раз на этом же раскладе или сыграть на новом."});
				}
			}, this);
		}.bind(this);

		this.createBp = function(){
			var bp = [];
			for(var x = 0; x < this.map.collsCount; x++){
				for (var y = 0; y < this.map.rowsCount; y++) {
					var weight = randomFromInterval(1,4);
					var cell = {
						x:x, y:y, weight:weight
					};
					bp.push(cell);
				};
			}			
			return bp;			
		}.bind(this);

		this.reset = function(){
			this.win(null);
			this.start();
		}.bind(this);

		this.replay = function(){
			this.win(null);
			this.map.cells([]);
			this.applyBlueprint(this.mapBlueprint);
			this.map.cells.valueHasMutated();
		}.bind(this);

		this.start = function(){
			this.map.cells([]);
			this.mapBlueprint = this.createBp();
			this.applyBlueprint(this.mapBlueprint);
			this.map.cells.valueHasMutated();
		}.bind(this);

		this.start();
	}

	extend(GameControl, BaseControl);

	function Map(){
		this.cells = ko.observableArray();
		this.collsCount = 21;
		this.rowsCount = 10;
		this.cellWidth = 46;
		this.cellHeight = 46;

		this.counter = ko.observable(0);

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
				if(currentWeight > 0){
					this.weight( currentWeight - 1 );
					map.counter(map.counter() + 1);
				}
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

	function randomFromInterval(from,to){
	    return Math.floor(Math.random()*(to-from+1)+from);
	}
	return GameControl;
});