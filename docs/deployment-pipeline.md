# Deployment Pipeline

In this document I will explain how the pipeline is set up, what it does and what files are needed for it to work.

---

## What it do doe?

The file that executes the pipeline is called build-and-deploy.yml.
It is stored in the .github/workflows directory.

It is triggered on pushes done on

- development
- admin-page
- production.

_admin-page trigger may be removed at a future date_

### Here is the sequence of events:

1. `PROFILE` env is set based on the branch that called the process
2. Clone the repository
3. Log in to DockerHub with the use of GitHub secrets
4. Use the docker-compose to build the images with the profile flag of `--profile $PROFILE`
5. Push the built images to DockerHub
6. SSH into the EC2 instance and run `login-and-update.sh`
   - That script does these actions:
     - Logs in to DockerHub
     - Executes `docker-compose pull`
     - Executes `docker-compose --profile $PROFILE up -d`

### Where be the files doe?

The required files are stored in these following directories:

All env files are stored inside the .deploy directory in their own directory called .env-files

This folder requires the following files:

- .env.dev.api
- .env.dev.frontend
- .env.prod.api
- .env.prod.frontend
- .env.dockerhub

The repository also contains example files in that same directory to know precisely what envs are needed to deploy the project. Those files are named the same as the required files but contain an additional '.example' suffix.

On the deployment machine the files are located in the following directories, from the user root:

- .deploy/
  - docker-compose-run.yml
  - .env-files/
    - .env.dev.api
    - .env.dev.frontend
    - .env.prod.api
    - .env.prod.frontend
    - .env.dockerhub
- scripts/
  - login-and-update.sh

Once GitHub actions is logged in to the deployment machine it will execute the `login-and-update` script and it will take care of the rest

All the listed files are required for this workflow to complete, as they are required by the docker-compose files
