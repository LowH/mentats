##  Makefile for mentats
##  Usage: make (|build|clean|install|load|targets)

APP = mentats

##  Production settings, override in config/local.mk

APP_USER = mentats
APP_GROUP = mentats
WEB_USER = mentats
WEB_GROUP = www

. include "lib/triangle/server/app.mk"
