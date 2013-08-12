define(['knockout', 'BaseControl', 'sprite'], function(ko, BaseControl, Sprite){
	function AnimationEditorPageControl(options, dataContext){
		this.constructor.__super__.call(this, dataContext);

		// console.log(sprite);


		this.dataContext(new AnimationModel());
		this.fps = ko.observable(10);
	}

	function SpriteModel(){
		this.id = ko.observable(1);
		this.name = ko.observable('Эффект рассеивания');
		this.graphicResource = ko.observable('http://jira.dev.playrooms.ru/secure/attachment/21204/sprite.png');
		// this.graphicResource = ko.observable('http://2.bp.blogspot.com/-mD_cX5gZNAE/TaO74Og4F7I/AAAAAAAAAio/umyTQmA7I80/s200/DawnWalkSide_Dict.png');
		this.frameStart = ko.observable(0);
		this.frameCount = ko.observable(15);
		this.frameWidth = ko.observable(92);
		this.frameHeight = ko.observable(83);
		this.rowsCount = ko.observable(1);
		this.colsCount = ko.observable(15);
		this.time = ko.observable();

	}
	function AnimationModel(){
		this.id = ko.observable(1);
		this.name = ko.observable('Эффект рассеивания');
		this.startSprite = ko.observable();
		this.loopSprite = ko.observable(new SpriteModel());
		this.endSprite = ko.observable();
	}

	BaseControl.extend(AnimationEditorPageControl);
	return AnimationEditorPageControl;
});