#!/usr/bin/python
# author Youmin Ha <youmin.ha@samsung.com>
# author Heeju Joo <heeju.joo@samsung.com>
# This script is used for update latest TAU library to SDK samples git
# If you have any problem with this script, please contact Heeju Joo <heeju.joo@samsung.com>
import os, sys, subprocess, shutil, fileinput
import xml.etree.ElementTree as ET

cwd=os.getcwd()
tempdir=cwd+"/_temp"
gitaccount=""
tauVersion=""
FILE_VERSION = "version.txt"
FILE_SPEC = "./packaging/web-ui-fw.spec"
FILE_XML = "./description.xml"

if(len(sys.argv) > 1):
	gitaccount=sys.argv[1]

if "" == gitaccount:
	print("No git account is given")
	sys.exit(1)


def cmd(command):
	return subprocess.call(command.split())

class Git:
	addr=""
	branch=""

class SrcDest:
	def __init__(self, pathFrom, pathTo):
		self.src=pathFrom
		self.dest=pathTo

class Job:
	def __init__(self, srcgit, destgit, fromtolist, preprocess, postprocess):
		self.srcgit=srcgit
		self.destgit=destgit
		self.fromtolist=fromtolist
		self.preprocess = preprocess
		self.postprocess = postprocess

# Git info
class webuifw(Git):
	addr="168.219.209.56:29418/framework/web/web-ui-fw"
	branch="devel/tizen_2.4"

class MobileUIComponent(Git):
	addr="168.219.209.56:29418/apps/mobile/web/sample/tizen-winset"
	branch="tizen_2.4"

class TizenGlobalize(Git):
	addr="168.219.209.56:29418/apps/mobile/web/sample/tizen-globalize"
	branch="tizen_2.4"

class TAUMasterDetail(Git):
	addr="168.219.209.56:29418/apps/mobile/web/template/tau-master-detail"
	branch="tizen_2.4"

class TAUMultiPage(Git):
	addr="168.219.209.56:29418/apps/mobile/web/template/tau-multi-page"
	branch="tizen_2.4"

class TAUNavigationView(Git):
	addr="168.219.209.56:29418/apps/mobile/web/template/tau-navigation-view"
	branch="tizen_2.4"

class TAUSinglePage(Git):
	addr="168.219.209.56:29418/apps/mobile/web/template/tau-single-page"
	branch="tizen_2.4"

class WearableUIComponent(Git):
	addr="168.219.209.56:29418/apps/wearable/web/sample/wearable-widget-sample"
	branch="tizen_2.4"

class TAUBasic(Git):
	addr="168.219.209.56:29418/apps/wearable/web/template/tau-basic"
	branch="tizen_2.4"

class TAUList(Git):
	addr="168.219.209.56:29418/apps/wearable/web/template/tau-list"
	branch="tizen_2.4"

class TAUAnimation(Git):
	addr="168.219.209.56:29418/apps/wearable/web/sample/tizen-animation"
	branch="tizen_2.4"

