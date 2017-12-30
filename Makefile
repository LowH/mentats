##  Makefile for mentats
##  Usage: make (|build|clean|install|load|targets)

APP = mentats

##  Production settings, override in config/local.mk

MEM = 512
APP_USER = mentats
APP_GROUP = mentats
WEB_USER = mentats
WEB_GROUP = _nginx

include lib/rol/server/app.mk
