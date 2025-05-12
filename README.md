# Run server locally
Commands-  

-git clone https://github.com/zannatin-tazri/Graphic-design-school-server.git  

-cd Graphic-design-school-server

Create .env file to the same level as package.json and paste environment variables   


-"npm install"  

-nodemon.index.js  



# Required environment variables 
DB_USER=graphic_gallery  

DB_PASS=JmbBMmvHcbtl8pgE  



# Build and run the container
-systemctl start docker  

-run "docker compose up --build"   

PORT : 5000  


# CI/CD pipeline yml file 
https://github.com/zannatin-tazri/Graphic-design-school-server/blob/main/.github/workflows/backend.yml  


The backend.yml file is configured for automating the CI/CD pipeline of the backend. It builds the Docker image, pushes it to Docker Hub, and deploys it to a remote server via SSH upon every push to the main branch.
