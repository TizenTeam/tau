#!/usr/bin/python
# author Heeju Joo <heeju.joo@samsung.com>
# This script is used for update latest TAU library to ide source and sdk-web-apps
# If you have any problem with this script, please contact author
import os, sys, subprocess, shutil, fileinput

cwd=os.getcwd()
syncdir=cwd+"/_sync"
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


# Git info
class webuifw(Git):
	addr="168.219.209.56:29418/framework/web/web-ui-fw"
	branch="devel/tau"

class slpwebuifw(Git):
	addr="165.213.149.219:29418/magnolia/framework/web/web-ui-fw"
	branch="devel/webappfw/tau"


def cloneAndMerge(git, targetdir):
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

	# add slp git as remote repo and merge SPIN_tau to slp_tau
	cmd("git remote add slp ssh://"+gitaccount+"@"+slpwebuifw.addr)
	cmd("git fetch slp "+slpwebuifw.branch+":"+slpwebuifw.branch)
	cmd("git checkout "+slpwebuifw.branch)
	cmd("git merge --no-ff "+webuifw.branch)

def main():
	global syncdir

	if os.path.isdir(syncdir):
		cmd("rm -rf "+syncdir)
	os.mkdir(syncdir)

	cloneAndMerge(webuifw, syncdir)

	pushcmd = "git push slp HEAD:refs/for/"+slpwebuifw.branch

	print "================================================================"
	print "Merge to slp web-ui-fw git finished!"
	print "================================================================"
	print "1. Go to '_sync/web-ui-fw' dir"
	print "2. Please add your commit message using 'git commit --amend'"
	print "3. Push to gerrit!(using following command)"
	print "==> "+pushcmd

if __name__ == "__main__":
	main()
