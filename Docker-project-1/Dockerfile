#My first python file

#Setting working directory
WORKDIR /app

#Copy app.py to working directory /app
COPY . /app

#Install python and PIP dependencies
RUN apt-get update && apt-get install -y python3 python3-pip

#Set environmental variables
ENV NAME World

#Run a command to start application
CMD ["python3", "app.py"]
