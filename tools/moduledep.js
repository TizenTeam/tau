#!/usr/bin/env node
/*
 * moduledep.js
 *
 * Read dependency info from a file, and get dependency tree/library load order 
 * from the dependency info of all files
 *
 * ***************************************************************************
 * Copyright (c) 2013 Samsung Electronics Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
 * Authors: Youmin Ha <youmin.ha@samsung.com>
*/

var util = require("util"),
	assert = require("assert"),
	path = require("path"),
	vm = require("vm"),
	fs = require("fs"),
	child_process = require('child_process'),
	puts = util.puts,
	error = util.error,
	print = util.print;

path.sep = path.sep ? path.sep : '/';

function DepInfo( fPath, basedir ) {
	var self = this,
		code,
		context,
		origDir,
		linebuf,
		line;

	function define( depModList, moduleBody ) {
		var p, i;
		if ( typeof depModList == 'object' ) {
			for( i in depModList ) {
				p = path.join( path.dirname( self.filePath() ), depModList[i] );
				self.depends.push( path.normalize( p, '.js' ) );
			}
		}
	}

	origDir = path.resolve();	// Backup origDir

	if ( ! basedir || ! basedir.length ) {
		basedir = ".";
	}
	process.chdir( basedir );	// Move to basedir
	self.basedir = path.resolve( );		//self.basedir: absolute path.
	self.path = path.normalize( fPath );
	self.name = path.join( path.dirname( self.path ), path.basename( self.path, '.js' ) );
	self.depends = [ ];
	self.label = '';
	self.group = '';
	self.description = '';

	try {
		code = fs.readFileSync( self.path, 'utf-8' );
		linebuf = code.split( /\n\r?/ );
		for( var idx in linebuf ) {
			line = linebuf[idx];
			if( line.match( /^\/\/>>label:/ ) ) {
				self.label = line.replace( /^\/\/>>label:(.*)$/, "$1" ).trim();
			}
			if( line.match( /^\/\/>>group:/ ) ) {
				self.group = line.replace( /^\/\/>>group:(.*)$/, "$1" ).trim();
			}
			if( line.match( /^\/\/>>description:/ ) ) {
				self.description = line.replace( /^\/\/>>description:(.*)$/, "$1" ).trim();
			}
		}
		context = vm.createContext( { define: define } );
		vm.runInContext( code, context );	// Set depends
	} catch ( e ) {
		// file read failure
		//error(e);
		return null;
	} finally {
		process.chdir( origDir );	// Back to origDir
	}
}
DepInfo.prototype = {
	fullPath: function ( ) {
		return path.normalize( path.join( this.basedir, this.path ) );
	},
	filePath: function ( ) {
		return path.relative( this.basedir, this.fullPath() );
	}
}

function DepTree( ) {
	return this;
}
DepTree.prototype = {
	_depData: { },

	// Set basedir(s)
	setBasedir: function ( ) {
		this.basedir = arguments[0];
	},

	// Add dependency data from file at the path
	// @param[in]	fPath	module file's path
	// @return	true if collection is successful, false if not
	add: function ( fPath ) {
		var di;

		di = new DepInfo( fPath, this.basedir );
		if ( di ) {
			this._depData[ di.name ] = di;
		} else {
			return false;
		}
		return true;
	},
	depData: function ( ) {
		return this._depData;
	},
	order: function ( reqList ) {
		var self = this,
			depData = {},
			order = [],
			pool = [],
			mName,	// current module name
			mDep,	// current module's dependency (array)
			depIdx,
			i, j;

		if( ! reqList ) {
			reqList = Object.keys( self._depData );
		}

		// copy _depData into pool & depData
		for( j=0; j<reqList.length; j++ ) {
			modName = reqList[j];
			pool.push( modName );
			depData[ modName ] = [];
			for( i in self._depData[ modName ].depends ) {
				// deep copy
				depData[ modName ][i] = self._depData[ modName ].depends[i];

				// Still not exist in the reqList, add it
				if( reqList.indexOf( depData[ modName ][i] ) == -1 ) {
					//error("NOT found! " + depData[ modName ][i] );
					reqList.push( depData[ modName ][i] );
				}
			}
		};

		// Mark and sweep
		while( pool.length > 0 ) {
			// Sort pool with remained dependency
			pool.sort( function ( a, b ) {
				var la, lb;
				la =  depData[ a ] ? depData[ a ].length : 0;
				lb =  depData[ b ] ? depData[ b ].length : 0;
				return la - lb;
			} );

			// Sweep
			mName = pool.shift();	// Pop a module name
			order.push( mName );	// Add first module to the order (Don't consider whether depData[mName].length == 0.

			// and Mark
			for( i = 0; i < pool.length; i++ ) {	// For all remained modules,
				mDep = depData[ pool[i] ];	// Get a dependency list
				depIdx = mDep.indexOf( mName );
				if ( depIdx != -1 ) {	// Found a dependency!
					mDep.splice( depIdx, 1 );	// Remove mName module
				}
			}
		}
		return order;
	},
	construct: function ( ) {
		var dd = this._depData,
			di,
			i, j, m;
		for( i in dd ) {
			di = dd[i];		// Get DependencyInfo
			for( j in di.depends ) {
				m = di.depends[ j ];	// Per dependent module,
				if ( ! dd[ m ] ) {		// if there is no module in depData,
					this.add( m );		// add it.
				}
			}
		}
	},
	import: function ( depData ) {
		var i;
		this._depData = depData;
	},
	printDepJSON: function ( ) {
		puts( JSON.stringify( this._depData, null, '\t' ) );
	}
};

