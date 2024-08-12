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

**Docker network:**
1. Bridge network: Default network type
   docker run -d --name logout nginx:latest
   docker inspect logout ---> To check n/w type and IP 172.18.0.2

2. Custom bridge network:
   docker network create secure-network 
   docker run -d --name finance --network=secure-network nginx:latest
   docker inspect finance ---> 172.17.0.3

3. Host network:
   docker run -d --name host-demo --network=host nginx:latest

**List networks:**
docker network ls

**Connectivity check:**
docker run -d --name login nginx:latest
docker exec -it login /bin/bash
apt update -y
apt-get install iputils-ping -y
ping -V

root@f221ca549371:/# ping "172.17.0.3"
PING 172.17.0.3 (172.17.0.3) 56(84) bytes of data.
64 bytes from 172.17.0.3: icmp_seq=1 ttl=64 time=0.098 ms
64 bytes from 172.17.0.3: icmp_seq=2 ttl=64 time=0.066 ms
64 bytes from 172.17.0.3: icmp_seq=3 ttl=64 time=0.068 ms

root@f221ca549371:/# ping 172.18.0.2
PING 172.18.0.2 (172.18.0.2) 56(84) bytes of data.
^C
--- 172.18.0.2 ping statistics ---
21 packets transmitted, 0 received, 100% packet loss, time 20486ms




