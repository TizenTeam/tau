#!/usr/bin/python
# author koeun.choi@samsung.com
# This script processes packaging for all directories under "demos" into web-apps.

import os, sys, shutil

def changeIndexFile():
	filename = "index.html"
	f = open(filename)
	before = f.read()
	f.close()
	after = before.replace("../../build/tizen-web-ui-fw", "tizen-web-ui-fw")
	f = open(filename, "w")
	f.write(after)
	f.close()


def addConfigFileAndIcon(webAppName):
	# config.xml file
	shutil.copy("../../src/template/wac/config.xml.in", "config.xml")
	f = open("config.xml")
	config = f.read()
	f.close()
	config = config.replace("templateID", webAppName)
	config = config.replace("@APP_NAME@", webAppName)
	f = open("config.xml", "w")
	f.write(config)
	f.close()
	# icon.png
	shutil.copy("../../src/template/wac/icon.png", "icon.png")

def makeWebAppPackage(directory):
	os.chdir(directory)
	webAppName = directory.replace("pkged-demo-apps/", "")
	changeIndexFile()
	# copy tizen-web-ui-fw lib
	shutil.copytree("../../build/tizen-web-ui-fw", "tizen-web-ui-fw")
	#add meta files for packaging
	addConfigFileAndIcon(webAppName)
	# zip dirs...
	print "making " + webAppName + ".wgt ...."
	os.system("zip -r ../" + webAppName + ".wgt ." )
	os.chdir("../")


def search(dirname):
	flist = os.listdir(dirname)
	os.chdir(dirname)
	for f in flist:
		print "current path: " + os.getcwd()
		if os.path.isdir(f):
			print "web app name :" + f
			makeWebAppPackage(f)
		else:
		 ext = os.path.splitext(f)[-1]
		 if ext != ".wgt":
			print "not directory :" + f

		# remove redundant generated files
		print "Remove redundant generated files while processing...."
		os.system("rm -rf " + f)

print "##############################"
print "It will generate demo apps(wgt) packages under demos directory"

os.system("rm -rf pkged-demo-apps")
shutil.copytree("demos", "pkged-demo-apps")
search("pkged-demo-apps")

print ""
print "Packaged demo apps are generated successfully in [pkged-demo-apps]"
print "##############################"
