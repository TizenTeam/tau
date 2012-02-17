========================================================
How to create your patches for the libraries under libs/
========================================================

	1. Run libs/patch/prepare-patch.sh

This script does followings;
  * Create a temporary branch and move to it.
  * Apply existing patches under libs/patch/ into the temporary branch.


	2. Change library code in libs/

Edit code under libs/ that you want to fix.


	3. Apply changed code into git

Run git add, git commit to remember your code.
Write your commit message to descrbe well about your patch. The commit message will be the name of patch file.


	4. Run libs/patch/create-patch.sh

This script does followings;
  * Extract your commit as a patch file, and save it into libs/patch/.
  * Move to original branch, and delete temporary branch.

Whenever you want to cancel the patching, just run create-patch.sh with --cancel option.
With this option, any commits and temporary branch will be deleted.


	5. Add your patch file into git

Now your patch file is found in libs/patch/. Add your patch file into git.

WARNING: Do not add other patch files into git! Only your new patch must be added.

