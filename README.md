# cp-pm-dashboard
Cloudport Product Management Dashboard

On amagi-cp-pm-board-client/
In the amagi-cp-pm-board-client/ folder execute the following command once after the code is downloaded
npm install
npm install -g serve
npm run build
serve -s build //this will cost this on port 3000. In case the port is unavailable. Use “serve -s build -l PORT#”
On code changes execute the following command
npm run build

On amagi-cp-pm-board-server/
In the amagi-cp-pm-board-serve/ folder execute the following command once after the code is downloaded
npm install
node server.js
On code changes execute the following command
node server.js