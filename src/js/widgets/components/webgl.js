/*
* Module Name : widgets/components/webgl
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Tizen WebGL component for gallery3d
//>>label: WebGL
//>>group: Tizen:Widgets:Lib

define( [
	'license/MIT' 
	], function ( ) {

//>>excludeEnd("jqmBuildExclude");

( function ( $, undefined ) {
	$.webgl = {};

	$.webgl.shader = {
		_vertexShader: null,
		_fragmentShader: null,

		deleteShaders: function ( gl ) {
			gl.deleteShader( this._vertexShader );
			gl.deleteShader( this._fragmentShader );
		},

		addShaderProgram : function ( gl, vs, fs, isFile ) {
			var shaderProgram,
				vertexShaderSource = {},
				fragmentShaderSource = {};

			if ( isFile ) {
				vertexShaderSource = this.loadShaderFile( vs );
				fragmentShaderSource = this.loadShaderFile( fs );
			} else {
				vertexShaderSource.source = vs;
				fragmentShaderSource.source = fs;
			}

			this._vertexShader = this.getShader( gl, gl.VERTEX_SHADER, vertexShaderSource );
			this._fragmentShader = this.getShader( gl, gl.FRAGMENT_SHADER, fragmentShaderSource );

			shaderProgram = gl.createProgram();
			gl.attachShader( shaderProgram, this._vertexShader);
			gl.attachShader( shaderProgram, this._fragmentShader);
			gl.linkProgram( shaderProgram );

			if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ) {
				window.alert( "Could not initialize Shaders!" );
			}
			return shaderProgram;
		},

		loadShaderFile : function ( path ) {
			var cache = null;
			$.ajax({
				async : false,
				url : path,
				success : function ( result ) {
					cache = {
						source: result
					};
				}
			});
			return cache;
		},

		getShader: function ( gl, type, script ) {
			var shader;

			if ( !gl || !type || !script ) {
				return null;
			}

			shader = gl.createShader( type );

			gl.shaderSource( shader, script.source );
			gl.compileShader( shader );

			if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
				window.alert( gl.getShaderInfoLog( shader ) );
				gl.deleteShader( shader );
				return null;
			}
			return shader;
		}
	};

	$.webgl.buffer = {
		attribBufferData: function ( gl, attribArray ) {
			var attribBuffer = gl.createBuffer();

			gl.bindBuffer( gl.ARRAY_BUFFER, attribBuffer );
			gl.bufferData( gl.ARRAY_BUFFER, attribArray, gl.STATIC_DRAW );
			gl.bindBuffer( gl.ARRAY_BUFFER, null );

			return attribBuffer;
		}
	};

} ( jQuery ) );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
} );
//>>excludeEnd("jqmBuildExclude");
