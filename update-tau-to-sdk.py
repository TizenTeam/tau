#!/usr/bin/python
# author Youmin Ha <youmin.ha@samsung.com>
# author Heeju Joo <heeju.joo@samsung.com>
# This script is used for update latest TAU library to SDK samples git
# If you have any problem with this script, please contact Heeju Joo <heeju.joo@samsung.com>
import os, sys, subprocess, shutil, fileinput
import xml.etree.ElementTree as ET
import jenkins
import time

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
	addr="165.213.149.170:29418/framework/web/web-ui-fw"
	branch="devel/tizen_3.0"

class MobileUIComponent(Git):
	addr="165.213.149.170:29418/apps/mobile/web/sample/tizen-winset"
	branch="tizen_3.0"
	type="onlineSample"

class TizenGlobalize(Git):
	addr="165.213.149.170:29418/apps/mobile/web/sample/tizen-globalize"
	branch="tizen_3.0"
	type="onlineSample"

class TAUMasterDetail(Git):
	addr="165.213.149.170:29418/apps/mobile/web/template/tau-master-detail"
	branch="tizen_3.0"
	type="template"

class TAUMultiPage(Git):
	addr="165.213.149.170:29418/apps/mobile/web/template/tau-multi-page"
	branch="tizen_3.0"
	type="template"

class TAUSinglePage(Git):
	addr="165.213.149.170:29418/apps/mobile/web/template/tau-single-page"
	branch="tizen_3.0"
	type="template"

class WearableUIComponent(Git):
	addr="165.213.149.170:29418/apps/wearable/web/sample/wearable-widget-sample"
	branch="tizen_3.0"
	type="onlineSample"

class TAUBasic(Git):
	addr="165.213.149.170:29418/apps/wearable/web/template/tau-basic"
	branch="tizen_3.0"
	type="template"

class TAUList(Git):
	addr="165.213.149.170:29418/apps/wearable/web/template/tau-list"
	branch="tizen_3.0"
	type="template"