# job list
jobs = {
	"mobile": Job(
		webuifw,
		[MobileUIComponent, TizenGlobalize, TAUMasterDetail, TAUMultiPage, TAUNavigationView, TAUSinglePage],
		[
			SrcDest("web-ui-fw/tau/demos/SDK/mobile/UIComponents", "tizen-winset/project"),
			SrcDest("web-ui-fw/tau/dist/mobile", "tizen-winset/project/lib/tau"),
			SrcDest("web-ui-fw/tau/dist/mobile", "tizen-globalize/project/lib/tau/mobile"),
			SrcDest("web-ui-fw/tau/demos/SDK/mobile/MasterDetail", "tau-master-detail/project"),
			SrcDest("web-ui-fw/tau/dist/mobile", "tau-master-detail/project/lib/tau"),
			SrcDest("web-ui-fw/tau/demos/SDK/mobile/MultiPage", "tau-multi-page/project"),
			SrcDest("web-ui-fw/tau/dist/mobile", "tau-multi-page/project/lib/tau"),
			SrcDest("web-ui-fw/tau/demos/SDK/mobile/NavigationView", "tau-navigation-view/project"),
			SrcDest("web-ui-fw/tau/dist/mobile", "tau-navigation-view/project/lib/tau"),
			SrcDest("web-ui-fw/tau/demos/SDK/mobile/SinglePage", "tau-single-page/project"),
			SrcDest("web-ui-fw/tau/dist/mobile", "tau-single-page/project/lib/tau")
		], ["cd web-ui-fw/tau", "npm install", "grunt build"],
		[
			SrcDest("web-ui-fw/tau/dist/VERSION", "tizen-winset/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/tau/dist/LICENSE.Flora", "tizen-winset/project/lib/tau/LICENSE.MIT"),
			SrcDest("web-ui-fw/tau/dist/VERSION", "tizen-globalize/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/tau/dist/LICENSE.Flora", "tizen-globalize/project/lib/tau/LICENSE.MIT"),
			SrcDest("web-ui-fw/tau/dist/VERSION", "tau-master-detail/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/tau/dist/LICENSE.Flora", "tau-master-detail/project/lib/tau/LICENSE.Flora"),
			SrcDest("web-ui-fw/tau/dist/VERSION", "tau-multi-page/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/tau/dist/LICENSE.Flora", "tau-multi-page/project/lib/tau/LICENSE.Flora"),
			SrcDest("web-ui-fw/tau/dist/VERSION", "tau-navigation-view/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/tau/dist/LICENSE.Flora", "tau-navigation-view/project/lib/tau/LICENSE.Flora"),
			SrcDest("web-ui-fw/tau/dist/VERSION", "tau-single-page/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/tau/dist/LICENSE.Flora", "tau-single-page/project/lib/tau/LICENSE.Flora")
		]),
	"wearable": Job(
		webuifw,
		[WearableUIComponent, TAUBasic, TAUList, TAUAnimation],
		[
			SrcDest("web-ui-fw/tau/demos/SDK/wearable/UIComponents", "wearable-widget-sample/project"),
			SrcDest("web-ui-fw/tau/dist/wearable", "wearable-widget-sample/project/lib/tau"),
			SrcDest("web-ui-fw/tau/demos/SDK/wearable/Basic", "tau-basic/project"),
			SrcDest("web-ui-fw/tau/dist/wearable", "tau-basic/project/lib/tau"),
			SrcDest("web-ui-fw/tau/demos/SDK/wearable/List", "tau-list/project"),
			SrcDest("web-ui-fw/tau/dist/wearable", "tau-list/project/lib/tau"),
			SrcDest("web-ui-fw/tau/demos/SDK/wearable/Animation", "tizen-animation/project"),
			SrcDest("web-ui-fw/tau/dist/wearable", "tizen-animation/project/lib/tau"),
			SrcDest("web-ui-fw/tau/dist/animation", "tizen-animation/project/lib/tau/animation")
		], ["cd web-ui-fw/tau", "npm install", "grunt build"],
		[
			SrcDest("web-ui-fw/tau/dist/VERSION", "wearable-widget-sample/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/tau/dist/LICENSE.Flora", "wearable-widget-sample/project/lib/tau/LICENSE.MIT"),
			SrcDest("web-ui-fw/tau/dist/VERSION", "tau-basic/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/tau/dist/LICENSE.Flora", "tau-basic/project/lib/tau/LICENSE.MIT"),
			SrcDest("web-ui-fw/tau/dist/VERSION", "tau-list/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/tau/dist/LICENSE.Flora", "tau-list/project/lib/tau/LICENSE.MIT"),
			SrcDest("web-ui-fw/tau/dist/VERSION", "tizen-animation/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/tau/dist/LICENSE.Flora", "tizen-animation/project/lib/tau/LICENSE.MIT")
		])
}

