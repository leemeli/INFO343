# INFO 343 Challenges
This repository contains projects completed as challenges for the [Client Side Web Development](https://canvas.uw.edu/courses/1066606) course at the UW iSchool.


## How to Use

See the [Git Challenge](http://info343-au16.github.io/#/challenges/git) page for details about getting started with this repository.

## Getting Changes from the Upstream Repository

The original version of this repository may update throughout the quarter. Any copies or _forks_ of this repo will thus need to pull in changes from the "upstream" original in order to merge in those changes. Follow these steps to do so:

First execute the following to see your current set of remotes:

```
git remote -v
```

If there is a remote named `upstream` listed, then you have already added the upstream remote. If you don't see a remote named `upstream`, execute this command to add it:

```
git remote add upstream https://github.com/info343-au16/challenges.git
```

Now use _git_ to `pull` any new commits that have been made to the `upstream` remote's `master` branch:

```
git pull upstream master
```

This will fetch the new commits and **merge** them into your repository files (you will need to [resolve any resulting merge conflicts](https://help.github.com/articles/resolving-a-merge-conflict-from-the-command-line/)). 

After that finishes, you can push your changes (that now include merging in the new starter code) back up to your forked repository (the `origin`) using the command:

```
git push origin
```
