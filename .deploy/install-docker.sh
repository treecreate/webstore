#!/bin/bash

# This file requires the permissions: -rwxr-xr-x aka chmod 755

# This file is not actively in use and may be deleted in the future

sudo yum install -y yum-utils

sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

sudo yum install docker-ce docker-ce-cli containerd.io -y

sudo systemctl start docker
