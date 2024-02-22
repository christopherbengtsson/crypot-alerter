# Docker commands

- Persist data:
  - docker volume create crypto-alerts-db
- Build:
  - docker build -t crypto-alerts .
- Run:
  dev:
  - docker run -dp 127.0.0.1:8080:8080 crypto-alerts
  - docker run -dp 127.0.0.1:8080:8080 --mount type=volume,src=crypto-alerts-db,target=/etc/db crypto-alerts
    prod:
  - docker run -dp 8080:8080 --mount type=volume,src=crypto-alerts-db,target=/db crypto-alerts
- compose:
  - docker-compose build
  - docker-compose up -d
  - docker-compose down
- List:
  - docker ps
- Stop:
  - docker stop <containerID>
- Delete:
  - docker rm <containerID>
