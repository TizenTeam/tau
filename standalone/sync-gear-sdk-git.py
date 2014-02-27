#!/usr/bin/python
import os, sys, subprocess, shutil


cwd=os.getcwd()
tempdir=cwd+"/_temp"
gitaccount=""


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
	def __init__(self, srcgit, destgit, fromtolist, preprocess):
		self.srcgit=srcgit
		self.destgit=destgit
		self.fromtolist=fromtolist
		self.preprocess = preprocess

# Git info
class webuifw(Git):
	addr="165.213.149.219:29418/magnolia/framework/web/web-ui-fw"
	branch="devel/webappfw/tizenw"

class webapp(Git):
	addr="slp-info.sec.samsung.net:29418/tizenw/sdk-web-apps"
	branch="w/master"

class sdk(Git):
	addr="121.133.176.96:29429/profile/tizenw/sdk/web-ide-resources"
	branch="gear_1.0"


# job list
jobs = {
	"1_template": Job(
		webuifw,
		sdk,
		[
			SrcDest("standalone/demos/TemplateBasic", "samples/web/Template/Tizen/Gear\ UI/Basic/project"),
			SrcDest("standalone/demos/TemplateList", "samples/web/Template/Tizen/Gear\ UI/List/project"),
			SrcDest("standalone/demos/GearWinsetTest", "samples/web/Sample/Tizen/Web\ App/GearWinsetTest/project")
		], None),
	"2_sampleapp": Job(
		webapp,
		sdk,
		[
			SrcDest("Calendar", "samples/web/Sample/Tizen/Web\ App/Calendar/project"),
			SrcDest("Camera", "samples/web/Sample/Tizen/Web\ App/Camera/project"),
			SrcDest("MediaControl", "samples/web/Sample/Tizen/Web\ App/MediaControl/project"),
			SrcDest("Pedometer", "samples/web/Sample/Tizen/Web\ App/Pedometer/project"),
			SrcDest("StopWatch", "samples/web/Sample/Tizen/Web\ App/StopWatch/project")
		], None),
	"3_gearui_sdk": Job(
		webuifw,
		sdk,
		[
			SrcDest("standalone/dist", "samples/web/Template/Tizen/Gear\ UI/Basic/project/lib/gear-ui"),
			SrcDest("standalone/dist", "samples/web/Template/Tizen/Gear\ UI/List/project/lib/gear-ui"),
			SrcDest("standalone/dist", "samples/web/Sample/Tizen/Web\ App/GearWinsetTest/project/lib/gear-ui"),
			SrcDest("standalone/dist", "samples/web/Sample/Tizen/Web\ App/Calendar/project/lib/gear-ui"),
			SrcDest("standalone/dist", "samples/web/Sample/Tizen/Web\ App/Camera/project/lib/gear-ui"),
			SrcDest("standalone/dist", "samples/web/Sample/Tizen/Web\ App/Pedometer/project/lib/gear-ui"),
			SrcDest("standalone/dist", "samples/web/Sample/Tizen/Web\ App/StopWatch/project/lib/gear-ui")
		], ["cd web-ui-fw/standalone", "npm install", "grunt"]),
	"4_gearui_webapp": Job(
		webuifw,
		webapp,
		[
			SrcDest("standalone/dist", "Calendar/lib/gear-ui"),
			SrcDest("standalone/dist", "Camera/lib/gear-ui"),
			SrcDest("standalone/dist", "DigitalAlarmLED/lib/gear-ui"),
			SrcDest("standalone/dist", "Evernote/lib/gear-ui"),
			SrcDest("standalone/dist", "QRCodeReader/lib/gear-ui"),
			SrcDest("standalone/dist", "ScanAndPlay/lib/gear-ui"),
			SrcDest("standalone/dist", "ShoppingList/lib/gear-ui"),
			SrcDest("standalone/dist", "TouchPaint/lib/gear-ui"),
			SrcDest("standalone/dist", "WatchOnWeb/lib/gear-ui"),
			SrcDest("standalone/dist", "Weather/lib/gear-ui"),
			SrcDest("standalone/dist", "MediaControl/lib/gear-ui"),
			SrcDest("standalone/dist", "Pedometer/lib/gear-ui"),
			SrcDest("standalone/dist", "Camera/lib/gear-ui"),
			SrcDest("standalone/dist", "StopWatch/lib/gear-ui"),
		], ["cd web-ui-fw/standalone", "npm install", "grunt"])

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
	cmd("cp ../../commit-msg .git/hooks/")
	os.chdir(cwd)


def main():
	global tempdir

	if os.path.isdir(tempdir):
		cmd("rm -rf "+tempdir)
	os.mkdir(tempdir)
	os.chdir(tempdir)

	for k in sorted(jobs.keys()):
		print("Run job: %s"%(k))
		job = jobs[k]

		# Clone src and dest git
		for git in [job.srcgit, job.destgit]:
			cloneGit(git, tempdir)

		# Preprocess
		if job.preprocess:
			for c in job.preprocess:
				if c.split()[0] == "cd":
					os.chdir(c.split()[1])
				else:
					cmd(c)
			os.chdir(tempdir)

		# update all dirs
		os.chdir(tempdir)
		for srcdest in job.fromtolist:
			srcdir = os.path.join(os.path.basename(job.srcgit.addr), srcdest.src)
			destdir = os.path.join(os.path.basename(job.destgit.addr), srcdest.dest)
			print("copy %s* to %s"%(srcdir, destdir))
			#cmd("cp -a %s/* %s/"%(srcdir, destdir))
			#cmd("rm -rf " + destdir)
			if os.path.isdir( destdir.replace("\\", "")):
				shutil.rmtree(destdir.replace("\\", ""))
			elif os.path.islink( destdir.replace("\\", "")):
				os.remove( destdir.replace("\\", "") )
			shutil.copytree( srcdir.replace("\\", ""), destdir.replace("\\", ""), symlinks=True)


	os.chdir(cwd)
if __name__ == "__main__":
	main()
