# Tutorial 6: waitlist system simple mobile app
### author: Zou Haoliang (E0674587)


## Quick Guide for running the App

### Step 0: Dev Enviroment
For this tutorial, I designed the mobile UI directly in my Windows 10 host machine (with Android Studio). The backend api can be run in a docker container with MongoDB installed or in the host machine.  
I chose to use a docker image originally installed with MongoDB to start the backend server. To get this image from Docker Hub, please use the command on your **host machine**:
```
docker pull mongo
docker run -dit --name <container_name> -p 127.0.0.1:3000:3000 -p 127.0.0.1:5000:5000 <mongo_image_name>
```
The backend server listens to port 5000, which is connected to localhost:5000.

### Step 1: Recover the Mobile (UI) Server (on Windows 10)
(for Linux system with GUI, just ensure that the git, nodejs, react-native CLI, JDK, Python and Android Studio are installed.)  
First of all, we should allow Windows to install packages the way Linux does. Please follow [this guidance](https://dev-yakuza.posstree.com/en/react-native/install-on-windows/#nodejs) to install Chocolatey, nodejs (please specify "--version 14.18.1"), React Native CLI, JDK and Android Studio. Remember to add and check the environment variables mentioned in the guidance.  
Meanwhile, please make sure git and Python has been installed on the server.  
Secondly, clone the resources from [Github](https://github.com/AlanZhl/IT5007_Toturials.git):
```
git clone https://github.com/AlanZhl/IT5007_Toturials.git
git checkout tut_6
git branch    # ensure the current branch is tut_6
```
Next, open a Windows terminal (Commandline or PowerShell) and change to the root directory of the tutorial. Then under the "/ui" directory, install all the dependencies with npm:
```
cd ui
npm install
```

### Step 2: Recover the Backend Server
Apart from ensuring a MongoDB server in the container, please ensure the container has the following packages installed (add "sudo" before the commands if necessary):
```
apt update
apt upgrade
apt install git
apt install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# restart the container to enable nvm
nvm --version
nvm install --lts
npm --version
```
After that, clone the resources from [Github](https://github.com/AlanZhl/IT5007_Toturials.git),
```
git clone https://github.com/AlanZhl/IT5007_Toturials.git
git checkout tut_6
git branch
```
and change directory to the "/api" folder under the root directory of the tutorial. Install all the dependencies with npm:
```
cd api
npm install
```

### Step 3: Starting the Program
For the backend server to run, navigate to the "/api" folder under the root directory, and start it with npm:
```
cd api
npm start
```
The Apollo server should start on port 5000, informing the existent customers inside the database (initially it should be 0).  
For the mobile frontend, we should first start up an Android Emulator in Android Studio with AVD manager.  
Open the mobile project (under "/ui" of the project root dir) in Android Studio and click on the top-right smartphone-like icon / select "Tools => AVD Manager". If no suitable device is available, create a new virtual device with system image "Q" (API level 29, targeted for Android 10.0). Launch the virtual device with power on.  
Next, open two terminals and change their directory both to "/ui" under the project root directory. For one of the terminal, run Metro with the command:
```
npx react-native start
```
And in the other, run the android app with:
```
npx react-native run-android
```
Hopefully, the application should be running on the virtual device! If necessary, press "r" in Metro or double click "r" on the emulator to reload the app.