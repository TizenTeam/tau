#!/usr/bin/python
# author Youmin Ha <youmin.ha@samsung.com>
# author Heeju Joo <heeju.joo@samsung.com>
# This script is used for update latest TAU library to ide source and sdk-web-apps
# If you have any problem with this script, please contact author
import os, sys, subprocess, shutil, fileinput

cwd=os.getcwd()
tempdir=cwd+"/_temp"
gitaccount=""
tauVersion=""
FILE_VERSION = "version.txt"
FILE_SPEC = "./packaging/web-ui-fw.spec"

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
	branch="devel/tau"

class webapp(Git):
	addr="slp-info.sec.samsung.net:29418/tizenw/sdk-web-apps"
	branch="devel/webappfw/tizenw"

class sdkWearable(Git):
	addr="121.133.176.96:29429/profile/tizenw/sdk/web-ide-resources"
	branch="gear_1.0"

class sdkTizenWearable(Git):
	addr="121.133.176.49:29419/sdk/ide/profile/wearable/web-ide-resources"
	branch="tizen_2.3"

class sdkTizenMobile(Git):
	addr="121.133.176.49:29419/sdk/ide/profile/mobile/web-ide-resources"
	branch="tizen_2.3"

# job list
jobs = {
	"1_wearable_sdk": Job(
		webuifw,
		sdkWearable,
		[
			SrcDest("tau/demos/SDK/TemplateBasic", "samples/web/Template/Tizen/Wearable\ UI/Basic/project"),
			SrcDest("tau/demos/SDK/TemplateList", "samples/web/Template/Tizen/Wearable\ UI/List/project"),
			SrcDest("tau/demos/SDK/WearableWidgetSample", "samples/web/Sample/Tizen/Web\ App/WearableWidgets/project"),
			SrcDest("tau/dist/wearable", "samples/web/Template/Tizen/Wearable\ UI/Basic/project/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "samples/web/Template/Tizen/Wearable\ UI/List/project/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "samples/web/Sample/Tizen/Web\ App/WearableWidgets/project/lib/tau/wearable")
		], ["cd web-ui-fw/tau", "grunt build", "theme dist/wearable/theme blue"],
		[
			"samples/web/Sample/Tizen/Web\ App/Altimeter/project",
			"samples/web/Sample/Tizen/Web\ App/AnalogWatch/project",
			"samples/web/Sample/Tizen/Web\ App/Calendar/project",
			"samples/web/Sample/Tizen/Web\ App/Camera/project",
			"samples/web/Sample/Tizen/Web\ App/ClockWidget/project",
			"samples/web/Sample/Tizen/Web\ App/MediaControl/project",
			"samples/web/Sample/Tizen/Web\ App/Pedometer/project",
			"samples/web/Sample/Tizen/Web\ App/StopWatch/project",
			"samples/web/Sample/Tizen/Web\ App/VoiceRecorder/project",
			"samples/web/Sample/Tizen/Web\ App/WearableWidgets/project",
		]),
	"2_tizen_sdk_wearable_profile": Job(
		webuifw,
		sdkTizenWearable,
		[
			SrcDest("tau/demos/SDK/TemplateBasic", "addons/TAU/samples/web/Template/Tizen/Wearable\ UI/Basic/project"),
			SrcDest("tau/demos/SDK/TemplateList", "addons/TAU/samples/web/Template/Tizen/Wearable\ UI/List/project"),
			SrcDest("tau/demos/SDK/WearableWidgetSample", "addons/TAU/samples/web/Sample/Tizen/Web\ App/WearableWidgets/project"),
			SrcDest("tau/dist/wearable", "addons/TAU/samples/web/Template/Tizen/Wearable\ UI/Basic/project/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "addons/TAU/samples/web/Template/Tizen/Wearable\ UI/List/project/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "addons/TAU/samples/web/Sample/Tizen/Web\ App/WearableWidgets/project/lib/tau/wearable")
		], ["cd web-ui-fw/tau", "grunt build", "theme dist/wearable/theme brown"],
		[
			"samples/web/Sample/Tizen/Web\ App/AnalogWatch/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/Calendar/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/Camera/project",
			"samples/web/Sample/Tizen/Web\ App/ClockWidget/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/Pedometer/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/StopWatch/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/VoiceRecorder/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/WearableWidgets/project",
		]),
	"3_tizen_sdk_mobile_profile": Job(
		webuifw,
		sdkTizenMobile,
		[
			SrcDest("tau/demos/SDK/MobileWinset", "addons/TAU/samples/web/Sample/Tizen/Web\ App/TizenWinset/project"),
			SrcDest("tau/demos/SDK/Tizen_Web_UI_FW_MasterDetail", "addons/TAU/samples/web/Template/Tizen/Tizen\ Web\ UI\ Framework/Tizen_Web_UI_FW_MasterDetail/project"),
			SrcDest("tau/demos/SDK/Tizen_Web_UI_FW_MultiPage", "addons/TAU/samples/web/Template/Tizen/Tizen\ Web\ UI\ Framework/Tizen_Web_UI_FW_MultiPage/project"),
			SrcDest("tau/demos/SDK/Tizen_Web_UI_FW_NavigationView", "addons/TAU/samples/web/Template/Tizen/Tizen\ Web\ UI\ Framework/Tizen_Web_UI_FW_NavigationView/project"),
			SrcDest("tau/demos/SDK/Tizen_Web_UI_FW_SinglePage", "addons/TAU/samples/web/Template/Tizen/Tizen\ Web\ UI\ Framework/Tizen_Web_UI_FW_SinglePage/project"),
			SrcDest("tau/dist/mobile", "addons/TAU/samples/web/Sample/Tizen/Web\ App/TizenWinset/project/lib/tau/mobile"),
			SrcDest("tau/dist/mobile", "addons/TAU/samples/web/Template/Tizen/Tizen\ Web\ UI\ Framework/Tizen_Web_UI_FW_MasterDetail/project/lib/tau/mobile"),
			SrcDest("tau/dist/mobile", "addons/TAU/samples/web/Template/Tizen/Tizen\ Web\ UI\ Framework/Tizen_Web_UI_FW_MultiPage/project/lib/tau/mobile"),
			SrcDest("tau/dist/mobile", "addons/TAU/samples/web/Template/Tizen/Tizen\ Web\ UI\ Framework/Tizen_Web_UI_FW_NavigationView/project/lib/tau/mobile"),
			SrcDest("tau/dist/mobile", "addons/TAU/samples/web/Template/Tizen/Tizen\ Web\ UI\ Framework/Tizen_Web_UI_FW_SinglePage/project/lib/tau/mobile"),
		], ["cd web-ui-fw/tau", "grunt build"],
		[
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/BluetoothChat/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/CallLog/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/Chatter/project",
			"samples/web/Sample/Tizen/Web\ App/Compass/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/ContactsExchanger/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/EventManager/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/ExercisePlanner/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/FileManager/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/MediaContent/project",
			"samples/web/Sample/Tizen/Web\ App/NPRuntime/project",
			"samples/web/Sample/Tizen/Web\ App/Piano/project",
			"samples/web/Sample/Tizen/Web\ App/SelfCamera/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/SensorBall/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/SystemInfo/project",
			"addons/TAU/samples/web/Sample/Tizen/Web\ App/TizenWinset/project",
			"samples/web/Sample/Tizen/Web\ App/TouchPaint/project",
			"addons/TAU/samples/web/Sample/Tizen/Hybrid\ Application/HybridWebApp/project",
		]),
	"4_wearable_sdk_webapps": Job(
		webuifw,
		webapp,
		[
			SrcDest("tau/dist/wearable", "Altimeter/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "AppController/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "Calendar/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "Camera/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "DigitalAlarmLED/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "MediaControl/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "Evernote/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "QRCodeReader/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "ScanAndPlay/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "ShoppingList/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "SunburnMonitor/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "TouchPaint/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "Weather/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "Pedometer/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "StopWatch/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "WatchOnWeb/lib/tau/wearable"),
			SrcDest("tau/dist/wearable", "VoiceRecorder/lib/tau/wearable"),
		], ["cd web-ui-fw/tau", "grunt build"], None)
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

		# Clone src and dest git
		for git in [job.srcgit, job.destgit]:
			cloneGit(git, jobdir)

		# Preprocess
		if job.preprocess:
			for c in job.preprocess:
				if c.split()[0] == "cd":
					os.chdir(c.split()[1])
				elif c.split()[0] == "theme":
					dstlink = 'default'
					srclink = c.split()[2]
					os.chdir(c.split()[1])
					cmd('rm default')
					os.symlink(srclink, dstlink)
				else:
					cmd(c)
			os.chdir(jobdir)

		# update all dirs
		os.chdir(jobdir)
		for srcdest in job.fromtolist:
			srcdir = os.path.join(os.path.basename(job.srcgit.addr), srcdest.src)
			destdir = os.path.join(os.path.basename(job.destgit.addr), srcdest.dest)
			print("copy %s* to %s"%(srcdir, destdir))
			if os.path.isdir( destdir.replace("\\", "")):
				shutil.rmtree(destdir.replace("\\", ""))
			elif os.path.islink( destdir.replace("\\", "")):
				os.remove( destdir.replace("\\", "") )
			else:
				desttemp = os.path.abspath(os.path.join(os.path.abspath(destdir), '..'))
				os.remove( desttemp.replace("\\", "") )
			shutil.copytree( srcdir.replace("\\", ""), destdir.replace("\\", ""), symlinks=True)
		#update version
		os.chdir(jobdir)
		if job.postprocess:
			#update version in version.txt of projects
			for project in job.postprocess:
				projectdir = os.path.join(os.path.basename(job.destgit.addr), project)
				os.chdir(projectdir.replace("\ ", " "))
				for linenum, line in enumerate( fileinput.FileInput(FILE_VERSION, inplace=1)):
					if linenum==0:
						version = line.split(".")
						subVersion = int(version[2]) + 1
						newVersion = version[0] + "." + version[1] + "." + str(subVersion)
						line = line.replace(line, newVersion)
						print line.rstrip()
					else:
						print line.rstrip()
				os.chdir(jobdir)
			#update changelog and manifest
			os.chdir(os.path.basename(job.srcgit.addr))
			for linenum, line in enumerate( fileinput.FileInput(FILE_SPEC)):
				if linenum==1:
					versionLine = line.split("    ")
					tauVersion = versionLine[1]
					break
			print("tau version %s"%(tauVersion))

			os.chdir(jobdir)
			os.chdir(os.path.basename(job.destgit.addr))
			cmd("./update-pkg-version.py " + tauVersion)

		#remove unnecessary dir
		os.chdir(jobdir)
		cmd("rm -rf web-ui-fw")
		os.chdir(tempdir)
	os.chdir(cwd)
if __name__ == "__main__":
	main()
