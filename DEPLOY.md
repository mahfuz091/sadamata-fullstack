# Deploy

Production runs on the Sadamata EC2 box at `/mnt/mydrive/sadamata-fullstack`,
managed by PM2 (`ecosystem.config.cjs`). Deploys are driven by GitHub Actions;
GitHub is the source of truth and the server never edits tracked files by hand.

## Flow

1. Push to `main` (or run the workflow manually) triggers
   `.github/workflows/deploy.yml`.
2. The workflow SSHes into the server and:
   - backs up `dashboard/uploads` to `~/uploads-backup-<timestamp>` and prunes
     old backups (keeps the latest 5),
   - runs `git fetch origin main && git reset --hard origin/main`,
   - restores the uploads without overwriting anything (`cp -an`), because
     uploads are no longer tracked and `reset --hard` removes the old files,
   - runs `bash deploy.sh`.
3. `deploy.sh` discovers every top-level folder that has a `package.json`,
   builds only the ones that changed since the last deploy, and reloads PM2.
   It records the deployed SHA in `~/.last_deployed_sha` only after all builds
   succeed, so a failed build is retried on the next deploy.

## One-time EC2 setup

Run these once on the server (as `ubuntu`):

```bash
# 1. Ownership
sudo chown -R ubuntu:ubuntu /mnt/mydrive/sadamata-fullstack

# 2. Generate a dedicated deploy key (no passphrase)
ssh-keygen -t ed25519 -f ~/.ssh/gh_deploy -N ""
cat ~/.ssh/gh_deploy.pub >> ~/.ssh/authorized_keys

# 3. Seed the deployed-SHA state so the next deploy only rebuilds what changed
cd /mnt/mydrive/sadamata-fullstack
git rev-parse HEAD > ~/.last_deployed_sha

# 4. Remove the old untracked deploy.sh (the tracked one replaces it)
rm -f /mnt/mydrive/sadamata-fullstack/deploy.sh

# 5. Make sure PM2 owns the apps as ubuntu, not root
#    (pm2 delete all as root if any were started there, then, as ubuntu:)
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # follow the printed instructions so apps survive a reboot
```

Copy the **private** key `~/.ssh/gh_deploy` into the `EC2_SSH_KEY` secret.

## GitHub secrets

Add these under Settings → Secrets and variables → Actions:

| Secret        | Value                                            |
| ------------- | ------------------------------------------------ |
| `EC2_HOST`    | Public IP / hostname of the EC2 instance         |
| `EC2_USER`    | `ubuntu`                                         |
| `EC2_SSH_KEY` | Contents of the private key `~/.ssh/gh_deploy`   |

The workflow never prints secrets.

## Roll back

Because the server just tracks `origin/main`, roll back by reverting the bad
change and pushing:

```bash
git revert <bad-commit>
git push origin main
```

The push triggers a deploy and the server returns to the reverted state. For a
clean multi-commit rollback, `git revert --no-commit <oldest>..<newest>` then a
single commit works too. Avoid `git reset --hard` + force-push: the server only
ever follows `origin/main`, so history that is force-pushed away is lost.
