## Copyright (c) 2015 - Littlstar

##
# Standalone library namespace
STANDALONE := chasma

##
# node_modules/ patch
NODE_MODULES := node_modules

##
# Browserify bin path
BROWSERIFY := $(NODE_MODULES)/.bin/browserify

##
# Tests tor un
TESTS := $(wildcard test/*.js)

##
# uglifyjs bin path
UGLIFY := $(NODE_MODULES)/.bin/uglifyjs

##
# npm bin path
NPM := $(shell which npm)

default: $(NODE_MODULES)
	$(NPM) run compile

$(NODE_MODULES): package.json
	$(NPM) install

##
# Create dist build
.PHONY: dist
dist: default
	mkdir -p $(@)
	$(UGLIFY) --compress --mangle --output $@/$(STANDALONE).js -- lib/$(STANDALONE).js

clean:
	$(RM) -rf lib/
	$(RM) -rf components/
	$(RM) -rf node_modules/
