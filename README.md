# Tutorial 5: waitlist system linked with mongoDB
### author: Zou Haoliang (E0674587)


## Quick Guide for running the App

### Step 0: Preparations
First of all, please make sure you have MongoDB installed in your machine. I choose to use the Ubuntu (20.04.3 LTS) image with MongoDB (version 5.0.3) provided on Docker Hub, and it works fine with my programs. To get this image from Docker Hub, please use the command on your **host machine**:
```
docker pull mongo
```
Before trying out the following steps, please check if the server system has the following packages installed ("add 'sudo' before the commands if necessary"):
```
apt update
apt upgrade
apt install git
apt install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# restart the container to enable nvm
nvm --version
nvm install 10
npm install -g npm@6
```

### Step 1 [should have installed git]: Clone from Github
Github Repo: [Github Repo](https://github.com/AlanZhl/IT5007_Toturials.git)
```
git clone https://github.com/AlanZhl/IT5007_Toturials.git
```
Contents for tutorial 5 are currently in branch "main".

### Step 2 [should have installed npm globally]: Restore the frontend and backend dependencies
(under the root directory of the app)
```
cd api
npm install
cd ../ui
npm install
```

### Step 3 [should have installed MongoDB server in the image locally]: Test MongoDB connection and CRUD operations
(under the root directory)
[Notice: the collection of "waitlist" should be stored in a database called "tutorial_IT5007"]
```
node api/scripts/trymongo.js
```

### Step 4: (Compile and) Run the tutorial programs
(under the root directory)

a) Starting the backend api server in a shell command line:
```
cd api
npm start
```

b) Starting the ui server support in a new shell command line:
```
cd ui
npm start
```

(Optional: compile the .jsx file again in a separate shell:
```
cd ui
npm run watch
```
)

### Step 5: Visit the app as a client
Open a browser in the host machine and visit [Tutorial Entry port](http://localhost:3000). Hopefully everything should work!