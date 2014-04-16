/**
 * Functions to open sandbox
 *
 * Sandbox is used to provide developers with needed modules
 */

( function( window, document ) {
    'use strict';

	/**
     * Public object
     * @type {object}
     */
    /**
     * Internal object cache
     * @type {object}
     */
    var wa = {},
        globalModules = {};

    /**
     * Merge the contents of two objects into the first object
	 *
	 * ex)	var publicNamespace = { PublicNS : "MyApp" };
	 * 	extend( window, publicNamespace ); ===> window.PublicNS
	 *
     * @param {Object} target Target object
     * @param {Object} source Source object
     * @return {Object} Target object.
     */

    function extend( target, source ) {
        var prop = null;
        for ( prop in source ) {

            if ( source.hasOwnProperty( prop )) {
  
                Object.defineProperty( target, prop, { value: source[prop] });
            }
        }
        return target;
    }

	/**
     * The function that handles definitions of modules.
     *
     * @param {object} module Module object.
     * @param {string} module.name Module name.
     * @param {array?} module.requires Module requires.
     * @param {function} module.def Module definititon.
     *
     * Examples:
     *
     * Define `foo` module:
     * define({
     *     name: 'foo',
     *     def: function () {}
     * });
     *
     * Define `foo` module which require `bar` module:
     * define({
     *     name: 'foo',
     *     requires: ['bar1', 'bar2'],
     *     def: function (b1, b2) {}
     * });
     *
     * Define `foo` module which require `bar1` and `bar2` module:
     * define({
     *     name: 'foo',
     *     requires: ['bar1', 'bar2'],
     *     def: function (require) {
     *         var bar1 = require['bar1'],
     *             bar2 = require['bar2'];
     *     }
     * });
     *
     */
	function define( module ) {
        var i = 0,
            j = 0;

        module = module || {};
        console.log('define:' + module.name);

        if (module.name === undefined || module.def === undefined) {
            throw new Error( 'Module must have name and definititon' );
			// 리턴 넣어야하나?
			return;
        }

        if (globalModules[module.name] !== undefined &&
                globalModules[module.name].name !== undefined) {
            throw new Error( 'Module "' + module.name + '" is already defined' );
			// 리턴 넣어야하나?
			return;
        }

        globalModules[module.name] = module.def;


		// 종속 모듈이 있을땐,
		// requireModules.모듈네임들 을 def의 인자로 넘겨서 return 해주는 객체 또는 함수를
		// module.name 으로 준다

		if( module.requires ) {

			var length = module.requires.length,
				requireModules = {};

			for( var i=0, requireM; requireM = module.requires[ i ]; i++ )
			{
				if( !globalModules[ requireM ] ) {
					console.error( "요청한 모듈이 없습니다" );
					return;
				}

				// 여기서 종속의 종속 모듈을 리커시브 하게 돌면서 다 넣어줘야해
				requireModules[ requireM ] = globalModules[ requireM ];
			}
			var newFun = schonfinkelize( module.def, requireModules );
			globalModules[module.name] = (newFun());
			globalModules[module.name].isRequires = true;
		} else {
			globalModules[module.name] = module.def;
		}

        return true;
    }

	function schonfinkelize( fn ) {
		var slice = Array.prototype.slice,
			stored_args = slice.call( arguments, 1 );

		return function() {
			var new_args = slice.call( arguments ),
				args = stored_args.concat( new_args );

			return fn.apply( null, args );
		};
	}

	/*
	 * 종속 모듈 있는 경우 구현해야함
	 */
	/*
    function getRequiresModules( mArr, arrWillCalled ) {

		var result;
		obj[ ck

		for( var i=0, m; m = mArr[ i ]; i++ ) {

			if( globalModules[m].isRequires ) getRequiresModules( m.requires, obj );

		}
		return {};
	}
	*/

    function Sandbox() {

		var args = Array.prototype.slice.call( arguments ),
			callback = args.pop(),
			localModules = ( args[0] && typeof args[0] === "string" ) ? args : args[0];

//		console.log( globalModules );

		if( !( this instanceof Sandbox )) {
			return new Sandbox( localModules, callback );
		}
		var length = localModules.length;

		if( !localModules || localModules === '*' || localModules[0] === '*' ) {
			localModules = [];

//			console.log( "*" );

			for( var i in Sandbox.localModules ) {

				if( Sandbox.localModules.hasOwnProperty( i )) {
					localModules.push( i );
				}
			}
		}

		/*
		else {
			
			// 종속모듈 검사
			for( var k = 0; k < length; k += 1 ) {

				if( globalModules[ localModules[ k ] ].isRequires ) 
					addRequiresModules( Sandbox.module,  );

				Sandbox.modules[ localModules[k] ] = globalModules[ localModules[k] ];
			}

		}
		*/

		Sandbox.modules = {};
		for( var j = 0; j < length; j += 1 ) {
			if( !globalModules[ localModules[ j ] ] ) {
				console.error( "Can not find '"+localModules[j]+"' Module!" );
				return;
			}
			Sandbox.modules[ localModules[j] ] = globalModules[ localModules[j] ];
//			console.log( Sandbox.modules );
		}

		if( !callback ) {
			console.error( "'callback' function is undefined" );
			return;
		}
		callback( Sandbox.modules );
	}

	Sandbox.modules = {};
	Sandbox.prototype = {
		name: "MyApplication",
		version: "1.0",
		getInfo: function() {
			return this.name + " : " + this.version;
		}
	};

    wa = {
		define: define,
        WatchOnSandbox: Sandbox,
        modules: globalModules
    };

    extend( window, wa );

}(window, document));
