# VERSION 1 
# Author: Ming Yin
 
# 定义基础包
FROM nginx:1.17.2

#Maintainer
MAINTAINER Ming Yin 492960429@qq.com


# 设置时区
# 修改nginx启动用户为root
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone;\
     sed -i "s/user  nginx/user  root/" /etc/nginx/nginx.conf

# 拷贝程序
ADD dist /usr/share/nginx/html/dist
