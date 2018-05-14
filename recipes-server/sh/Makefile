# Go params

GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GVTRESTORE=gvt restore

MAIN_C=$(CURDIR)/../mainC
CONF_PATH=$(CURDIR)/../configs
PACK_PATH=$(CURDIR)/../package
PACK_BIN_PATH=$(PACK_PATH)/bin
BIN=recipes-server

default: test build

test:
	$(GOTEST) ../... -v

build:
	mkdir $(PACK_PATH)
	mkdir $(PACK_BIN_PATH)
	cd $(MAIN_C) && $(GOBUILD) -o $(BIN)
	mv $(MAIN_C)/$(BIN) $(PACK_BIN_PATH)
	cp -r $(CONF_PATH) $(PACK_PATH)

clean:
	rm -fr $(PACK_PATH)

deps:
	cd $(CURDIR)/.. && $(GVTRESTORE)