// Export modules
module.exports.DepInfo = DepInfo;
module.exports.DepTree = DepTree;

// main module
function main( argv ) {
	var option = argv[2],
		val = argv[3];

	switch( option ) {
		case '-c':
			createDepInfo( val );
			break;
		case '-d':
			calculateDepOrder( val, argv[4], argv[5] );
			break;
		default:
			usage();
	}

	function usage() {
		error("Usage: " + path.basename( argv[1] ) + " [option] [argument]" );
		error("       " + path.basename( argv[1] ) + " -c [module directory path] : Create a dependency data" );
		error("       " + path.basename( argv[1] ) + " -d [module directory path] [depData.json path] [require file path]: Calculate a dependency order, and make a library" );
		process.exit();
	}

	function createDepInfo( basedir ) {
		var dt,
			origdir = path.resolve();	// Remember original dir

		if( ! basedir ) basedir = '.';

		dt = new DepTree();
		dt.setBasedir( basedir );

		child_process.exec('find ' + basedir +  ' -name "*.js" -type f',
			function ( err, stdout, stderr ) {
				var fpathlist,
					fpath,
					i;

				if( err ) {
					error( 'Failure finding js files in ' + basedir );
					process.chdir( origdir );
					process.exit(1);
				}
				fpathlist = stdout.split(/\r?\n/);
				for( i in fpathlist ) {
					fpath = fpathlist[i];
					fpath =  path.relative( basedir, fpath );
					//puts(">> " + fpath + " ? " + fpath.match( /.*\.js$/ ) );
					if( fpath.match( /.*\.js$/ ) ) {
						dt.add( fpath );
					}
				}
				dt.construct();
				dt.printDepJSON();
			} );
	}

	function calculateDepOrder( modPath, depDataPath, requirePath ) {
		var dt = new DepTree(),
			depData,
			require = null,
			code,
			context,
			order,
			mod,
			i;

		function _require( depList ) {
			var i;
			for( i in depList ) {
				//dt.add( depList[i] );
				require.push( depList[i] );
			}
		}

		dt.setBasedir( modPath );

		if( path.basename( depDataPath ) == "depData.json" ) {
			code = fs.readFileSync( depDataPath, 'utf-8' );
			depData = JSON.parse( code );
			dt.import( depData );
		}
		if ( path.basename( requirePath ) == "require.js" ) {
			require = [];
			code = fs.readFileSync( requirePath, 'utf-8' );
			context = vm.createContext( { require: _require } );
			vm.runInContext( code, context );
		}

		dt.construct();
		order = dt.order( require );
		//error(order);


		for( i in order ) {
			mod = order[i];
			try {
				code = fs.readFileSync( path.join( modPath, mod + '.js' ) );
				puts(code);
			} catch( ex ) {
				if( ex.code != "ENOENT" ) {	// Ignore No entry(no file) error
					throw( ex );
				}
			}
		}
	}
}
if ( require.main === module ) main( process.argv );
