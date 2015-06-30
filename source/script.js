(function($, window, undefined){

	"use strict";

	var images, Images = function() {
		images = this;
		this.initalized();
	};
	Images.prototype = {
		initalized: function() {
			// 変数定義
			this.canvas = $('#canvas')[0];
			this.context = canvas.getContext('2d');
			this.image = new Image();
			this.image.onload = $.proxy(this.onloadImage, this);
			this.reader = new FileReader();
			this.reader.onload = $.proxy(this.onloadReader, this);
			this.file = null;

			// jQueryイベント
			$(document)
				.on('change', '#file', $.proxy(this.changeFile, this))
				.on('click', '#canvas', $.proxy(this.getColorClick, this));
		},
		// ---------------------------------------------------------------------------------------------
		// FileReader().onload
		// ---------------------------------------------------------------------------------------------
		onloadReader: function(file) {
			console.log('#### onloadReader ####');
			var dataUrl = file.target.result;
			this.image.src = dataUrl;
		},
		// ---------------------------------------------------------------------------------------------
		// Image().onload
		// ---------------------------------------------------------------------------------------------
		onloadImage: function() {
			console.log('#### onloadImage ####');
			// 画像のサイズを変更
			this.canvas.width = this.image.width;
			this.canvas.height = this.image.height;
			// 画像を描画
			this.context.drawImage(this.image, 0, 0);
		},
		// ---------------------------------------------------------------------------------------------
		// [jq] 入力ファイルの変更
		// ---------------------------------------------------------------------------------------------
		changeFile: function(event) {
			console.log('#### changeFile ####');
			// ファイルを読み込み
			this.file = event.target.files[0];
			console.log(this.file);
			// canvas上に描画
			this.reader.readAsDataURL(this.file);
		},
		// ---------------------------------------------------------------------------------------------
		// ---------------------------------------------------------------------------------------------
		getColorClick: function(event) {
			var pos = $('#canvas').position();
			var x = event.pageX - pos.left;
			var y = event.pageY - pos.top;
			var color = this.getPixelColor(x, y);
			var luminance = this.getLuminance(color);
			console.log({color: color, luminance: luminance});
		},
		// ---------------------------------------------------------------------------------------------
		// 画素値の取得
		// ---------------------------------------------------------------------------------------------
		getPixelColor: function(x, y) {
			var pixel = this.context.getImageData(x, y, 1, 1);
			var color = { r: pixel.data[0], g: pixel.data[1], b: pixel.data[2] };
			return color;
		},
		// ---------------------------------------------------------------------------------------------
		// 輝度の取得
		// ---------------------------------------------------------------------------------------------
		getLuminance: function(color) {
			var luminance = Math.floor(0.298912 * color.r + 0.586611 * color.g + 0.114478 * color.b);
			return luminance;
		}
	};

	$(document).ready(function($) {
			new Images();
	});

})(jQuery, window, undefined);