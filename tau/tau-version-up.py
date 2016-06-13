#!/usr/bin/python
# author Hagun Kim <hagun.kim@samsung.com>
# This script is used for update TAU version in own git
import os, sys, subprocess, shlex, datetime

gitaccount=""
tauVersion=""
userName=""
FILE_CHANGELOG = "../packaging/changelog"
FILE_SPEC = "../packaging/web-ui-fw.spec"
FILE_PACKAGEJSON = "./package.json"

if(len(sys.argv) < 4):
	print("Please input TAU version, account ID, Real name for changelog\nex] ./tau-version-up.py 0.13.2 hagun.kim 'Hagun Kim'")
	sys.exit(1)

if(len(sys.argv) == 4):
	tauVersion=sys.argv[1]
	gitaccount=sys.argv[2]
	userName=sys.argv[3]

def cmd(command):
	return subprocess.call(shlex.split(command))

def pushGit():
	# make commit and push to gerrit
	cmd("git add " + FILE_CHANGELOG + " " + FILE_SPEC + " " + FILE_PACKAGEJSON)
	logmsg = "TAU " + tauVersion + " release"

	cmd("git commit -s -m '" + logmsg + "'")
	cmd("git push origin HEAD:refs/for/devel/tizen_3.0")

def addReviewer():
	targetCommit = subprocess.check_output("git log --format='%H' -n 1", shell=True).replace("\n", "")
	setReviewerCommand = "ssh -p 29418 " + gitaccount + "@165.213.149.170 gerrit set-reviewers -a hk0713.cho@samsung.com "
	cmd(setReviewerCommand + targetCommit)

def modifyFile(filePath, textParam):
	f = open(filePath, "r")
	fText = f.readlines()
	f.close()

	if (filePath == FILE_CHANGELOG):
		fText.insert(1, textParam)
	elif (filePath == FILE_SPEC):
		fText[1] = "Version:     " + tauVersion + "\n"
	else:
		fText[4] = '  "version": "' + tauVersion + '",\n'

	fText = "".join(fText)
	f = open(filePath, "w")
	f.write(fText)
	f.close()

def main():
	latestTag = subprocess.check_output("git describe --abbrev=0 --tags", shell=True).replace("\n", "")
	gitLogCommand = 'git log --pretty=oneline --no-merges ' + latestTag + '..HEAD | sed -e "s/^\S* /- /g"'.replace("-", "\t-")

	gitLog = os.popen(gitLogCommand).read()
	now = datetime.datetime.now().strftime("%a %b %d %Y")

	gitLog = "* " + now + " " + userName + " <" + gitaccount + "@samsung.com> " + tauVersion + "\n" + gitLog + "\n"

	print("Update changelog file")
	modifyFile(FILE_CHANGELOG, gitLog)
	print("Update web-ui-fw.spec file")
	modifyFile(FILE_SPEC, False)
	print("Update package.json file")
	modifyFile(FILE_PACKAGEJSON, False)

	pushGit()

	addReviewer()

	print("GIT push completed. Please merge and tag.")

if __name__ == "__main__":
	main()