# job list
jobs = {
	"mobile": Job(
		webuifw,
		[MobileUIComponent, TAUMasterDetail, TAUMultiPage, TAUSinglePage],
		[
			SrcDest("web-ui-fw/examples/mobile/UIComponents", "tizen-winset/project"),
			SrcDest("web-ui-fw/dist/mobile", "tizen-winset/project/lib/tau"),
			SrcDest("web-ui-fw/dist/animation", "tizen-winset/project/lib/tau/animation"),
			#SrcDest("web-ui-fw/examples/mobile/Tizen_Web_UI_FW_Globalize", "tizen-globalize/project"),
			#SrcDest("web-ui-fw/dist/mobile", "tizen-globalize/project/lib/tau"),
			SrcDest("web-ui-fw/examples/mobile/MasterDetail", "tau-master-detail/project"),
			SrcDest("web-ui-fw/dist/mobile", "tau-master-detail/project/lib/tau"),
			SrcDest("web-ui-fw/examples/mobile/MultiPage", "tau-multi-page/project"),
			SrcDest("web-ui-fw/dist/mobile", "tau-multi-page/project/lib/tau"),
			SrcDest("web-ui-fw/examples/mobile/SinglePage", "tau-single-page/project"),
			SrcDest("web-ui-fw/dist/mobile", "tau-single-page/project/lib/tau")
		], ["cd web-ui-fw/tau", "npm install", "grunt build"],
		[
			SrcDest("web-ui-fw/dist/VERSION", "tizen-winset/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/dist/LICENSE.Flora", "tizen-winset/project/lib/tau/LICENSE.Flora"),
			#SrcDest("web-ui-fw/dist/VERSION", "tizen-globalize/project/lib/tau/VERSION"),
			#SrcDest("web-ui-fw/dist/LICENSE.Flora", "tizen-globalize/project/lib/tau/LICENSE.Flora"),
			SrcDest("web-ui-fw/dist/VERSION", "tau-master-detail/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/dist/LICENSE.Flora", "tau-master-detail/project/lib/tau/LICENSE.Flora"),
			SrcDest("web-ui-fw/dist/VERSION", "tau-multi-page/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/dist/LICENSE.Flora", "tau-multi-page/project/lib/tau/LICENSE.Flora"),
			SrcDest("web-ui-fw/dist/VERSION", "tau-single-page/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/dist/LICENSE.Flora", "tau-single-page/project/lib/tau/LICENSE.Flora")
		]),
	"wearable": Job(
		webuifw,
		[WearableUIComponent, TAUBasic, TAUList],
		[
			SrcDest("web-ui-fw/examples/wearable/UIComponents", "wearable-widget-sample/project"),
			SrcDest("web-ui-fw/dist/wearable", "wearable-widget-sample/project/lib/tau"),
			SrcDest("web-ui-fw/examples/wearable/TemplateBasic", "tau-basic/project"),
			SrcDest("web-ui-fw/dist/wearable", "tau-basic/project/lib/tau"),
			SrcDest("web-ui-fw/examples/wearable/TemplateList", "tau-list/project"),
			SrcDest("web-ui-fw/dist/wearable", "tau-list/project/lib/tau")
		], ["cd web-ui-fw/tau", "npm install", "grunt build"],
		[
			SrcDest("web-ui-fw/dist/VERSION", "wearable-widget-sample/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/dist/LICENSE.Flora", "wearable-widget-sample/project/lib/tau/LICENSE.Flora"),
			SrcDest("web-ui-fw/dist/VERSION", "tau-basic/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/dist/LICENSE.Flora", "tau-basic/project/lib/tau/LICENSE.Flora"),
			SrcDest("web-ui-fw/dist/VERSION", "tau-list/project/lib/tau/VERSION"),
			SrcDest("web-ui-fw/dist/LICENSE.Flora", "tau-list/project/lib/tau/LICENSE.Flora")
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

def pushGit(targetdir, tauVersion, profile):
	cwd=os.getcwd()
	os.chdir(targetdir)
	targetBranch = ""

	# get SDK Sample project Name from xml file
	tree = ET.parse(FILE_XML)
	root = tree.getroot()
	projectName = root.find('SampleName').text

	targetBranch = "tizen_3.0"
	if (profile == "mobile") and (targetdir.find("tizen-") > -1):
		updateSampleVersion(tree, root)
	elif (profile == "wearable") and (targetdir.find("wearable-widget-sample") > -1):
		updateSampleVersion(tree, root)

	# make commit and push to gerrit
	cmd("git checkout -- project/config.xml")
	cmd("git add -A")
	logmsg = projectName.replace(" ", "") + "-TAU(" + tauVersion + ")release"

	cmd("git commit -m " + logmsg)
	cmd("git push origin HEAD:refs/for/" + targetBranch)

	targetCommit = subprocess.check_output("git log --format='%H' -n 1", shell=True).replace("\n", "")
	cmd("ssh -p 29418 " + gitaccount + "@165.213.149.170 gerrit review --verified +1 --code-review +2 --submit " + targetCommit)

	os.chdir(cwd)

def updateSampleVersion(tree, root):
	current_version = root.findtext("SampleVersion")

	split_version = current_version.split(".")

	for i in range(len(split_version)-1, -1, -1):
		split_version[i] = int(split_version[i])
		if (split_version[i] < 99 and split_version[i] > 9 and i == 2) or (split_version[i] < 9 and i == 1) or i == 0:
			split_version[i] += 1
			break
		elif i == 2 and split_version[i] < 10:
			split_version[i] = 10
			break
		elif i == 2:
			split_version[i] = 10
			continue
		elif i == 1:
			split_version[i] = 0
			continue

	changed_version = str(split_version[0]) + "." + str(split_version[1]) + "." + str(split_version[2])

	for version in root.iter("SampleVersion"):
		version.text = changed_version

	tree.write(FILE_XML, encoding="utf-8", xml_declaration=True)

def executeJenkinsJobs(git):
	sampleGitPath = git.addr.replace("165.213.149.170:29418/", "")
	jenkinsServer = jenkins.Jenkins('http://10.113.63.84:8080', username='sample', password='7499d2004e9e229d1512218208a36225')
	iterationWaiting = 0

	print("[Jenkins job] upload to spin " + os.path.basename(git.addr) + " / " + git.branch)
	jenkinsServer.build_job('online_sample_upload_to_spin', {'sample_git_path': sampleGitPath, 'branch_name': git.branch}, '7499d2004e9e229d1512218208a36225')
	queueInfo = jenkinsServer.get_queue_info()
	print "waiting remaining builds",
	sys.stdout.flush()

	while len(queueInfo) > 0:
		iterationWaiting = iterationWaiting + 1
		if iterationWaiting > 10:
			print("Please check jenkins status and build manually.")
			break
		print ".",
		sys.stdout.flush()
		time.sleep(5)
		queueInfo = jenkinsServer.get_queue_info()

	print("")
	print("[Jenkins job] copy to stable " + os.path.basename(git.addr) + " / " + git.branch)
	jenkinsServer.build_job('online_sample_copy_to_stable', {'snapshot_name': sampleGitPath, 'sample_list': sampleGitPath + "," + git.branch}, '7499d2004e9e229d1512218208a36225')

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
			pushGit(project, tauVersion.strip(), k)

		for git in job.destgit:
			if git.type == "onlineSample":
				executeJenkinsJobs(git)

		os.chdir(tempdir)
	os.chdir(cwd)
if __name__ == "__main__":
	main()
