define(['knockout', 'BaseControl', 'sprite'], function(ko, BaseControl, Sprite){
	function AnimationEditorPageControl(options, dataContext){
		this.constructor.__super__.call(this, dataContext);

		// console.log(sprite);


		this.dataContext(new AnimationModel());
		this.fps = ko.observable(10);
	}

	function SpriteModel(){
		this.id = ko.observable(1);
		this.name = ko.observable('Walk');
		this.graphicResource = ko.observable('/assets/res/walk.png');
		this.frameStart = ko.observable(0);
		this.frameCount = ko.observable(16);
		this.frameWidth = ko.observable(50);
		this.frameHeight = ko.observable(50);
		this.rowsCount = ko.observable(4);
		this.colsCount = ko.observable(4);
		this.time = ko.observable();

	}
	function AnimationModel(){
		this.id = ko.observable(1);
		this.name = ko.observable('Walk');
		this.startSprite = ko.observable();
		this.loopSprite = ko.observable(new SpriteModel());
		this.endSprite = ko.observable();
	}

	BaseControl.extend(AnimationEditorPageControl);
	return AnimationEditorPageControl;
});