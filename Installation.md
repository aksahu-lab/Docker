**INSTALL DOCKER:**
1. You can create an Ubuntu EC2 Instance on AWS and run the below commands to install docker.
**sudo apt update
sudo apt install docker.io -y**

2. verify your Docker installation is by running the below command
docker run hello-world

Error: docker: Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Post "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/containers/create": dial unix /var/run/docker.sock: connect: permission denied.
See 'docker run --help'.

This can mean two things,
**a. Docker deamon is not running.
b. Your user does not have access to run docker commands.**

a. Start Docker daemon
**sudo systemctl status docker**

If you notice that the docker daemon is not running, you can start the daemon using the below command
**sudo systemctl start docker**

b. To grant access to your user to run the docker command, you should add the user to the Docker Linux group. Docker group is create by default when docker is installed.
**sudo usermod -aG docker ubuntu**

Docker is Installed, up and running:
**docker run hello-world**

**Output:**
....
....
Hello from Docker!
This message shows that your installation appears to be working correctly.
...
...