def cloneGit(git, targetdir):
	cwd=os.getcwd()
	os.chdir(targetdir)

	localpath=os.path.basename(git.addr)

	if not os.path.isdir(localpath):
		cmd("git clone ssh://"+gitaccount+"@"+git.addr)
		os.chdir(localpath)
		cmd("git fetch origin "+git.branch+":"+git.branch)
		cmd("git checkout "+git.branch)
	else:
		pass
		os.chdir(localpath)
		cmd("git fetch origin")
		cmd("git checkout "+git.branch)
		cmd("git rebase origin/"+git.branch)

	cmd("cp ../../../commit-msg .git/hooks/")
	os.chdir(cwd)

def pushGit(targetdir, tauVersion):
	cwd=os.getcwd()
	os.chdir(targetdir)

	# get SDK Sample project Name from xml file
	tree = ET.parse(FILE_XML)
	root = tree.getroot()
	projectName = root.find('SampleName').text

	# make commit and push to gerrit
	cmd("git add -A")
	logmsg = projectName.replace(" ", "") + "-TAU(" + tauVersion + ")release"

	cmd("git commit -m " + logmsg)
	cmd("git push origin HEAD:refs/for/tizen_2.4")

	os.chdir(cwd)

def main():
	global tempdir

	if os.path.isdir(tempdir):
		cmd("rm -rf "+tempdir)
	os.mkdir(tempdir)
	os.chdir(tempdir)

	for k in sorted(jobs.keys()):
		print("Run job: %s"%(k))
		jobdir = tempdir + "/" + k
		os.mkdir(jobdir)
		os.chdir(jobdir)
		job = jobs[k]

		# Clone TAU git
		cloneGit(job.srcgit, jobdir)
		# Clone src and dest git
		for git in job.destgit:
			cloneGit(git, jobdir)

		# Preprocess
		if job.preprocess:
			for c in job.preprocess:
				if c.split()[0] == "cd":
					os.chdir(c.split()[1])
				else:
					cmd(c)
			os.chdir(jobdir)

		# update all dirs
		os.chdir(jobdir)
		for srcdest in job.fromtolist:
			srcdir = srcdest.src
			destdir = srcdest.dest
			print("copy %s* to %s"%(srcdir, destdir))
			if os.path.islink( destdir.replace("\\", "")):
				os.remove( destdir.replace("\\", "") )
				destdir = os.path.join(destdir, k)
			elif os.path.isdir( destdir.replace("\\", "")):
				shutil.rmtree(destdir.replace("\\", ""))
			elif not os.path.exists(destdir.replace("\\", "")):
				destdir = destdir
			else:
				desttemp = os.path.abspath(os.path.join(os.path.abspath(destdir), ".."))
				os.remove( desttemp.replace("\\", "") )
			shutil.copytree( srcdir.replace("\\", ""), destdir.replace("\\", ""), symlinks=True, ignore=shutil.ignore_patterns('.project', '.rds_delta', '.sdk_delta.info', '.sign', '.tproject'))

		os.chdir(jobdir)
		if job.postprocess:
			for srcdest in job.postprocess:
				srcdir = srcdest.src
				destdir = srcdest.dest
				print("copy %s to %s"%(srcdir, destdir))
				shutil.copy(srcdir, destdir)

		#get TAU version
		os.chdir(os.path.basename(job.srcgit.addr))
		for linenum, line in enumerate( fileinput.FileInput(FILE_SPEC)):
			if linenum==1:
				versionLine = line.split("    ")
				tauVersion = versionLine[1]
				break
		print("tau version %s"%(tauVersion))

		#remove unnecessary dir
		os.chdir(jobdir)
		cmd("rm -rf web-ui-fw")

		#make commit and push to gerrit
		projectdir = os.listdir(jobdir)
		for project in projectdir:
			pushGit(project, tauVersion.strip())

		os.chdir(tempdir)
	os.chdir(cwd)
if __name__ == "__main__":
	main()
