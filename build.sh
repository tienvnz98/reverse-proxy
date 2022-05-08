export VERSION=$(cat package.json | grep version | head -1 | awk -F= "{ print $2 }" | sed 's/[version:,\",]//g' | tr -d '[[:space:]]') &&   
export IMAGE_NAME=tienvnz98/reverse-proxy &&
docker build -t $IMAGE_NAME:latest . && 
docker push $IMAGE_NAME:latest &&
docker build -t $IMAGE_NAME:$VERSION . &&
docker push $IMAGE_NAME:$VERSION &&
echo "Build docker image $IMAGE_NAME:$VERSION" success