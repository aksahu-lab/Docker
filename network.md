**Set up:**
Create a EC2 instance using AWS or VM using Azure:
sudo apt-get update -y
sudo apt install git-all
git --version
sudo apt install docker.io -y
sudo systemctl status docker
sudo usermod -aG docker ubuntu
sudo chmod 666 /var/run/docker.sock
docker run hello-world
