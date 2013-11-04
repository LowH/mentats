##  Makefile for $NAME
##  Usage: make (|build|clean|install|load|targets)

APP = mentats

##  Production settings, override in config/local.mk

APP_USER = mentats:mentats
WEB_USER = mentats:_nginx

. include "lib/triangle/server/app.mk"
