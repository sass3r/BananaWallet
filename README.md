# BananaWallet
Installing MultiChain on Linux

- su (enter root password)
- cd /tmp
- wget https://www.multichain.com/download/multichain-2.0-release.tar.gz
- tar -xvzf multichain-2.0-release.tar.gz
- cd multichain-2.0-release
- mv multichaind multichain-cli multichain-util /usr/local/bin (to make easily accessible on the command line)
- exit (to return to your regular user)

Installing MultiChain on Windows
- Download https://www.multichain.com/download/multichain-windows-2.0-release.zip and extract its contents to bin directory.
- rename file mainWindows.js to main.js

Run project:
- npm install
- npm run test
