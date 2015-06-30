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
			this.originData = null;
			this.image = new Image();
			this.image.onload = $.proxy(this.onloadImage, this);
			this.reader = new FileReader();
			this.reader.onload = $.proxy(this.onloadReader, this);
			this.file = null;

			// jQueryイベント
			$(document)
				.on('change', '#file', $.proxy(this.changeFile, this))
				.on('click', '#canvas', $.proxy(this.getColorClick, this))
				.on('click', '#reset', $.proxy(this.renderOriginalImage, this))
				.on('click', '#brightness', $.proxy(this.renderGrayScale, this, 'brightness'))
				.on('click', '#saturation', $.proxy(this.renderGrayScale, this, 'saturation'))
				.on('click', '#average', $.proxy(this.renderGrayScale, this, 'average'));
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
			this.originData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
		},
		// ---------------------------------------------------------------------------------------------
		// [jq] 入力ファイルの変更
		// ---------------------------------------------------------------------------------------------
		changeFile: function(event) {
			console.log('#### changeFile ####');
			// ファイルを読み込み
			this.file = event.target.files[0];
			console.log(this.file);
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
			console.log(color);
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
			// NTSC加重平均
			var luminance = Math.floor(0.298912 * color.r + 0.586611 * color.g + 0.114478 * color.b);
			return luminance;
		},
		// ---------------------------------------------------------------------------------------------
		// 彩度の取得
		// ---------------------------------------------------------------------------------------------
		getSaturation: function(color) {
			var max = Math.max(color.r, color.g, color.b);
			var min = Math.min(color.r, color.g, color.b);
			var saturation = (max + min) / 2;
			return saturation;
		},
		// ---------------------------------------------------------------------------------------------
		// RGBの平均値
		// ---------------------------------------------------------------------------------------------
		getAverage: function(color) {
			var average = Math.floor((color.r + color.g + color.b) / 3)
			return average;
		},
		// ---------------------------------------------------------------------------------------------
		// 元の画像を表示
		// ---------------------------------------------------------------------------------------------
		renderOriginalImage: function() {
			if ( this.originData !== null ) {
				this.context.putImageData(this.originData, 0, 0);
			}
		},
		// ---------------------------------------------------------------------------------------------
		// グレースケール化
		// ---------------------------------------------------------------------------------------------
		renderGrayScale: function(mode) {
			// 新しく作る画像の準備
			var create = this.context.createImageData(this.canvas.width, this.canvas.height);
			// 今描画している画像のデータを取得
			// var origin = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
			var origin = this.originData;
			var get = null;
			switch(mode) {
				// 輝度
				case 'brightness':
					get = this.getLuminance;
					break;
				// 彩度	
				case 'saturation':
					get = this.getSaturation;
					break;
				// 単純平均法
				case 'average':
					get = this.getAverage;
					break;
				default:
					get = this.getLuminance;
					break;
			}
			for( var i = 0; i < origin.data.length/4; i++ ) {
				var p = i*4;
				// 輝度値を取得
				var luminance = get({ r: origin.data[p], g: origin.data[p+1], b: origin.data[p+2] });
				// 冗長だが Uint8ClampedArray に対して push() は出来ないようだ
				create.data[p+0] = luminance;
				create.data[p+1] = luminance;
				create.data[p+2] = luminance;
				create.data[p+3] = 255;
			}
			this.context.putImageData(create, 0, 0);
		}
	};

	$(document).ready(function($) {
		new Images();
	});

})(jQuery, window, undefined);